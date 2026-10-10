import { notFound } from "next/navigation";
import OrderView from "@/components/admin/OrderView";
import { getOrderByNumber } from "@/lib/orders";

// The URL uses the order number, e.g. /admin/orders/IWG-1001
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderByNumber(decodeURIComponent(id));
  if (!order) notFound();
  return <OrderView order={order} />;
}