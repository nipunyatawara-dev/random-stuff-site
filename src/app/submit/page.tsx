import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import SubmissionForm from "@/components/SubmissionForm";
export const metadata: Metadata = {
  title: "Suggest a useful tool",
  description:
    "Suggest a website, desktop app or CLI tool for manual review in Random Stuff.",
  alternates: { canonical: "/submit" },
  robots: { index: false, follow: true },
};
export default function SubmitPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="submit-layout">
        <div>
          <Link className="text-button" href="/#catalog-section">
            ← Back to the directory
          </Link>
          <h1>Found a good tool?</h1>
          <p>Tell us what it does and why it belongs here.</p>
          <SubmissionForm />
        </div>
        <aside>
          <h2>Useful beats noisy.</h2>
          <p>A good suggestion has:</p>
          <ul>
            <li>A clear, practical purpose.</li>
            <li>An official website or repository.</li>
            <li>A specific reason someone would use it.</li>
          </ul>
          <p>
            Free and paid tools are welcome. No affiliate link farming or paid
            placement. Check the directory first to avoid duplicates.
          </p>
        </aside>
      </main>
      <Footer />
    </>
  );
}
