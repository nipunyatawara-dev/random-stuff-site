import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(new URL("../../public/sw.js", import.meta.url), "utf8");

function setup() {
  const handlers: Record<string, (event: unknown) => void> = {};
  const response = { ok: true, type: "basic", clone: () => ({}) };
  const cache = {
    match: vi.fn().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue(undefined),
    addAll: vi.fn().mockResolvedValue(undefined),
  };
  const fetch = vi.fn().mockResolvedValue(response);
  const caches = {
    open: vi.fn().mockResolvedValue(cache),
    keys: vi.fn().mockResolvedValue(["random-stuff-v2", "random-stuff-v3", "other-app"]),
    delete: vi.fn().mockResolvedValue(true),
  };
  runInNewContext(source, {
    self: {
      location: { origin: "https://randomstuff.test" },
      addEventListener: (name: string, handler: (event: unknown) => void) => { handlers[name] = handler; },
      clients: { claim: vi.fn() },
      skipWaiting: vi.fn(),
    },
    caches, fetch, URL, Response,
  });
  function dispatch(path: string, options: { mode?: string; headers?: Record<string, string> } = {}) {
    const event = {
      request: {
        url: new URL(path, "https://randomstuff.test").href,
        method: "GET",
        mode: options.mode ?? "cors",
        headers: new Headers(options.headers),
      },
      respondWith: vi.fn(),
      waitUntil: vi.fn(),
    };
    handlers.fetch(event);
    return event;
  }
  return { handlers, cache, caches, fetch, response, dispatch };
}

describe("offline caching", () => {
  it("serves a cached content-hashed chunk without fetching again", async () => {
    const { cache, fetch, response, dispatch } = setup();
    cache.match.mockResolvedValue(response);
    const event = dispatch("/_next/static/chunks/abc123.js");
    expect(await event.respondWith.mock.calls[0][0]).toBe(response);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("caches a chunk on its first request", async () => {
    const { cache, fetch, response, dispatch } = setup();
    const event = dispatch("/_next/static/chunks/abc123.js");
    expect(await event.respondWith.mock.calls[0][0]).toBe(response);
    expect(fetch).toHaveBeenCalledOnce();
    expect(cache.put).toHaveBeenCalledOnce();
  });

  it("fetches fresh navigation HTML even when an old page is cached", async () => {
    const { cache, response, dispatch } = setup();
    cache.match.mockResolvedValue({ old: true });
    const event = dispatch("/", { mode: "navigate" });
    expect(await event.respondWith.mock.calls[0][0]).toBe(response);
    expect(cache.match).not.toHaveBeenCalled();
  });

  it("falls back to the offline homepage for an uncached filtered URL", async () => {
    const { cache, fetch, response, dispatch } = setup();
    fetch.mockRejectedValue(new Error("offline"));
    cache.match.mockResolvedValueOnce(undefined).mockResolvedValueOnce(response);
    const event = dispatch("/?category=Scripts", { mode: "navigate" });
    expect(await event.respondWith.mock.calls[0][0]).toBe(response);
    expect(cache.match).toHaveBeenLastCalledWith("/");
  });

  it("preserves a successful response if cache storage is full", async () => {
    const { cache, response, dispatch } = setup();
    cache.put.mockRejectedValue(new Error("quota"));
    const event = dispatch("/", { mode: "navigate" });
    expect(await event.respondWith.mock.calls[0][0]).toBe(response);
  });

  it("still fetches a page when cache storage is unavailable", async () => {
    const { caches, response, dispatch } = setup();
    caches.open.mockRejectedValue(new Error("storage unavailable"));
    const event = dispatch("/", { mode: "navigate" });
    expect(await event.respondWith.mock.calls[0][0]).toBe(response);
  });

  it("leaves API, external, and React server-component requests alone", () => {
    const { dispatch, fetch } = setup();
    for (const event of [
      dispatch("/api/items"), dispatch("/api/metadata?url=test"),
      dispatch("https://www.google.com/s2/favicons"),
      dispatch("/?_rsc=abc"), dispatch("/", { headers: { RSC: "1" } }),
    ]) expect(event.respondWith).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps revalidation alive until the public asset has been cached", async () => {
    const { cache, response, dispatch } = setup();
    cache.match.mockResolvedValue(response);
    const event = dispatch("/manifest.webmanifest");
    expect(await event.respondWith.mock.calls[0][0]).toBe(response);
    await event.waitUntil.mock.calls[0][0];
    expect(cache.put).toHaveBeenCalledOnce();
  });

  it("cleans up only this site's previous caches", async () => {
    const { handlers, caches } = setup();
    const event = { waitUntil: vi.fn() };
    handlers.activate(event);
    await event.waitUntil.mock.calls[0][0];
    expect(caches.delete).toHaveBeenCalledExactlyOnceWith("random-stuff-v2");
  });
});
