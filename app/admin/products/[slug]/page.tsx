import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProduct, sampleStock } from "@/lib/data";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductForm product={product} stock={sampleStock[slug] ?? 0} />;
}