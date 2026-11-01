import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CURATED_STACKS } from "@/data/stacks";
export default function HeroSection({
  totalItemsCount,
}: {
  totalItemsCount: number;
}) {
  return (
    <section className="hero" aria-labelledby="site-title">
      <div>
        <h1 id="site-title">
          Good tools.
          <br />
          Less searching.
        </h1>
        <p>
          {totalItemsCount} handpicked websites, desktop apps and scripts.
          <br className="desktop-break" /> Find something useful. Keep it close.
        </p>
      </div>
      <Link href="/stacks/mac-powerpack" className="hero-pick">
        <span className="hero-pick-heading">
          A place to start <ArrowUpRight size={20} />
        </span>
        <strong>A calmer Mac setup</strong>
        <span>
          Launch, arrange and get things done.
          <br />
          {CURATED_STACKS[0].itemIds.length} tools, one considered kit.
        </span>
      </Link>
    </section>
  );
}
