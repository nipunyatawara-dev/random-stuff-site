import { createRequire } from "node:module";
import { describe, it, expect } from "vitest";
const require = createRequire(import.meta.url);
const match = require("../../vendor/minimatch-compat/index.cjs");
describe("patched lint glob engine compatibility", () => {
  it("supports legacy callable and modern named exports", () => {
    expect(match("src/app/page.tsx", "**/*.tsx")).toBe(true);
    expect(match.minimatch("src/app/page.tsx", "**/*.tsx")).toBe(true);
    expect(match("src/app/page.tsx", "**/*.js")).toBe(false);
  });
  it("preserves the constructor and defaults contracts used by lint tooling", () => {
    expect(new match.Minimatch("src/**").match("src/app/page.tsx")).toBe(true);
    expect(
      match.defaults({ dot: true })(
        ".github/workflows/quality.yml",
        "**/*.yml",
      ),
    ).toBe(true);
    expect(match.filter("**/*.ts")("src/lib/site.ts")).toBe(true);
  });
});
