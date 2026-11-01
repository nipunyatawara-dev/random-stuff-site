import type { Item } from "@/data/items";
import HeroSection from "./HeroSection";
import ContentSection from "./ContentSection";
import Footer from "./Footer";
import SiteHeader from "./SiteHeader";
export default function ClientPageLayout({ items }: { items: Item[] }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-main">
        <HeroSection totalItemsCount={items.length} />
        <ContentSection initialItems={items} />
      </main>
      <Footer />
    </>
  );
}
