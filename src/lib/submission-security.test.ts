import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv(
    "DISCORD_WEBHOOK_URL",
    "https://discord.com/api/webhooks/test/fixture",
  );
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("KV_REST_API_URL", "");
  vi.stubEnv("KV_REST_API_TOKEN", "");
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
const payload = {
  toolName: "Fixture tool",
  link: "https://example.com/audit-fixture",
  category: "Websites",
  description: "A useful fixture for testing delivery.",
};
const request = (
  body: unknown = payload,
  headers: Record<string, string> = {},
) =>
  new Request("https://randomstuff.test/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
describe("submission security and delivery", () => {
  it("delivers in production with only the existing Discord webhook configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    const { GET, POST } = await import("@/app/api/submit/route");
    expect(await (await GET()).json()).toMatchObject({ available: true });
    expect((await POST(request())).status).toBe(201);
    expect((await POST(request())).status).toBe(409);
    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      process.env.DISCORD_WEBHOOK_URL,
      expect.objectContaining({ method: "POST" }),
    );
  });
  it("retains local rate limits in production without Redis", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { limitSubmission } = await import("./submission-store");
    for (let i = 0; i < 5; i++)
      expect((await limitSubmission("fixture")).allowed).toBe(true);
    expect((await limitSubmission("fixture")).allowed).toBe(false);
  });
  it("reports unavailable when the Discord webhook is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DISCORD_WEBHOOK_URL", "");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { GET, POST } = await import("@/app/api/submit/route");
    expect(await (await GET()).json()).toMatchObject({ available: false });
    expect((await POST(request())).status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("enforces request size, protocol, content type and cross-origin checks", async () => {
    const { POST } = await import("@/app/api/submit/route");
    expect((await POST(request("x".repeat(9000)))).status).toBe(413);
    expect(
      (await POST(request({ ...payload, link: "javascript:alert(1)" }))).status,
    ).toBe(400);
    expect(
      (await POST(request(payload, { "Content-Type": "text/plain" }))).status,
    ).toBe(415);
    expect(
      (await POST(request(payload, { Origin: "https://unrelated.test" })))
        .status,
    ).toBe(403);
  });
  it("acknowledges only confirmed delivery and prevents duplicates", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    const { POST } = await import("@/app/api/submit/route");
    expect((await POST(request())).status).toBe(201);
    expect((await POST(request())).status).toBe(409);
    expect(fetch).toHaveBeenCalledOnce();
    expect(JSON.parse(fetch.mock.calls[0][1].body).allowed_mentions).toEqual({
      parse: [],
    });
  });
  it("releases reservations after explicit delivery failure", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 502 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetch);
    const { POST } = await import("@/app/api/submit/route");
    expect((await POST(request())).status).toBe(502);
    expect((await POST(request())).status).toBe(201);
  });
  it("retains a reservation when delivery cannot be confirmed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    const { POST } = await import("@/app/api/submit/route");
    expect((await POST(request())).status).toBe(504);
    expect((await POST(request())).status).toBe(409);
  });
  it("expires duplicate records at 24 hours even with a small store", async () => {
    vi.useFakeTimers();
    const { reserveSubmission } = await import("./submission-store");
    expect(await reserveSubmission("fixture", "https://example.com")).toBe(
      true,
    );
    expect(await reserveSubmission("fixture", "https://example.com")).toBe(
      false,
    );
    vi.advanceTimersByTime(86400000);
    expect(await reserveSubmission("fixture", "https://example.com")).toBe(
      true,
    );
  });
  it("limits attempts and resets at the window boundary", async () => {
    vi.useFakeTimers();
    const { limitSubmission } = await import("./submission-store");
    for (let i = 0; i < 5; i++)
      expect((await limitSubmission("fixture")).allowed).toBe(true);
    expect((await limitSubmission("fixture")).allowed).toBe(false);
    vi.advanceTimersByTime(900000);
    expect((await limitSubmission("fixture")).allowed).toBe(true);
  });
  it("uses atomic Redis commands without storing raw identifiers", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.com");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "fixture-token");
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ result: [1, 900000] }))
      .mockResolvedValueOnce(Response.json({ result: 1 }));
    vi.stubGlobal("fetch", fetch);
    const store = await import("./submission-store");
    expect((await store.limitSubmission("192.0.2.4")).allowed).toBe(true);
    expect(
      await store.reserveSubmission("fixture", "https://example.com"),
    ).toBe(true);
    for (const call of fetch.mock.calls) {
      const data = call[1].body as string;
      expect(data).not.toContain("192.0.2.4");
      expect(data).not.toContain("https://example.com");
      expect(JSON.parse(data)[0]).toBe("EVAL");
    }
  });
});
