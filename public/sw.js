// Random Stuff - Lightweight Service Worker
const CACHE_NAME = "random-stuff-v3";
const PRECACHE_URLS = ["/", "/manifest.webmanifest", "/window.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name.startsWith("random-stuff-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  if (cache && response.ok && response.type === "basic") {
    // Cache failures (quota/private browsing) must not discard a good response.
    await cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

function openCache() {
  return caches.open(CACHE_NAME).catch(() => null);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Let the browser/Next.js handle external assets, APIs, and Flight responses.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/") ||
      request.headers.has("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    // Fresh HTML references the current deployment's chunks; retain offline use.
    event.respondWith((async () => {
      const cache = await openCache();
      try {
        return await fetchAndCache(request, cache);
      } catch {
        const cached = await cache?.match(request) || await cache?.match("/");
        return cached || Response.error();
      }
    })());
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    // Content-hashed assets never change: a cache hit needs no network request.
    event.respondWith((async () => {
      const cache = await openCache();
      return await cache?.match(request) || fetchAndCache(request, cache);
    })());
    return;
  }

  // Only revalidate known local public assets, keeping background work alive.
  if (!PRECACHE_URLS.includes(url.pathname) && url.pathname !== "/icon.png") return;
  const cachePromise = openCache();
  const refresh = cachePromise.then((cache) => fetchAndCache(request, cache));
  event.waitUntil(refresh.catch(() => {}));
  event.respondWith((async () => {
    const cached = await (await cachePromise)?.match(request);
    return cached || refresh;
  })());
});
