import ContentEditor from "@/components/admin/ContentEditor";
import { getAllProducts } from "@/lib/products";
import { getCategories, getSiteSettings } from "@/lib/site-content";

export default async function AdminContent() {
  const [settings, categories, products] = await Promise.all([getSiteSettings(), getCategories(), getAllProducts()]);
  const liveProducts = products.filter((p) => p.status === "live").map((p) => ({ id: p.id, name: p.name }));
  return <ContentEditor settings={settings} categories={categories} products={liveProducts} />;
}