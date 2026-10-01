import { notFound } from "next/navigation";
import OrderView from "@/components/admin/OrderView";
import { getOrder } from "@/lib/data";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  return <OrderView order={order} />;
}