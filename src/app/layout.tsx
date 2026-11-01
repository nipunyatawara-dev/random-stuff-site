import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import StorageNotice from "@/components/StorageNotice";
import ColorModeController from "@/components/ColorModeController";
import { COLOR_MODE_INIT_SCRIPT } from "@/lib/color-mode";
import { items } from "@/data/items";

import { SITE_URL } from "@/lib/site";
import PrivacySpeedInsights from "@/components/PrivacySpeedInsights";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const catalogDescription = `Directory of ${items.length} handpicked websites, desktop apps, and CLI scripts for builders and creators.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Random Stuff - Curated Tools & Scripts Directory",
    template: "%s | Random Stuff",
  },
  description: catalogDescription,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Random Stuff - Curated Directory for Builders",
    description: catalogDescription,
    url: SITE_URL,
    siteName: "Random Stuff",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Stuff - Curated Directory for Builders",
    description: catalogDescription,
    creator: "@nipunyatawara",
  },
};

const shouldRenderVercelInsights =
  process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={hanken.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: COLOR_MODE_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased bg-canvas text-studio-navy min-h-screen selection:bg-[#9DF71F] selection:text-studio-ink">
        <ColorModeController />
        <StorageNotice />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        {shouldRenderVercelInsights ? <PrivacySpeedInsights /> : null}
      </body>
    </html>
  );
}
