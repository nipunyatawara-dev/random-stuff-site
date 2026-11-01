import type { Metadata } from "next";
import Link from "next/link";
import { items } from "@/data/items";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "All tools — text index",
  description: "An alphabetical text index of every tool in Random Stuff.",
  alternates: { canonical: "/tools" },
};
export default function ToolIndex() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="content-page">
        <h1>Every useful find.</h1>
        <p>
          An alphabetical index that works without JavaScript. Use your
          browser’s Find command, or{" "}
          <Link href="/#catalog-section">search the interactive directory</Link>
          .
        </p>
        <ul className="text-index">
          {[...items]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((item) => (
              <li key={item.id}>
                <Link href={`/tools/${item.id}`}>{item.title}</Link>
                <p>{item.description}</p>
              </li>
            ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
