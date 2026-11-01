// Generated into public/sw.js by prepare-assets.mjs. Public content only.
const CACHE_NAME = "random-stuff-__BUILD_VERSION__";
const BUILD_ASSETS = [];
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/icon.png",
  ...BUILD_ASSETS,
];
const MAX_ENTRIES = 160;
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((n) => n.startsWith("random-stuff-") && n !== CACHE_NAME)
            .map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
const openCache = () => caches.open(CACHE_NAME).catch(() => null);
async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  if (cache && response.ok && response.type === "basic")
    try {
      await cache.put(request, response.clone());
      const keys = await cache.keys();
      let excess = keys.length - MAX_ENTRIES;
      for (const key of keys)
        if (excess > 0 && !PRECACHE_URLS.includes(new URL(key.url).pathname)) {
          await cache.delete(key);
          excess--;
        }
    } catch {}
  return response;
}
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    request.headers.has("RSC") ||
    url.searchParams.has("_rsc")
  )
    return;
  if (request.mode === "navigate") {
    // Canonicalize root query variants to one offline shell; never serve it as another page.
    const key = url.pathname === "/" ? "/" : url.pathname;
    event.respondWith(
      (async () => {
        const cache = await openCache();
        try {
          return await fetchAndCache(
            request,
            key === "/" && url.search ? null : cache,
          );
        } catch {
          return (
            (await cache?.match(key)) ||
            (await cache?.match("/offline")) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/tool-icons/")
  ) {
    event.respondWith(
      (async () => {
        const cache = await openCache();
        return (await cache?.match(request)) || fetchAndCache(request, cache);
      })(),
    );
    return;
  }
  if (
    !PRECACHE_URLS.includes(url.pathname) &&
    !url.pathname.startsWith("/app-icons/")
  )
    return;
  const cachePromise = openCache();
  const refresh = cachePromise.then((cache) => fetchAndCache(request, cache));
  event.waitUntil(refresh.catch(() => {}));
  event.respondWith(
    (async () => (await (await cachePromise)?.match(request)) || refresh)(),
  );
});
