import type { MetadataRoute } from "next";
import { PRODUCTS, JOURNAL } from "./lib/marketing";

const SITE = "https://kopahi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/farmers",
    "/sustainability",
    "/journal",
    "/contact",
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${SITE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const journalRoutes = JOURNAL.map((p) => ({
    url: `${SITE}/journal/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...journalRoutes];
}
