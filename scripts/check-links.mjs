import { readFileSync, mkdirSync, writeFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readCatalog } from "./catalog-data.mjs";

export function classifyLinkStatus(status) {
  if (status >= 200 && status < 400) return "ok";
  if (status === 404 || status === 410) return "broken";
  return "review"; // Authentication, anti-bot responses, and outages are not proof of a dead tool.
}

export async function checkLink(url, fetcher = fetch) {
  try {
    let response = await fetcher(url, { method: "HEAD", signal: AbortSignal.timeout(8000), redirect: "follow" });
    if ([403, 405, 501].includes(response.status)) {
      await response.body?.cancel();
      response = await fetcher(url, { method: "GET", headers: { Range: "bytes=0-0" }, signal: AbortSignal.timeout(8000), redirect: "follow" });
    }
    await response.body?.cancel();
    return { url, status: response.status, result: classifyLinkStatus(response.status) };
  } catch (error) {
    return { url, result: "review", error: error.message };
  }
}

async function main() {
  const items = readCatalog(readFileSync(new URL("../src/data/items.ts", import.meta.url), "utf8"));
  const owners = new Map();
  for (const item of items) for (const url of [item.website, item.github]) {
    if (!url) continue;
    try {
      if (!["https:", "http:"].includes(new URL(url).protocol)) continue;
      owners.set(url, [...(owners.get(url) ?? []), item.title]);
    } catch {}
  }
  const entries = [...owners];
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (next < entries.length) {
      const [url, tools] = entries[next++];
      results.push({ ...await checkLink(url), tools });
      if (results.length % 50 === 0) console.log(`Checked ${results.length}/${entries.length} links`);
    }
  }));
  results.sort((a, b) => a.url.localeCompare(b.url));
  const summary = Object.fromEntries(["ok", "broken", "review"].map((kind) => [kind, results.filter((entry) => entry.result === kind).length]));
  mkdirSync("reports", { recursive: true });
  writeFileSync("reports/catalog-links.json", JSON.stringify({ checkedAt: new Date().toISOString(), summary, results }, null, 2) + "\n");
  console.log(summary);
  console.log("Review report: reports/catalog-links.json. No catalog records were modified.");
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Catalog link check\n\n${summary.ok} reachable, ${summary.broken} broken, ${summary.review} need review.\n\nSee the catalog-links artifact. Entries are preserved.\n`);
  if (summary.broken) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
