import { NextResponse } from "next/server";
import { getItems } from "@/lib/items-server";

export async function GET() {
  const items = await getItems();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://randomstuff.shocka.site";

  // Take the most recent items (first 50)
  const feedItems = items.slice(0, 50);

  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const xmlItems = feedItems
    .map((item) => {
      const link = item.website || item.github || `${siteUrl}/#${item.id}`;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <description>${escapeXml(item.description)}</description>
      <category>${escapeXml(item.category)}</category>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Random Stuff - Curated Web Tools &amp; Resources</title>
    <link>${siteUrl}</link>
    <description>A curated, high-voltage index of unusual, powerful, and delightfully designed developer tools, libraries, software, and digital oddities.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(rss.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
