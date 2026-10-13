import type { Item } from "@/data/items";

export const NEW_ITEM_WINDOW_DAYS = 30;
export const CATALOG_TIME_ZONE = "Asia/Colombo";

export function isRecentlyAdded(addedAt: string | undefined, now = Date.now()) {
  if (!addedAt) return false;
  const age = now - Date.parse(addedAt);
  return age >= 0 && age < NEW_ITEM_WINDOW_DAYS * 86_400_000;
}

export function newestItems(items: readonly Item[]) {
  return [...items].sort((a, b) => Date.parse(b.addedAt ?? "") - Date.parse(a.addedAt ?? "") || a.title.localeCompare(b.title));
}

export function formatCatalogDate(date: string) {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric", timeZone: CATALOG_TIME_ZONE }).format(new Date(date));
}
