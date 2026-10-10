import type { MetadataRoute } from "next";
import { categories } from "@/lib/data";
import { getLiveProducts } from "@/lib/products";
import { site } from "@/lib/site";

// Rebuilt at most once an hour, so new products are picked up.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" | "yearly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  const products = await getLiveProducts();

  return [
    page("/", 1, "daily"),
    page("/shop", 0.9, "daily"),
    page("/sourcing", 0.9, "monthly"),
    page("/about", 0.6, "monthly"),
    page("/faqs", 0.5, "monthly"),
    page("/contact", 0.5, "yearly"),
    page("/delivery", 0.4, "yearly"),
    page("/returns", 0.4, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
    ...categories.map((c) => page(`/shop?category=${c.slug}`, 0.7, "weekly")),
    ...products.map((p) => ({
      url: `${site.url}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.slice(0, 1),
    })),
  ];
}