import type { MetadataRoute } from "next";
import { PRODUCTS } from "./lib/marketing";
import { JOURNAL } from "./lib/journal";
import { SITE } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about/farmers", priority: 0.9, changeFrequency: "monthly" },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" },
    { path: "/products/gi-tagged", priority: 0.95, changeFrequency: "weekly" },
    { path: "/products/non-gi-tagged", priority: 0.9, changeFrequency: "weekly" },
    { path: "/farmers", priority: 0.85, changeFrequency: "monthly" },
    { path: "/b2b", priority: 0.95, changeFrequency: "monthly" },
    { path: "/journal", priority: 0.85, changeFrequency: "weekly" },
    { path: "/sustainability", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticEntries = staticRoutes.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${SITE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const journalRoutes = JOURNAL.map((p) => ({
    url: `${SITE}/journal/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...productRoutes, ...journalRoutes];
}
