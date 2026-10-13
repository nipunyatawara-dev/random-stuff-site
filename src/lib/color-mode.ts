export type ColorMode = "light" | "dark";

export const COLOR_MODE_STORAGE_KEY = "random-stuff-color-mode";
export const COLOR_MODE_EVENT = "random-stuff-color-mode-change";
export const COLOR_MODE_PREFERENCE_EVENT = "random-stuff-color-mode-preference-change";

export function resolveColorMode(stored: unknown, prefersDark: boolean): ColorMode {
  return stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
}

// Runs synchronously in <head>, before the first paint. Keep this in sync with
// resolveColorMode; storage may be unavailable in private/embedded browsers.
export const COLOR_MODE_INIT_SCRIPT = `(()=>{let mode;try{mode=localStorage.getItem("${COLOR_MODE_STORAGE_KEY}")}catch{}document.documentElement.dataset.colorMode=mode==="light"||mode==="dark"?mode:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"})()`;

export function applyColorMode(mode: ColorMode) {
  document.documentElement.dataset.colorMode = mode;
  window.dispatchEvent(new Event(COLOR_MODE_EVENT));
}

export function setColorMode(mode: ColorMode) {
  // Apply even if persistence is blocked.
  applyColorMode(mode);
  window.dispatchEvent(new Event(COLOR_MODE_PREFERENCE_EVENT));
  try {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
  } catch {}
}
