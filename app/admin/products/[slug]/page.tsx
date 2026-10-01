import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProductForAdmin } from "@/lib/products";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductForAdmin(slug);
  if (!product) notFound();
  return <ProductForm product={product} />;
}