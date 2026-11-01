import { SITE_URL } from "@/lib/site";
import { NextResponse } from "next/server";
import { getItems } from "@/lib/items-server";
import { newestItems } from "@/lib/catalog-dates";

export const dynamic = "force-static";

export async function GET() {
  const items = await getItems();
  const siteUrl = SITE_URL;

  const feedItems = newestItems(items).slice(0, 50);

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
      const link = `${siteUrl}/tools/${item.id}`;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(item.id)}</guid>
      <description>${escapeXml(item.description)}</description>
      <category>${escapeXml(item.category)}</category>
      ${item.addedAt ? `<pubDate>${new Date(item.addedAt).toUTCString()}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Random Stuff - Curated Web Tools &amp; Resources</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>A curated, high-voltage index of unusual, powerful, and delightfully designed developer tools, libraries, software, and digital oddities.</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
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
