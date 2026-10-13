"use client";

import { useLayoutEffect } from "react";
import { applyColorMode, COLOR_MODE_STORAGE_KEY, COLOR_MODE_PREFERENCE_EVENT, resolveColorMode } from "@/lib/color-mode";

export default function ColorModeController() {
  useLayoutEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    let preference: string | null = null;
    try {
      preference = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    } catch {}
    const sync = () => applyColorMode(resolveColorMode(preference, system.matches));
    const onStorage = (event: StorageEvent) => {
      if (event.key === COLOR_MODE_STORAGE_KEY || event.key === null) {
        preference = event.newValue;
        sync();
      }
    };
    // Track same-tab selections too, including when persistence is blocked.
    const onSelection = () => {
      preference = document.documentElement.dataset.colorMode ?? null;
    };
    sync();
    window.addEventListener("storage", onStorage);
    window.addEventListener(COLOR_MODE_PREFERENCE_EVENT, onSelection);
    system.addEventListener("change", sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(COLOR_MODE_PREFERENCE_EVENT, onSelection);
      system.removeEventListener("change", sync);
    };
  }, []);
  return null;
}
