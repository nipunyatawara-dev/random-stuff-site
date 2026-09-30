import { lookup } from "dns/promises";
import { isIP } from "net";

import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const REQUEST_TIMEOUT_MS = 5000;
const MAX_CONTENT_LENGTH_BYTES = 2_000_000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const metadataRateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  return (
    request.headers.get("x-vercel-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function checkMetadataRateLimit(clientIp: string) {
  const now = Date.now();
  if (metadataRateLimitStore.size > 1000) {
    for (const [key, entry] of metadataRateLimitStore) {
      if (entry.resetAt <= now) metadataRateLimitStore.delete(key);
    }
  }

  const current = metadataRateLimitStore.get(clientIp);
  if (!current || current.resetAt <= now) {
    metadataRateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

function isPrivateIpAddress(value: string) {
  if (value.startsWith("::ffff:")) {
    return isPrivateIpAddress(value.slice(7));
  }

  const version = isIP(value);
  if (version === 4) {
    const [first, second] = value.split(".").map(Number);
    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 198 && (second === 18 || second === 19))
    );
  }

  if (version === 6) {
    const normalized = value.toLowerCase();
    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized === "0:0:0:0:0:0:0:0" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb")
    );
  }

  return false;
}

function validateMetadataUrlFormat(rawUrl: string) {
  const parsedUrl = new URL(rawUrl);
  const protocol = parsedUrl.protocol.toLowerCase();

  if (protocol !== "http:" && protocol !== "https:") {
    throw new Error("Only HTTP(S) URLs are allowed.");
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error("Authenticated URLs are not allowed.");
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Local URLs are not allowed.");
  }

  if (isIP(hostname) && isPrivateIpAddress(hostname)) {
    throw new Error("Private network URLs are not allowed.");
  }

  return parsedUrl;
}

async function customLookup(
  hostname: string,
  options: import("dns").LookupOptions,
  callback: (err: NodeJS.ErrnoException | null, address?: string | import("dns").LookupAddress[], family?: number) => void
) {
  try {
    const records = await lookup(hostname, { all: true, verbatim: true });
    if (records.some((record) => isPrivateIpAddress(record.address))) {
      return callback(new Error("Private network URLs are not allowed."), undefined, undefined);
    }
    // Type casting because the callback signature expects string when all is false, but we use it differently.
    // However, Node's http uses the callback with (err, address, family) when all is false.
    // To make TypeScript happy and work with http request:
    callback(null, records[0].address, records[0].family);
  } catch (err) {
    callback(err as NodeJS.ErrnoException, undefined, undefined);
  }
}

import * as http from "http";
import * as https from "https";

function fetchWithSafeLookup(url: string | URL, redirectCount = 0): Promise<{ html: string; finalUrl: string }> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 3) return reject(new Error("Too many redirects"));
    
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.toString());
      parsedUrl = validateMetadataUrlFormat(parsedUrl.toString());
    } catch (error) {
      return reject(error);
    }
    
    const client = parsedUrl.protocol === "https:" ? https : http;
    
    const req = client.get(parsedUrl, {
      lookup: customLookup as any,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RandomStuffBot/1.0)",
        "Accept": "text/html,application/xhtml+xml"
      },
      timeout: REQUEST_TIMEOUT_MS
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, parsedUrl);
        return resolve(fetchWithSafeLookup(nextUrl, redirectCount + 1));
      }
      
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Failed to fetch URL: ${res.statusCode}`));
      }
      
      const contentType = res.headers["content-type"] ?? "";
      if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
        res.resume();
        return reject(new Error("Only HTML pages can be previewed."));
      }
      
      let receivedBytes = 0;
      let data = "";
      res.on("data", (chunk: Buffer | string) => {
        const chunkSize = Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
        receivedBytes += chunkSize;
        if (receivedBytes > MAX_CONTENT_LENGTH_BYTES) {
          res.destroy();
          reject(new Error("The requested page is too large to preview."));
          return;
        }
        data += chunk;
      });
      
      res.on("end", () => resolve({ html: data, finalUrl: parsedUrl.toString() }));
    });
    
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });
  });
}

function toAbsoluteUrl(value: string | undefined, baseUrl: URL) {
  if (!value) return "";

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  if (!checkMetadataRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many metadata requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const { html, finalUrl } = await fetchWithSafeLookup(rawUrl);
    const parsedUrl = new URL(finalUrl);
    const $ = cheerio.load(html.slice(0, MAX_CONTENT_LENGTH_BYTES));

    const metadata: Record<string, string | boolean> = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        "",
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "",
      image: toAbsoluteUrl(
        $('meta[property="og:image"]').attr("content"),
        parsedUrl
      ),
      url: parsedUrl.toString(),
    };

    // GitHub specific logic
    if (parsedUrl.hostname.includes("github.com")) {
      metadata.isGitHub = true;

      const stars =
        $("#repo-stars-counter-star").text().trim() ||
        $(".js-social-count").first().text().trim();

      if (stars) {
        metadata.stars = stars;
      }

      const license =
        $('a[href$="/LICENSE"]').first().text().trim() ||
        $("svg.octicon-law").parent().text().trim();
      if (license) {
        metadata.license = license;
      }

      const website = $(".Layout-sidebar .BorderGrid-cell a[href^='http']")
        .first()
        .attr("href");
      if (website) {
        metadata.website = toAbsoluteUrl(website, parsedUrl);
      }

      // Detect if repo is archived
      const isArchived =
        $('div:contains("This repository has been archived")').length > 0 ||
        $('span:contains("Public archive")').length > 0 ||
        $('svg.octicon-archive').length > 0;
      if (isArchived) {
        metadata.isArchived = true;
      }
    }

    metadata.isOnline = true;

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Metadata request timed out."
        : "Failed to fetch metadata";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
