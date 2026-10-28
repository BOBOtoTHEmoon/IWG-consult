import FinishOrder from "@/components/shop/FinishOrder";

export const dynamic = "force-dynamic";
export const metadata = { title: "Confirming your payment | Import with Goody", robots: { index: false } };

// Stripe sends the customer here after paying by card.
export default async function PaymentComplete({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  return <FinishOrder sessionId={session_id ?? ""} />;
}