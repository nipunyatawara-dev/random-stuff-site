import { describe, expect, it } from "vitest";
import { items } from "@/data/items";
import { CURATED_STACKS } from "@/data/stacks";
import { readCatalogUrl, stackShareUrl } from "./catalog-url";
import { isRecentlyAdded, newestItems } from "./catalog-dates";
import { classifyLinkStatus, checkLink } from "../../scripts/check-links.mjs";

describe("catalog links and dates", () => {
  it("restores a copied stack link including its category", () => {
    for (const stack of CURATED_STACKS) {
      const state = readCatalogUrl(new URL(stackShareUrl("https://example.com", stack)), items);
      expect(state.stack).toEqual(stack);
      expect(state.category).toBe("stacks");
    }
  });
  it("continues to restore old stack hashes", () => {
    const stack = CURATED_STACKS[0];
    const state = readCatalogUrl(new URL(`https://example.com/#stack=${stack.itemIds.join(",")}`), items);
    expect(state.stack).toEqual(stack);
  });
  it("restores tool, search, and platform links without accepting unknown categories", () => {
    const state = readCatalogUrl(new URL(`https://example.com/?q=image&tag=macos&category=invalid&tool=${items[0].id}`), items);
    expect(state).toMatchObject({ category: "all", query: "image", tag: "macos", tool: items[0] });
    expect(readCatalogUrl(new URL(`https://example.com/#${items[0].id}`), items).tool).toBe(items[0]);
    expect(readCatalogUrl(new URL("https://example.com/?stack=missing"), items).stack).toBeNull();
  });
  it("uses real dates for new badges including expiry and future-date handling", () => {
    const now = Date.parse("2026-10-14T00:00:00Z");
    expect(isRecentlyAdded("2026-10-04", now)).toBe(true);
    expect(isRecentlyAdded("2026-09-14", now)).toBe(false);
    expect(isRecentlyAdded("2026-10-15", now)).toBe(false);
    expect(isRecentlyAdded(undefined, now)).toBe(false);
  });
  it("sorts the feed by date without changing the catalog's browse order", () => {
    const source = [
      { ...items[0], addedAt: "2026-02-05" },
      { ...items[1], addedAt: "2026-10-04" },
    ];
    expect(newestItems(source)[0]).toBe(source[1]);
    expect(source[0].addedAt).toBe("2026-02-05");
  });
});

describe("link checks", () => {
  it("distinguishes dead links from blocking and temporary outages", () => {
    expect(classifyLinkStatus(200)).toBe("ok");
    expect(classifyLinkStatus(404)).toBe("broken");
    expect(classifyLinkStatus(410)).toBe("broken");
    for (const status of [403, 429, 500, 503]) expect(classifyLinkStatus(status)).toBe("review");
  });
  it("falls back to a bounded GET when a server rejects HEAD", async () => {
    const methods: string[] = [];
    const result = await checkLink("https://example.com", async (_url, options) => {
      methods.push(options?.method ?? "GET");
      return { status: methods.length === 1 ? 405 : 200 } as Response;
    });
    expect(methods).toEqual(["HEAD", "GET"]);
    expect(result.result).toBe("ok");
  });
  it("marks connection failures for review instead of claiming the tool is dead", async () => {
    const result = await checkLink("https://example.com", async () => { throw new Error("timeout"); });
    expect(result.result).toBe("review");
  });
});
