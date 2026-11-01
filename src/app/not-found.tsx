import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="content-page">
        <h1>This corner is empty.</h1>
        <p>
          The page may have moved, or the link may be incomplete. Your saved
          tools are still in this browser.
        </p>
        <div className="dialog-actions">
          <Link className="button button-primary" href="/#catalog-section">
            Find a tool
          </Link>
          <Link className="button" href="/?category=favorites#catalog-section">
            Open saved tools
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
