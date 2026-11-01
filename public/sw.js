// Generated into public/sw.js by prepare-assets.mjs. Public content only.
const CACHE_NAME = "random-stuff-92b33efa3dbf";
const BUILD_ASSETS = ["/_next/static/media/b8dfa3d21eb22018-s.p.3lxpqujs87tck.woff2","/_next/static/chunks/0ht-wk9tki6kq.css","/_next/static/chunks/2_xf99yxhp4od.js","/_next/static/chunks/1-nqmp1rl8kqt.js","/_next/static/chunks/3laf0p3zs8nt2.js","/_next/static/chunks/34goyxc2anvlg.js","/_next/static/chunks/turbopack-2c3mg3r-05n1w.js","/_next/static/chunks/1dzmgrq7i7lsa.js","/_next/static/chunks/0umf92h1sb77c.js","/_next/static/chunks/17og980l_-z23.js","/_next/static/chunks/32z4zibr_di5k.js","/_next/static/chunks/1lo6ffmy0xmwm.js","/_next/static/chunks/0veojc9bary-o.js","/_next/static/chunks/161m_p0r2veo-.js","/_next/static/chunks/0cz1d0mv5g_q7.js","/_next/static/chunks/09de1f6ztqadt.js","/_next/static/chunks/0f8c4ahsgw48b.js","/_next/static/chunks/0ka_jrri16r4k.js","/_next/static/chunks/0y42tz_4vzcxp.js","/_next/static/chunks/14z52ox0w-9n3.js","/_next/static/chunks/1d_wc7yn71w1-.js","/_next/static/chunks/1pr05rfxr8815.js","/_next/static/chunks/2bl25v2rw0_ib.js","/_next/static/chunks/2n5qeheznvl4u.js","/_next/static/chunks/33dde202l5zem.js"];
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
