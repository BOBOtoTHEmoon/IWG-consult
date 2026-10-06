import DeliverySettings from "@/components/admin/DeliverySettings";
import { getShippingSetup } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export default async function AdminDelivery() {
  const { zones, methods } = await getShippingSetup();
  return <DeliverySettings zones={zones} methods={methods} />;
}