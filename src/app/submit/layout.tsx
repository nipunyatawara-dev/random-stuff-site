import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Suggest a useful tool",
  description: "Suggest a website, desktop app or CLI tool for manual review in Random Stuff.",
  alternates: { canonical: "/submit" },
  robots: { index: false, follow: true },
};
export default function SubmitLayout({ children }: { children: React.ReactNode }) { return children; }
