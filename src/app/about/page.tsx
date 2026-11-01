import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
  title: "Curation & privacy",
  description:
    "How Random Stuff selects tools, maintains facts and handles browser favorites and tool suggestions.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="content-page">
        <h1>A useful little corner.</h1>
        <p>
          Random Stuff is an independent directory maintained by Nipun /
          ShockaGG. It collects useful websites, desktop software and scripts
          for people who build and create.
        </p>
        <h2>How we choose</h2>
        <p>
          We look for a clear purpose, practical usefulness and an official
          destination. Listings are editorial picks, not paid placements.
          Inclusion is not a security audit or a promise that a tool is right
          for every person. Suggestions are reviewed manually; acceptance and
          review times are not guaranteed.
        </p>
        <h2>Facts you can check</h2>
        <p>
          Pricing, license, account and offline facts are shown only with
          official sources and a review date. Unknown facts remain unverified. A
          GitHub link alone does not establish an open-source license. Platforms
          are listed only where recorded explicitly; model and plugin licenses
          may differ from the host application.
        </p>
        <h2>Your saved tools</h2>
        <p>
          Favorites, theme and sound preferences stay in local storage in this
          browser. There is no account or cross-device sync. Export a JSON
          backup to move your collection. Clearing browser data removes it.
          Offline caches contain public pages and assets you have visited.
        </p>
        <h2>Suggestions and external services</h2>
        <p>
          The form sends your tool name, public URL, category and description to
          a Discord channel for review. Do not include private information or
          secrets. A hashed network identifier is used for temporary rate
          limits; names and URLs are hashed for 24-hour duplicate checks in the
          configured submission store. The site has no advertising or page-view
          analytics. Vercel Speed Insights collects performance diagnostics on
          Vercel deployments; query strings and fragments are removed from
          reported URLs.
        </p>
        <p>
          Tool icons are generated locally. Visiting an external tool, a source
          link or GitHub takes you to that service’s own privacy policy. The
          directory does not fetch tool metadata from visitor-supplied URLs.
        </p>
        <h2>Corrections and contact</h2>
        <p>
          Use the correction link on a tool’s details page or{" "}
          <a
            href="https://github.com/nipunyatawara-dev/random-stuff-site/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            open a repository issue
          </a>{" "}
          to report an incorrect fact, broken link or privacy question. Please
          avoid posting personal information in a public issue.
        </p>
      </main>
      <Footer />
    </>
  );
}
