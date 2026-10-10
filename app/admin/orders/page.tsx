import OrdersList from "@/components/admin/OrdersList";
import { getOrders } from "@/lib/orders";

export default async function AdminOrders() {
  const orders = await getOrders();
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-4 px-4 py-6 sm:px-8 lg:py-9">
      <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Orders</h1>
      <OrdersList orders={orders} />
    </main>
  );
}