// Generated into public/sw.js by prepare-assets.mjs. Public content only.
const CACHE_NAME = "random-stuff-895e15cc17ff";
const BUILD_ASSETS = ["/_next/static/chunks/00gs2u1iryp6k.js","/_next/static/chunks/09lf_jey6arwl.js","/_next/static/chunks/0cz1d0mv5g_q7.js","/_next/static/chunks/0mvau44nlq4lr.js","/_next/static/chunks/1-nqmp1rl8kqt.js","/_next/static/chunks/103-nazunrri9.js","/_next/static/chunks/14z52ox0w-9n3.js","/_next/static/chunks/161m_p0r2veo-.js","/_next/static/chunks/16ilqrhd-gk-n.js","/_next/static/chunks/17og980l_-z23.js","/_next/static/chunks/1c3wmg4euj8m8.js","/_next/static/chunks/1dzmgrq7i7lsa.js","/_next/static/chunks/1nn50zfc2msp1.js","/_next/static/chunks/2_xf99yxhp4od.js","/_next/static/chunks/27e9fb_s2tm_v.js","/_next/static/chunks/2f9trsca_2ejl.js","/_next/static/chunks/2mjvt7nzf9z4y.js","/_next/static/chunks/2n5qeheznvl4u.js","/_next/static/chunks/2onj9g4k4r5l9.js","/_next/static/chunks/2tnruw98dqtcb.css","/_next/static/chunks/31xxp3dx1g5tp.js","/_next/static/chunks/34goyxc2anvlg.js","/_next/static/chunks/3laf0p3zs8nt2.js","/_next/static/chunks/42onvq6nokjl2.js","/_next/static/chunks/turbopack-2c3mg3r-05n1w.js","/_next/static/media/07c7676b89ed2778-s.p.2bn3s6zvc0dyp.woff2","/_next/static/media/0bd866694792eeb1-s.2rv_b6cm3-gtx.woff2","/_next/static/media/0da49ec1e3219fd9-s.3zotsfp0tx4qj.woff2","/_next/static/media/22bc6ebae07d77f5-s.27riv1g955cgo.woff2","/_next/static/media/258bd0ab5fdd762a-s.2f7nqdagzwx2-.woff2","/_next/static/media/2d02cc93ce2ddd98-s.1zs3uer5h3r8e.woff2","/_next/static/media/2fb76073e23fd9e4-s.3lvt2whj97whp.woff2","/_next/static/media/3679aa72a9b9035f-s.p.0h6ig86gwutp4.woff2","/_next/static/media/44e0cb21b0d052b7-s.0bp8oijd_gu96.woff2","/_next/static/media/45462fd7b7c12654-s.0k62hbripvv8p.woff2","/_next/static/media/46a9e2f250689b4a-s.0-dom-5bn10r2.woff2","/_next/static/media/53897e768d329f66-s.p.3t6q91iet4nsy.woff2","/_next/static/media/6131cbbf5549afa2-s.2uwcyprjm3xu3.woff2","/_next/static/media/76b70a1dbe058eb5-s.1y4-pdgsjb-pw.woff2","/_next/static/media/954d21e04331b2ae-s.0vfdmo25voy_0.woff2","/_next/static/media/9980bffaf04dae80-s.09difdiezbn92.woff2","/_next/static/media/99a2019bdfa8519b-s.176arc174-8zp.woff2","/_next/static/media/ba63f6a0e436df8e-s.3-6t-g6q0vh0a.woff2","/_next/static/media/e835da02aa0103b3-s.p.3gzquc588wbg4.woff2","/_next/static/media/f9cd5a77d065db98-s.1fby2rem9ngyr.woff2","/_next/static/media/fdb22df95c69d750-s.43yn3v1dnm71_.woff2"];
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
