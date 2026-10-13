import type { Item } from "@/data/items";
import type { CuratedStack } from "@/data/stacks";
import { CATALOG_TIME_ZONE } from "./catalog-dates";

export type CatalogIssue = { severity: "error" | "warning"; item: string; message: string };

export function normalizedCatalogUrl(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Expected a public HTTP(S) URL");
  url.hash = "";
  url.hostname = url.hostname.replace(/^www\./, "");
  return url.toString().replace(/\/$/, "");
}

export function auditCatalog(items: readonly Item[], stacks: readonly CuratedStack[], now = Date.now()): CatalogIssue[] {
  const issues: CatalogIssue[] = [];
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: CATALOG_TIME_ZONE }).format(now);
  const ids = new Set<string>();
  const records = new Set<string>();
  const urls = new Map<string, string>();
  const add = (severity: CatalogIssue["severity"], item: string, message: string) => issues.push({ severity, item, message });
  for (const item of items) {
    if (!item.id || ids.has(item.id)) add("error", item.title, "Missing or duplicate item ID");
    ids.add(item.id);
    const key = `${item.category}:${item.title.trim().toLowerCase()}`;
    if (records.has(key)) add("error", item.title, "Duplicate title in the same category");
    records.add(key);
    if (!item.title.trim() || !item.description.trim()) add("error", item.title, "Title and description are required");
    if (!["Websites", "Softwares", "Scripts"].includes(item.category)) add("error", item.title, "Unknown category");
    if (!Array.isArray(item.tags) || item.tags.length === 0 || item.tags.some((tag) => !tag.trim())) add("error", item.title, "At least one non-empty platform tag is required");
    if (!item.addedAt || !Number.isFinite(Date.parse(item.addedAt)) || Date.parse(item.addedAt) > now) add("error", item.title, "A valid, non-future addedAt date is required");
    if (!item.website && !item.github) add("error", item.title, "Website or source URL is required");
    for (const link of [item.website, item.github]) {
      if (!link) continue;
      try {
        const normalized = normalizedCatalogUrl(link);
        const owner = urls.get(normalized);
        if (owner && owner !== item.id) add("warning", item.title, `URL also used by ${owner}: ${link}`);
        urls.set(normalized, item.id);
      } catch {
        add("error", item.title, `Invalid or placeholder URL: ${link}`);
      }
    }
    if (item.details) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.details.verifiedAt) || !Number.isFinite(Date.parse(item.details.verifiedAt)) || item.details.verifiedAt > today) add("error", item.title, "Comparison facts need a valid verification date");
      if (!item.details.sources.length) add("error", item.title, "Comparison facts must cite sources");
      for (const source of item.details.sources) {
        try { normalizedCatalogUrl(source); } catch { add("error", item.title, `Invalid comparison source: ${source}`); }
      }
    }
  }
  const stackIds = new Set<string>();
  for (const stack of stacks) {
    if (stackIds.has(stack.id)) add("error", stack.title, "Duplicate stack ID");
    stackIds.add(stack.id);
    if (!stack.itemIds.length || new Set(stack.itemIds).size !== stack.itemIds.length) add("error", stack.title, "Stack must contain distinct item IDs");
    for (const id of stack.itemIds) if (!ids.has(id)) add("error", stack.title, `Missing stack item: ${id}`);
  }
  return issues;
}
