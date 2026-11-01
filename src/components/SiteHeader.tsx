import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OtterLogo } from "./studio/Icons";
import ColorModeToggle from "./ColorModeToggle";
export default function SiteHeader() {
  return (
<header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur-md border-b border-border-subtle px-4 md:px-8 py-3 select-none">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <OtterLogo size={32} />
            <span className="font-phudu font-bold text-lg text-studio-navy tracking-tight">
              RANDOM STUFF
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ColorModeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface shadow-studio-button border border-border-subtle text-xs font-semibold text-studio-navy hover:bg-studio-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-studio-blue" />
              <span className="hidden sm:inline">Back to Directory</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>
  );
}
