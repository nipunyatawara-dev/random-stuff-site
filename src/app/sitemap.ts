import type { MetadataRoute } from "next";
import { items } from "@/data/items";
import { CURATED_STACKS } from "@/data/stacks";
import { SITE_URL } from "@/lib/site";
export default function sitemap():MetadataRoute.Sitemap{
 const dates=items.flatMap(i=>[i.addedAt,i.details?.verifiedAt].filter((d):d is string=>Boolean(d))).sort();
 return [{url:SITE_URL,lastModified:dates.at(-1),changeFrequency:"weekly",priority:1},{url:`${SITE_URL}/about`,changeFrequency:"monthly",priority:.4},...items.map(i=>({url:`${SITE_URL}/tools/${i.id}`,lastModified:i.details?.verifiedAt||i.addedAt,changeFrequency:"monthly" as const,priority:.7})),...CURATED_STACKS.map(s=>({url:`${SITE_URL}/stacks/${s.id}`,lastModified:"2026-11-01",changeFrequency:"monthly" as const,priority:.8}))];
}
