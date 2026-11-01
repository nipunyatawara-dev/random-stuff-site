import type { ComparisonDetails } from "@/data/comparison-details";
type TaggableItem = {
  category: string;
  tags: string[];
  github?: string;
  description?: string;
  details?: ComparisonDetails;
};
export function getVisiblePlatformTags(item: TaggableItem) {
  return item.tags.filter((tag) => tag !== "all");
}
export function isVerifiedOpenSource(item: TaggableItem) {
  const license = item.details?.license;
  return Boolean(
    license &&
    /^(MIT|Apache-2\.0|GPL-[\d.]+(-or-later)?|LGPL-[\d.]+(-or-later)?|AGPL-[\d.]+(-or-later)?|BSD-[23]-Clause|MPL-2\.0|ISC)$/.test(
      license,
    ),
  );
}
export function itemMatchesPlatformTag(item: TaggableItem, tag: string) {
  if (tag === "all") return true;
  if (["open-source", "oss"].includes(tag)) return isVerifiedOpenSource(item);
  if (tag === "free") return item.details?.pricing === "Free";
  if (["cli", "terminal"].includes(tag))
    return item.tags.some((t) => ["cli", "terminal"].includes(t));
  if (tag === "self-hosted") return item.tags.includes("self-hosted");
  if (tag === "web")
    return item.category === "Websites" || item.tags.includes("web");
  return item.tags.includes(tag);
}
