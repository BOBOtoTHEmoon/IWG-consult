"use client";

import { useRouter } from "next/navigation";
import PayPalPay from "./PayPalPay";

// The £50 sourcing fee on the customer's request page.
export default function SourcingPayButton({ refId }: { refId: string }) {
  const router = useRouter();
  return (
    <PayPalPay
      createUrl="/api/sourcing/pay"
      captureUrl="/api/sourcing/pay"
      createBody={() => ({ action: "create", ref: refId })}
      captureBody={(paypalOrderId) => ({ action: "capture", ref: refId, paypalOrderId })}
      onPaid={() => router.refresh()}
    />
  );
}