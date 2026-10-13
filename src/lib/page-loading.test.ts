import { afterEach, describe, expect, it, vi } from "vitest";
import { trackPageLoading, type PageLoadingProgress } from "./page-loading";

function deferred() {
  let resolve!: () => void;
  let reject!: () => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function image(options: { complete?: boolean; top?: number; width?: number; naturalWidth?: number; decode?: () => Promise<void> } = {}) {
  return Object.assign(new EventTarget(), {
    complete: options.complete ?? false,
    naturalWidth: options.naturalWidth ?? 32,
    currentSrc: "https://example.com/icon.png",
    getAttribute: () => "https://example.com/icon.png",
    getBoundingClientRect: () => ({
      top: options.top ?? 50, bottom: (options.top ?? 50) + 32,
      left: 10, right: 42, width: options.width ?? 32, height: 32,
    }),
    decode: options.decode,
  }) as unknown as HTMLImageElement;
}

function environment(images: HTMLImageElement[] = [], complete = false) {
  const fonts = deferred();
  const doc = {
    readyState: complete ? "complete" : "interactive",
    fonts: { ready: fonts.promise },
    querySelectorAll: () => images,
  } as unknown as Document;
  const win = Object.assign(new EventTarget(), { innerHeight: 800, innerWidth: 1200 }) as unknown as Window;
  const updates: PageLoadingProgress[] = [];
  const tracker = trackPageLoading(doc, win, (value) => updates.push(value));
  return { fonts, doc, win, updates, tracker, last: () => updates.at(-1) };
}

afterEach(() => vi.useRealTimers());

describe("actual startup progress", () => {
  it("does not guess a denominator before the catalog is ready", async () => {
    const env = environment([], true);
    env.fonts.resolve();
    await Promise.resolve();
    expect(env.updates).toEqual([]);
    env.tracker.markCatalogReady();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ completed: 3, total: 3, percent: 100, done: true });
    env.tracker.dispose();
  });

  it("advances only on actual completion and never on elapsed time", async () => {
    vi.useFakeTimers();
    const img = image();
    const env = environment([img]);
    env.tracker.markCatalogReady();
    expect(env.last()).toMatchObject({ completed: 1, total: 4, percent: 25, done: false });
    vi.advanceTimersByTime(60_000);
    expect(env.last()?.percent).toBe(25);
    env.win.dispatchEvent(new Event("load"));
    expect(env.last()?.percent).toBe(50);
    img.dispatchEvent(new Event("load"));
    expect(env.last()?.percent).toBe(75);
    env.fonts.resolve();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ percent: 100, done: true, failed: 0 });
    env.tracker.dispose();
  });

  it("waits for cached visible images to decode", async () => {
    const decoding = deferred();
    const env = environment([image({ complete: true, decode: () => decoding.promise })], true);
    env.tracker.markCatalogReady();
    env.fonts.resolve();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ percent: 75, done: false });
    decoding.resolve();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ percent: 100, done: true });
    env.tracker.dispose();
  });

  it("handles already loaded resources without a minimum-duration delay", async () => {
    const env = environment([image({ complete: true })], true);
    env.fonts.resolve();
    env.tracker.markCatalogReady();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ completed: 4, total: 4, percent: 100, done: true });
    env.tracker.dispose();
  });

  it("excludes offscreen and hidden lazy images from startup", async () => {
    const below = image({ top: 900 });
    const hidden = image({ width: 0 });
    const env = environment([below, hidden], true);
    const listener = vi.spyOn(below, "addEventListener");
    env.tracker.markCatalogReady();
    env.fonts.resolve();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ total: 3, done: true });
    expect(listener).not.toHaveBeenCalled();
    env.tracker.dispose();
  });

  it("settles failures explicitly so a broken resource does not trap visitors", async () => {
    const broken = image();
    const env = environment([broken, image({ complete: true, naturalWidth: 0 })], true);
    env.tracker.markCatalogReady();
    broken.dispatchEvent(new Event("error"));
    env.fonts.reject();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ completed: 5, total: 5, failed: 3, done: true });
    env.tracker.dispose();
  });

  it("reports decoding failures and ignores duplicate events/readiness callbacks", async () => {
    const decoding = deferred();
    const img = image({ decode: () => decoding.promise });
    const env = environment([img], true);
    env.tracker.markCatalogReady();
    env.tracker.markCatalogReady();
    img.dispatchEvent(new Event("load"));
    img.dispatchEvent(new Event("load"));
    env.fonts.resolve();
    decoding.reject();
    await Promise.resolve();
    expect(env.last()).toMatchObject({ total: 4, failed: 1, done: true });
    const count = env.updates.length;
    img.dispatchEvent(new Event("error"));
    expect(env.updates).toHaveLength(count);
    env.tracker.dispose();
  });

  it("removes listeners and ignores pending promises after disposal", async () => {
    const img = image();
    const env = environment([img]);
    env.tracker.markCatalogReady();
    const count = env.updates.length;
    env.tracker.dispose();
    env.win.dispatchEvent(new Event("load"));
    img.dispatchEvent(new Event("load"));
    env.fonts.resolve();
    await Promise.resolve();
    env.tracker.markCatalogReady();
    expect(env.updates).toHaveLength(count);
  });
});
