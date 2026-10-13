import { afterEach, describe, expect, it, vi } from "vitest";
import type Lenis from "lenis";
import { clearLenisInstance, lockPageScroll, setLenisInstance, startLenis } from "./lenis";

afterEach(() => { clearLenisInstance(); vi.unstubAllGlobals(); });

describe("shared modal scroll locking", () => {
  it("keeps scroll locked until every dialog releases it and restores the prior style", () => {
    const body = { style: { overflow: "clip" } };
    const lenis = { stop: vi.fn(), start: vi.fn() };
    vi.stubGlobal("document", { body });
    setLenisInstance(lenis as unknown as Lenis);
    const first = lockPageScroll();
    const second = lockPageScroll();
    expect(body.style.overflow).toBe("hidden");
    first();
    first(); // Cleanup is idempotent.
    startLenis();
    expect(body.style.overflow).toBe("hidden");
    expect(lenis.start).not.toHaveBeenCalled();
    second();
    expect(body.style.overflow).toBe("clip");
    expect(lenis.start).toHaveBeenCalledOnce();
  });
  it("stops a Lenis instance that initializes while an overlay is already open", () => {
    vi.stubGlobal("document", { body: { style: { overflow: "" } } });
    const release = lockPageScroll();
    const lenis = { stop: vi.fn(), start: vi.fn() };
    setLenisInstance(lenis as unknown as Lenis);
    expect(lenis.stop).toHaveBeenCalledOnce();
    release();
    expect(lenis.start).toHaveBeenCalledOnce();
  });
});
