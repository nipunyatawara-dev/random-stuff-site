import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COLOR_MODE_INIT_SCRIPT, COLOR_MODE_STORAGE_KEY, resolveColorMode, setColorMode } from "./color-mode";

afterEach(() => vi.unstubAllGlobals());

describe("color mode preference", () => {
  it.each([
    [null, false, "light"], [null, true, "dark"],
    ["light", true, "light"], ["dark", false, "dark"],
    ["invalid", true, "dark"], ["invalid", false, "light"],
  ])("resolves %s with system dark=%s to %s before paint", (stored, prefersDark, expected) => {
    expect(resolveColorMode(stored, prefersDark)).toBe(expected);
    const root = { dataset: { colorMode: "" } };
    runInNewContext(COLOR_MODE_INIT_SCRIPT, {
      document: { documentElement: root },
      localStorage: { getItem: () => stored },
      matchMedia: () => ({ matches: prefersDark }),
    });
    expect(root.dataset.colorMode).toBe(expected);
  });

  it("uses the system preference if storage access is blocked before paint", () => {
    const root = { dataset: { colorMode: "" } };
    runInNewContext(COLOR_MODE_INIT_SCRIPT, {
      document: { documentElement: root },
      localStorage: { getItem: () => { throw new Error("blocked"); } },
      matchMedia: () => ({ matches: true }),
    });
    expect(root.dataset.colorMode).toBe("dark");
  });

  it("applies and persists an explicit selection", () => {
    const root = { dataset: { colorMode: "light" } };
    const setItem = vi.fn();
    const dispatchEvent = vi.fn();
    vi.stubGlobal("document", { documentElement: root });
    vi.stubGlobal("localStorage", { setItem });
    vi.stubGlobal("window", { dispatchEvent });
    setColorMode("dark");
    expect(root.dataset.colorMode).toBe("dark");
    expect(setItem).toHaveBeenCalledWith(COLOR_MODE_STORAGE_KEY, "dark");
    expect(dispatchEvent).toHaveBeenCalledTimes(2);
  });

  it("allows switching modes even when saving preferences fails", () => {
    const root = { dataset: { colorMode: "dark" } };
    vi.stubGlobal("document", { documentElement: root });
    vi.stubGlobal("localStorage", { setItem: () => { throw new Error("blocked"); } });
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });
    expect(() => setColorMode("light")).not.toThrow();
    expect(root.dataset.colorMode).toBe("light");
  });
});
