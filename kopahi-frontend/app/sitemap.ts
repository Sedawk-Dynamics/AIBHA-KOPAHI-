import type { MetadataRoute } from "next";
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

  // Journal entries stay listed until the essays migrate to the WordPress
  // blog — drop this block together with app/journal at that point.
  const journalRoutes = JOURNAL.map((p) => ({
    url: `${SITE}/journal/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...journalRoutes];
}
