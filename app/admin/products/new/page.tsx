import ProductForm from "@/components/admin/ProductForm";
import { getShippingSetup } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const shipping = await getShippingSetup();
  return <ProductForm shipping={shipping} />;
}