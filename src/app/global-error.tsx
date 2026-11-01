"use client";
import Link from "next/link";
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui",
          padding: 32,
          color: "#14334d",
          background: "#f0f2f5",
        }}
      >
        <main>
          <h1>We could not load this page.</h1>
          <p>Your saved tools remain in this browser.</p>
          <button onClick={reset}>Try again</button>
          <p>
            <Link href="/">Return to the directory</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
