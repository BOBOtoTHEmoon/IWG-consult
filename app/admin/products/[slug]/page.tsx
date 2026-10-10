import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductForAdmin } from "@/lib/products";
import { getShippingSetup } from "@/lib/shipping";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, shipping] = await Promise.all([getProductForAdmin(slug), getShippingSetup()]);
  if (!product) notFound();
  return <ProductForm product={product} shipping={shipping} />;
}