import { describe, expect, it } from "vitest";
import { items } from "@/data/items";
import { searchItems } from "@/lib/item-search";
import { isSearchTopic } from "@/lib/search-topics";

function titlesFor(query: string, platformTag = "all") {
  return searchItems(items, query, { browseCategory: "Websites", platformTag }).map((item) => item.title);
}

describe("topic-aware item search", () => {
  it("assigns at least one known topic to every item", () => {
    expect(items).toHaveLength(228);
    for (const item of items) {
      expect(item.topics.length, item.title).toBeGreaterThan(0);
      expect(item.topics.every(isSearchTopic), item.title).toBe(true);
    }
  });

  it("discovers image tools across categories and related use cases", () => {
    const titles = titlesFor("image");
    expect(titles).toEqual(expect.arrayContaining(["GIMP", "Krita", "digiKam", "CompressO", "Clop", "Dither"]));
    expect(titlesFor("image editing")).toEqual(expect.arrayContaining(["GIMP", "Krita", "Pinta"]));
  });

  it("maps coding and programming language to development tools", () => {
    expect(titlesFor("coding")).toEqual(expect.arrayContaining(["Zed", "Lapce", "Cline", "React Bits"]));
    expect(titlesFor("programming")).toEqual(expect.arrayContaining(["Zed", "Lapce", "Cline"]));
  });

  it("recognizes AI and LLM without short-substring false positives", () => {
    const aiTitles = titlesFor("AI");
    expect(aiTitles).toEqual(expect.arrayContaining(["LM Studio", "AnythingLLM", "Cline", "Atomic Chat"]));
    expect(aiTitles).not.toEqual(expect.arrayContaining(["Mailspring", "Pinta", "RawTherapee"]));
    expect(titlesFor("LLM")).toEqual(expect.arrayContaining(["LM Studio", "LLMFit", "Jan"]));
  });

  it("recognizes aliases and a conservative typo", () => {
    expect(titlesFor("photo")).toEqual(expect.arrayContaining(["digiKam", "darktable", "Lap Photo Manager"]));
    expect(titlesFor("programing")).toEqual(expect.arrayContaining(["Zed", "Lapce"]));
  });

  it("requires every meaningful concept in a multi-topic query", () => {
    const results = searchItems(items, "image compression", { browseCategory: "Websites" });
    expect(results.map((item) => item.title)).toEqual(expect.arrayContaining(["CompressO", "Clop"]));
    expect(results.every((item) => item.topics.includes("image") && item.topics.includes("compression"))).toBe(true);
  });

  it("searches globally but browses only the selected category when the query is empty", () => {
    const globalResults = searchItems(items, "image", { browseCategory: "Websites" });
    expect(globalResults.some((item) => item.title === "GIMP" && item.category === "Softwares")).toBe(true);

    const browsed = searchItems(items, "", { browseCategory: "Websites" });
    expect(browsed.every((item) => item.category === "Websites")).toBe(true);
    expect(browsed.map((item) => item.title)).toEqual(
      [...browsed].map((item) => item.title).sort((a, b) => a.localeCompare(b)),
    );
  });

  it("keeps the platform filter as a secondary search constraint", () => {
    const windowsImageTitles = titlesFor("image", "windows");
    expect(windowsImageTitles).toContain("GIMP");
    expect(windowsImageTitles).not.toContain("Clop");
  });

  it("ranks an exact title match first and uses title as a deterministic tie-breaker", () => {
    expect(titlesFor("GIMP")[0]).toBe("GIMP");
    expect(titlesFor("image")).toEqual(titlesFor("image"));
  });
});
