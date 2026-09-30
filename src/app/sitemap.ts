import { MetadataRoute } from "next";
import { items } from "@/data/items";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://randomstuff.shocka.site";
  const now = new Date();

  const categories = ["Websites", "Softwares", "Scripts"];
  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/?category=${cat}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const toolEntries: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${baseUrl}/?tool=${item.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...categoryEntries,
    ...toolEntries,
  ];
}
