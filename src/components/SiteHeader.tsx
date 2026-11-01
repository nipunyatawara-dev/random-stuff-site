import MobileNavigation from "./MobileNavigation";
import Link from "next/link";
import { OtterLogo } from "./studio/Icons";
import ColorModeToggle from "./ColorModeToggle";
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="wordmark" aria-label="Random Stuff home">
          <OtterLogo size={34} />
          <span>
            Random Stuff
            <span className="wordmark-note">
              A useful little corner of the internet.
            </span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link href="/#catalog-section" prefetch={false}>
            Explore
          </Link>
          <Link href="/?category=stacks#catalog-section" prefetch={false}>
            Stacks
          </Link>
          <Link href="/?category=favorites#catalog-section" prefetch={false}>
            Saved tools
          </Link>
        </nav>
        <div className="header-actions">
          <ColorModeToggle />
          <Link href="/submit" className="button button-small header-submit">
            Suggest a tool
          </Link>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
