import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, SITE_URL } from "@/lib/seo";

const priorities: Record<(typeof INDEXABLE_ROUTES)[number], number> = {
  "": 1,
  "/productos": 0.9,
  "/combos": 0.8,
  "/nosotros": 0.7,
  "/reservas": 0.8,
  "/ubicacion": 0.8,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return INDEXABLE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "/productos" ? "daily" : "weekly",
    priority: priorities[route],
  }));
}
