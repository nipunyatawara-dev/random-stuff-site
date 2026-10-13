export interface PageLoadingProgress {
  known: boolean;
  completed: number;
  total: number;
  failed: number;
  percent: number;
  done: boolean;
}

export const INITIAL_PAGE_LOADING: PageLoadingProgress = {
  known: false, completed: 0, total: 0, failed: 0, percent: 0, done: false,
};

/** Counts settled startup resources, not bytes or estimated elapsed time.
 * Freeze the resource list after the initial catalog URL has been restored.
 * Offscreen lazy images and optional dialogs are not required to enter the site.
 */
export function trackPageLoading(
  doc: Document,
  win: Window,
  onProgress: (progress: PageLoadingProgress) => void,
) {
  let disposed = false;
  let known = false;
  const tasks = new Map<string, "pending" | "ready" | "failed">([
    ["document", "pending"], ["fonts", "pending"], ["catalog", "pending"],
  ]);
  const cleanups: Array<() => void> = [];

  const publish = () => {
    if (disposed || !known) return;
    const values = [...tasks.values()];
    const completed = values.filter((value) => value !== "pending").length;
    const done = completed === values.length;
    onProgress({
      known: true, completed, total: values.length,
      failed: values.filter((value) => value === "failed").length,
      percent: done ? 100 : Math.floor(completed / values.length * 100), done,
    });
  };
  const settle = (key: string, failed = false) => {
    if (disposed || tasks.get(key) !== "pending") return;
    tasks.set(key, failed ? "failed" : "ready");
    publish();
  };

  const onLoad = () => settle("document");
  win.addEventListener("load", onLoad, { once: true });
  cleanups.push(() => win.removeEventListener("load", onLoad));
  if (doc.readyState === "complete") settle("document");

  return {
    markCatalogReady() {
      if (disposed || known) return;
      const images = [...doc.querySelectorAll("img")].filter((img) => {
        if (!img.currentSrc && !img.getAttribute("src")) return false;
        const rect = img.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 &&
          rect.right > 0 && rect.top < win.innerHeight && rect.left < win.innerWidth;
      });
      images.forEach((_, index) => tasks.set(`image-${index}`, "pending"));
      tasks.set("catalog", "ready");
      known = true;

      images.forEach((img, index) => {
        const key = `image-${index}`;
        let decoding = false;
        const clear = () => {
          img.removeEventListener("load", loaded);
          img.removeEventListener("error", failed);
        };
        const failed = () => { clear(); settle(key, true); };
        const loaded = () => {
          if (disposed || decoding) return;
          decoding = true;
          clear();
          if (!img.naturalWidth) settle(key, true);
          else if (typeof img.decode === "function") {
            img.decode().then(() => settle(key), () => settle(key, true));
          } else settle(key);
        };
        img.addEventListener("load", loaded, { once: true });
        img.addEventListener("error", failed, { once: true });
        cleanups.push(clear);
        // Cached images may have completed before listeners were attached.
        if (img.complete) loaded();
      });

      if (doc.fonts) {
        doc.fonts.ready.then(() => settle("fonts"), () => settle("fonts", true));
      } else settle("fonts");
      publish();
    },
    dispose() {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
    },
  };
}
