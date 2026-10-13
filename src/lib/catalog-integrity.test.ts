import { describe, expect, it } from "vitest";
import { items } from "@/data/items";
import { CURATED_STACKS } from "@/data/stacks";
import { auditCatalog } from "./catalog-integrity";

describe("catalog integrity", () => {
  it("keeps every current record and stack valid", () => {
    const issues = auditCatalog(items, CURATED_STACKS);
    for (const warning of issues.filter((issue) => issue.severity === "warning")) console.warn(`${warning.item}: ${warning.message}`);
    expect(issues.filter((issue) => issue.severity === "error")).toEqual([]);
  });
  it("flags duplicate records and IDs", () => {
    const issues = auditCatalog([items[0], { ...items[0] }], []);
    expect(issues.some((issue) => issue.message.includes("duplicate item ID"))).toBe(true);
    expect(issues.some((issue) => issue.message.includes("Duplicate title"))).toBe(true);
  });
  it("flags placeholders, missing fields, and invalid dates", () => {
    const item = { ...items[0], description: "", website: "#", github: undefined, addedAt: "not-a-date", tags: [] };
    const issues = auditCatalog([item], []);
    expect(issues.map((issue) => issue.message)).toEqual(expect.arrayContaining([
      "Title and description are required", "At least one non-empty platform tag is required",
      "A valid, non-future addedAt date is required", "Invalid or placeholder URL: #",
    ]));
  });
  it("flags broken stack references and unsourced comparison facts", () => {
    const item = { ...items[0], details: { verifiedAt: "2026-10-14", sources: [] } };
    const stack = { ...CURATED_STACKS[0], itemIds: ["missing"] };
    const issues = auditCatalog([item], [stack]);
    expect(issues.some((issue) => issue.message === "Comparison facts must cite sources")).toBe(true);
    expect(issues.some((issue) => issue.message === "Missing stack item: missing")).toBe(true);
  });
});
