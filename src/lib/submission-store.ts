import { createHash } from "node:crypto";

// Redis is optional. Without it, keep bounded counters in this server instance.
// Local counters reset on restart and are not shared across serverless instances.
const local = new Map<string, { count: number; expires: number }>();
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const WINDOW_MS = 15 * 60_000;
const LIMIT = 5;
export class StoreUnavailable extends Error {}
export function storeConfigured() {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
  );
}
async function command(args: (string | number)[], signal?: AbortSignal) {
  const endpoint =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!endpoint || !token || !endpoint.startsWith("https://"))
    throw new StoreUnavailable("Submission storage unavailable");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.any([
        AbortSignal.timeout(4000),
        ...(signal ? [signal] : []),
      ]),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error("Store rejected command");
    return data.result;
  } catch {
    throw new StoreUnavailable("Submission storage unavailable");
  }
}
function memoryEntry(key: string) {
  const now = Date.now();
  for (const [k, entry] of local) if (entry.expires <= now) local.delete(k);
  return local.get(key);
}
export async function limitSubmission(identity: string, signal?: AbortSignal) {
  const key = `rs:limit:${digest(identity)}`;
  if (storeConfigured()) {
    const result = (await command(
      [
        "EVAL",
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return {n,redis.call('PTTL',KEYS[1])}",
        1,
        key,
        WINDOW_MS,
      ],
      signal,
    )) as number[];
    return {
      allowed: result[0] <= LIMIT,
      retryAfter: Math.max(1, Math.ceil(result[1] / 1000)),
    };
  }
  const entry = memoryEntry(key) || {
    count: 0,
    expires: Date.now() + WINDOW_MS,
  };
  if (local.size >= 5000 && !local.has(key))
    throw new StoreUnavailable("Submission capacity reached");
  entry.count++;
  local.set(key, entry);
  return {
    allowed: entry.count <= LIMIT,
    retryAfter: Math.ceil((entry.expires - Date.now()) / 1000),
  };
}
export async function reserveSubmission(
  name: string,
  url: string,
  signal?: AbortSignal,
) {
  const keys = [`rs:name:${digest(name)}`, `rs:url:${digest(url)}`];
  if (storeConfigured())
    return (
      Number(
        await command(
          [
            "EVAL",
            "if redis.call('EXISTS',KEYS[1])==1 or redis.call('EXISTS',KEYS[2])==1 then return 0 end; redis.call('SET',KEYS[1],1,'EX',86400); redis.call('SET',KEYS[2],1,'EX',86400); return 1",
            2,
            ...keys,
          ],
          signal,
        ),
      ) === 1
    );
  if (keys.some((key) => memoryEntry(key))) return false;
  if (local.size > 4998)
    throw new StoreUnavailable("Submission capacity reached");
  keys.forEach((key) =>
    local.set(key, { count: 1, expires: Date.now() + 86_400_000 }),
  );
  return true;
}
export async function releaseSubmission(
  name: string,
  url: string,
  signal?: AbortSignal,
) {
  const keys = [`rs:name:${digest(name)}`, `rs:url:${digest(url)}`];
  if (storeConfigured()) await command(["DEL", ...keys], signal);
  else keys.forEach((key) => local.delete(key));
}
