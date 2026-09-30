import type { Metadata } from "next";
import { Inter, Phudu, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const phudu = Phudu({
  subsets: ["latin"],
  variable: "--font-phudu",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://randomstuff.shocka.site"),
  title: {
    default: "Random Stuff - Curated Tools & Scripts Directory",
    template: "%s | Random Stuff",
  },
  description: "Directory of 350+ handpicked websites, desktop apps, and CLI scripts for builders and creators.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Random Stuff - Curated Directory for Builders",
    description: "Directory of 350+ handpicked websites, desktop apps, and CLI scripts for builders and creators.",
    url: "https://randomstuff.shocka.site",
    siteName: "Random Stuff",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Stuff - Curated Directory for Builders",
    description: "Directory of 350+ handpicked websites, desktop apps, and CLI scripts for builders and creators.",
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
    <html
      lang="en"
      className={`${inter.variable} ${phudu.variable} ${caveat.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased bg-[#F0F2F5] text-[#14334D] min-h-screen selection:bg-[#9DF71F] selection:text-[#14334D]">
        {children}
        {shouldRenderVercelInsights ? <SpeedInsights /> : null}
        {shouldRenderVercelInsights ? <Analytics /> : null}
      </body>
    </html>
  );
}
