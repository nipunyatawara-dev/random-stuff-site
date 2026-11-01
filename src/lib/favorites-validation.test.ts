import { describe, it, expect } from "vitest";
import { parseFavoritesImport, exportFavoritesHtml } from "./export-favorites";
import { items } from "@/data/items";
describe("favorites validation", () => {
  it("reports unknown and duplicate IDs rather than inflating counts", () => {
    expect(
      parseFavoritesImport(
        JSON.stringify([items[0].id, items[0].id, "unknown"]),
      ),
    ).toEqual({
      ids: [items[0].id],
      count: 1,
      unknownCount: 1,
      duplicateCount: 1,
    });
  });
  it("rejects oversized and malformed structures", () => {
    for (const value of [null, { items: [null] }, { itemIds: [42] }])
      expect(() => parseFavoritesImport(JSON.stringify(value))).toThrow();
    expect(() => parseFavoritesImport(" ".repeat(1000001))).toThrow();
  });
  it("escapes HTML export attributes and tags and rejects script URLs", () => {
    const html = exportFavoritesHtml([
      {
        ...items[0],
        website: "javascript:alert(1)",
        tags: ["<script>alert(1)</script>"],
      },
    ]);
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
