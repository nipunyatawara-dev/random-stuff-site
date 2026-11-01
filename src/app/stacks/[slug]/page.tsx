import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { items } from "@/data/items";
import { CURATED_STACKS } from "@/data/stacks";
import { SITE_URL } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ToolActions from "@/components/ToolActions";
export const dynamicParams = false;
export function generateStaticParams() {
  return CURATED_STACKS.map((s) => ({ slug: s.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stack = CURATED_STACKS.find((s) => s.id === slug);
  return stack
    ? {
        title: stack.title,
        description: stack.description,
        alternates: { canonical: `/stacks/${slug}` },
        openGraph: {
          title: stack.title,
          description: stack.description,
          url: `${SITE_URL}/stacks/${slug}`,
        },
        twitter: { title: stack.title, description: stack.description },
      }
    : {};
}
export default async function StackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stack = CURATED_STACKS.find((s) => s.id === slug);
  if (!stack) notFound();
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="content-page">
        <Link className="back-link" href="/?category=stacks#catalog-section">
          ← All curated stacks
        </Link>
        <h1>{stack.title}</h1>
        <p>{stack.description}</p>
        <ToolActions ids={stack.itemIds} path={`/stacks/${stack.id}`} />
        <h2>A role for every tool</h2>
        <ol className="stack-workflow">
          {stack.itemIds.map((id) => {
            const item = items.find((i) => i.id === id)!;
            return (
              <li key={id}>
                <div>
                  <strong>
                    <Link href={`/tools/${id}`}>{item.title}</Link>
                  </strong>
                  <p>{stack.roles[id]}</p>
                </div>
                <a
                  href={item.website || item.github}
                  className="button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official site ↗
                </a>
              </li>
            );
          })}
        </ol>
        <p>
          Check each tool’s platform requirements, license and plan before
          installing. Saving this kit keeps its tools in this browser; it does
          not install them.
        </p>
        <Link href={`/?category=stacks&stack=${stack.id}#catalog-section`}>
          Search and filter this stack in the catalog →
        </Link>
      </main>
      <Footer />
    </>
  );
}
