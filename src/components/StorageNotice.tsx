"use client";
import { useEffect, useState } from "react";
export default function StorageNotice() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const listener = (event: Event) =>
      setMessage((event as CustomEvent<string>).detail);
    window.addEventListener("favorites-notice", listener);
    return () => window.removeEventListener("favorites-notice", listener);
  }, []);
  return message ? (
    <aside className="storage-notice" role="alert">
      <span>{message}</span>
      <button className="button" onClick={() => setMessage("")}>
        Dismiss
      </button>
    </aside>
  ) : null;
}
