"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="content-page">
      <h1>Something did not load.</h1>
      <p>
        Your browser’s saved tools are unaffected. Try this view again or return
        to the directory.
      </p>
      <div className="dialog-actions">
        <button className="button button-primary" onClick={reset}>
          Try again
        </button>
        <Link href="/">Return to tools</Link>
      </div>
    </main>
  );
}
