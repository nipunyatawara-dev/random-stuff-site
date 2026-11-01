"use client";
import Link from "next/link";
export default function MobileNavigation() {
  return (
    <details className="mobile-nav">
      <summary aria-label="Open navigation">Menu</summary>
      <nav
        aria-label="Mobile navigation"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) {
            const details = event.currentTarget.closest("details");
            if (details) details.open = false;
          }
        }}
      >
        <Link href="/#catalog-section" prefetch={false}>
          Explore tools
        </Link>
        <Link href="/?category=stacks#catalog-section" prefetch={false}>
          Curated stacks
        </Link>
        <Link href="/?category=favorites#catalog-section" prefetch={false}>
          Saved tools
        </Link>
        <Link href="/submit">Suggest a tool</Link>
        <Link href="/about">How we curate</Link>
      </nav>
    </details>
  );
}
