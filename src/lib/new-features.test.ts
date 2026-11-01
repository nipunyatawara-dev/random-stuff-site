import { describe, expect, it } from "vitest";
import { items } from "@/data/items";
import { CURATED_STACKS } from "@/data/stacks";
import {
  exportFavoritesMarkdown,
  exportFavoritesJson,
  exportFavoritesHtml,
  parseFavoritesImport,
} from "@/lib/export-favorites";
import { itemMatchesPlatformTag } from "@/lib/platform-tags";
import { THEMES } from "@/lib/theme-manager";

describe("New Power-User Features", () => {
  describe("Curated Stacks Integrity", () => {
    it("contains at least 4 curated stacks", () => {
      expect(CURATED_STACKS.length).toBeGreaterThanOrEqual(4);
    });

    it("verifies that all stack item IDs exist in the catalog", () => {
      const allCatalogIds = new Set(items.map((i) => i.id));
      for (const stack of CURATED_STACKS) {
        expect(stack.itemIds.length).toBeGreaterThan(0);
        for (const id of stack.itemIds) {
          expect(
            allCatalogIds.has(id),
            `Missing tool ID "${id}" in stack "${stack.title}"`,
          ).toBe(true);
        }
      }
    });
  });

  describe("Favorites Export & Import", () => {
    const sampleItems = items.slice(0, 3);

    it("exports valid Markdown with tool titles and links", () => {
      const md = exportFavoritesMarkdown(sampleItems);
      expect(md).toContain("# My Curated Tools & Bookmarks");
      expect(md).toContain(`Total Items: ${sampleItems.length}`);
      for (const item of sampleItems) {
        expect(md).toContain(item.title);
      }
    });

    it("exports valid JSON and parses it back", () => {
      const jsonStr = exportFavoritesJson(sampleItems);
      const parsed = JSON.parse(jsonStr);
      expect(parsed.count).toBe(sampleItems.length);
      expect(parsed.itemIds).toEqual(sampleItems.map((i) => i.id));

      const imported = parseFavoritesImport(jsonStr);
      expect(imported.ids).toEqual(sampleItems.map((i) => i.id));
      expect(imported.count).toBe(sampleItems.length);
    });

    it("exports valid self-contained HTML document", () => {
      const html = exportFavoritesHtml(sampleItems);
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<title>Curated Tools Export</title>");
      for (const item of sampleItems) {
        expect(html).toContain(item.title);
      }
    });

    it("correctly parses raw array of IDs", () => {
      const rawIds = ["softwares-raycast", "softwares-alttab"];
      const res = parseFavoritesImport(JSON.stringify(rawIds));
      expect(res.ids).toEqual(rawIds);
    });

    it("throws a descriptive error on invalid import string", () => {
      expect(() => parseFavoritesImport("invalid-json")).toThrow();
    });
  });

  describe("Utility Filter Tags", () => {
    it("matches only verified open-source licenses", () => {
      const ossItem = items.find((i) => i.id === "softwares-tabby")!;
      expect(
        itemMatchesPlatformTag(
          {
            category: "Softwares",
            tags: [],
            github: "https://github.com/example",
          },
          "open-source",
        ),
      ).toBe(false);
      expect(
        itemMatchesPlatformTag(
          items.find((i) => i.id === "websites-react-bits")!,
          "open-source",
        ),
      ).toBe(false);
      expect(itemMatchesPlatformTag(ossItem, "open-source")).toBe(true);
      expect(itemMatchesPlatformTag(ossItem, "oss")).toBe(true);
    });

    it("matches cli items by tag or category", () => {
      const cliItem =
        items.find(
          (i) => i.tags.includes("terminal") || i.tags.includes("cli"),
        ) || items[0];
      expect(itemMatchesPlatformTag(cliItem, "cli")).toBe(true);
    });

    it("matches all items when tag is 'all'", () => {
      for (const item of items.slice(0, 10)) {
        expect(itemMatchesPlatformTag(item, "all")).toBe(true);
      }
    });
  });

  describe("Phosphor Theme Colorways", () => {
    it("defines lime, amber, emerald, and cobalt themes with hex colors", () => {
      expect(THEMES.lime.accent).toBe("#a3e635");
      expect(THEMES.amber.accent).toBe("#f59e0b");
      expect(THEMES.emerald.accent).toBe("#10b981");
      expect(THEMES.cobalt.accent).toBe("#38bdf8");
    });
  });
});
