"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { COLOR_MODE_EVENT, setColorMode } from "@/lib/color-mode";

function subscribe(onChange: () => void) {
  window.addEventListener(COLOR_MODE_EVENT, onChange);
  return () => window.removeEventListener(COLOR_MODE_EVENT, onChange);
}
function getSnapshot() {
  return document.documentElement.dataset.colorMode === "dark";
}
function getServerSnapshot() {
  return false;
}

export default function ColorModeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return (
    <button
      type="button"
      onClick={() => setColorMode(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="icon-button color-mode-toggle"
    >
      <Moon aria-hidden="true" className="color-mode-moon w-4 h-4" />
      <Sun aria-hidden="true" className="color-mode-sun w-4 h-4" />
    </button>
  );
}
