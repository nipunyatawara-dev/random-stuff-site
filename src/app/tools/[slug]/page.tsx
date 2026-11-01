import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { items } from "@/data/items";
import { SITE_URL } from "@/lib/site";
import { getVisiblePlatformTags } from "@/lib/platform-tags";
import { formatCatalogDate } from "@/lib/catalog-dates";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ComparisonFacts from "@/components/ComparisonFacts";
import ToolActions from "@/components/ToolActions";
export const dynamicParams = false;
export function generateStaticParams() {
  return items.map((item) => ({ slug: item.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = items.find((i) => i.id === slug);
  if (!item) return {};
  return {
    title: `${item.title} — details & alternatives`,
    description: item.description,
    alternates: { canonical: `/tools/${item.id}` },
    openGraph: {
      title: item.title,
      description: item.description,
      url: `${SITE_URL}/tools/${item.id}`,
    },
    twitter: { title: item.title, description: item.description },
  };
}
export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = items.find((i) => i.id === slug);
  if (!item) notFound();
  const related = items
    .filter((i) => i.id !== item.id)
    .map((i) => ({
      item: i,
      score: i.topics.filter((t) => item.topics.includes(t)).length,
    }))
    .filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: item.title,
    description: item.description,
    url: `${SITE_URL}/tools/${item.id}`,
    datePublished: item.addedAt,
    about: {
      "@type": "SoftwareApplication",
      name: item.title,
      url: item.website || item.github,
      description: item.description,
    },
  };
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="content-page">
        <Link className="back-link" href="/#catalog-section">
          ← Back to the directory
        </Link>
        <div className="tool-intro">
          <Image unoptimized src={item.image!} width="64" height="64" alt="" />
          <h1>{item.title}</h1>
        </div>
        <p>{item.description}</p>
        <p>
          {item.category === "Softwares" ? "Software" : item.category} ·{" "}
          {getVisiblePlatformTags(item)
            .filter((t) =>
              ["macos", "windows", "linux", "web", "cli", "terminal"].includes(
                t,
              ),
            )
            .join(", ") || "Platform support not verified"}
        </p>
        <div className="dialog-actions">
          {!item.linkUnavailable && (
            <a
              className="button button-primary"
              href={item.website || item.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {item.title} ↗
            </a>
          )}
          {item.github && !item.linkUnavailable && (
            <a
              className="button"
              href={item.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {new URL(item.github).pathname.split("/").filter(Boolean).length <
              2
                ? "GitHub organization"
                : "Project repository"}{" "}
              ↗
            </a>
          )}
        </div>
        {item.linkUnavailable && (
          <p className="notice">
            The previously listed destination no longer responds. Its visit link
            is disabled until an official replacement is verified. You can
            report a correction below.
          </p>
        )}
        <ToolActions ids={[item.id]} path={`/tools/${item.id}`} />
        <h2>Before you choose</h2>
        <ComparisonFacts item={item} />
        <p className="field-hint">
          Facts without a cited review are marked “Not verified.” Check the
          official site for current pricing and compatibility. Added{" "}
          {item.addedAt ? formatCatalogDate(item.addedAt) : "date not recorded"}
          .
        </p>
        <p>
          <a
            href={`https://github.com/nipunyatawara-dev/random-stuff-site/issues/new?title=${encodeURIComponent(`Listing correction: ${item.title}`)}&body=${encodeURIComponent(`Tool: ${SITE_URL}/tools/${item.id}\n\nWhat is incorrect or broken?\n\nOfficial replacement source:`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Report a broken link or incorrect detail ↗
          </a>
        </p>
        <h2>Related tools to explore</h2>
        <p>
          Related by topic, rather than a claim that these tools have identical
          features.
        </p>
        <div className="related-tools">
          {related.map(({ item: i }) => (
            <Link href={`/tools/${i.id}`} key={i.id}>
              <strong>{i.title}</strong>
              <span>{i.description}</span>
            </Link>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
