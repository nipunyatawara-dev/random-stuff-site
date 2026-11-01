import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getItems } from "@/lib/items-server";
import {
  limitSubmission,
  releaseSubmission,
  reserveSubmission,
  StoreUnavailable,
} from "@/lib/submission-store";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 8192;
import { normalizeSubmissionUrl } from "@/lib/submission-validation";
function reply(error: string, status: number, retryAfter?: number) {
  return NextResponse.json(
    { error },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
      },
    },
  );
}
async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES)
    throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let length = 0;
  const timer = setTimeout(() => reader.cancel().catch(() => {}), 5000);
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_BODY_BYTES) throw new RangeError();
      chunks.push(value);
    }
  } finally {
    clearTimeout(timer);
    await reader.cancel().catch(() => {});
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function GET() {
  return NextResponse.json(
    {
      available: Boolean(process.env.DISCORD_WEBHOOK_URL),
      storage: "Suggestions are sent to Discord for manual review.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  const deadline = AbortSignal.any([
    request.signal,
    AbortSignal.timeout(12000),
  ]);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return reply("Please submit from this website.", 403);
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return reply("Send JSON content.", 415);
  if (!process.env.DISCORD_WEBHOOK_URL)
    return reply(
      "Suggestions are temporarily unavailable. Please use the repository issue link.",
      503,
      60,
    );
  try {
    // Vercel overwrites x-forwarded-for. Never prioritize arbitrary x-real-ip headers.
    const identity =
      process.env.VERCEL === "1"
        ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown"
        : "shared-non-vercel-limit";
    const limit = await limitSubmission(identity, deadline);
    if (!limit.allowed)
      return reply(
        "Too many suggestions. Please try again later.",
        429,
        limit.retryAfter,
      );
    let body;
    try {
      body = await readBody(request);
    } catch (error) {
      return reply(
        error instanceof RangeError
          ? "Suggestion is too large."
          : "Invalid JSON payload.",
        error instanceof RangeError ? 413 : 400,
      );
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      return reply("Invalid suggestion.", 400);
    if (typeof body.honeypot === "string" && body.honeypot.trim())
      return reply("Suggestion rejected.", 400);
    const toolName =
      typeof body.toolName === "string" ? body.toolName.trim() : "";
    const link = typeof body.link === "string" ? body.link.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    if (
      !toolName ||
      !description ||
      !link ||
      toolName.length > 80 ||
      link.length > 500 ||
      description.length > 500 ||
      !["Websites", "Softwares", "Scripts"].includes(body.category)
    )
      return reply("Complete every field within the stated limits.", 400);
    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeSubmissionUrl(link);
    } catch {
      return reply(
        "Enter a valid public HTTP(S) URL without credentials.",
        400,
      );
    }
    const normalizedName = toolName.toLowerCase().replace(/\s+/g, " ");
    const items = await getItems();
    if (
      items.some(
        (item) =>
          item.title.toLowerCase().replace(/\s+/g, " ") === normalizedName ||
          [item.website, item.github].some(
            (url) => url && normalizeSubmissionUrl(url) === normalizedUrl,
          ),
      )
    )
      return reply("This tool already exists in the directory.", 409);
    if (!(await reserveSubmission(normalizedName, normalizedUrl, deadline)))
      return reply("This tool was suggested in the last 24 hours.", 409);
    const receipt = createHash("sha256")
      .update(normalizedUrl)
      .digest("hex")
      .slice(0, 12);
    try {
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allowed_mentions: { parse: [] },
          embeds: [
            {
              title: "Tool suggestion",
              fields: [
                { name: "Name", value: toolName },
                { name: "URL", value: normalizedUrl },
                { name: "Category", value: body.category },
                { name: "Description", value: description },
              ],
              footer: { text: `Receipt ${receipt}` },
            },
          ],
        }),
        signal: AbortSignal.any([deadline, AbortSignal.timeout(6000)]),
      });
      if (!response.ok) {
        await releaseSubmission(normalizedName, normalizedUrl, deadline);
        return reply(
          "Delivery failed. Your suggestion was not accepted; please retry.",
          502,
          30,
        );
      }
    } catch {
      // On an ambiguous timeout retain the reservation to avoid duplicate delivery.
      return reply(
        "We could not confirm delivery. Please wait before retrying or report this receipt: " +
          receipt,
        504,
        60,
      );
    }
    return NextResponse.json(
      { message: "Suggestion delivered for manual review.", receipt },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return reply(
      error instanceof StoreUnavailable
        ? "Suggestions are temporarily unavailable. Please use the repository issue link."
        : "Unable to accept this suggestion. Please retry later.",
      503,
      60,
    );
  }
}
