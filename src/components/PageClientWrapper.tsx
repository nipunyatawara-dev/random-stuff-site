"use client";
import { useEffect } from "react";
export default function PageClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    )
      return;
    let cancelled = false;
    const register = () => {
      if (!cancelled)
        navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    const timer = setTimeout(register, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
  return <>{children}</>;
}
