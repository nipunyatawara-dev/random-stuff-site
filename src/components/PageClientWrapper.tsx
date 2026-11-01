"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { clearLenisInstance, setLenisInstance } from "@/lib/lenis";

export default function PageClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Defer offline precaching until the page's initial resources have loaded.
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      let cancelled = false;
      let idleId: number | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const register = () => {
        if (!cancelled) navigator.serviceWorker.register("/sw.js").catch(() => {});
      };
      const schedule = () => {
        if ("requestIdleCallback" in window) {
          idleId = window.requestIdleCallback(register, { timeout: 3000 });
        } else {
          timer = setTimeout(register, 1000);
        }
      };
      if (document.readyState === "complete") schedule();
      else window.addEventListener("load", schedule, { once: true });
      return () => {
        cancelled = true;
        window.removeEventListener("load", schedule);
        if (idleId !== undefined) window.cancelIdleCallback(idleId);
        if (timer !== undefined) clearTimeout(timer);
      };
    }
  }, []);

  // Detect mobile on mount for Lenis config (avoids SSR hydration mismatch for logic)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lenis smooth scrolling for tactile flow
  useEffect(() => {
    if (isMobile === null) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: isMobile ? 0.1 : 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      syncTouch: false,
    });
    setLenisInstance(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onVisibilityChange = () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = requestAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearLenisInstance(lenis);
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isMobile]);

  return <>{children}</>;
}
