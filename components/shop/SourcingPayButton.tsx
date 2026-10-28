"use client";

import { useRouter } from "next/navigation";
import type { PaymentMethod } from "@/lib/payment-methods";
import PayPalPay from "./PayPalPay";
import StripePay from "./StripePay";

// The £50 sourcing fee on the customer's request page. Shows the ways Goody has switched on in the admin.
export default function SourcingPayButton({ refId, methods }: { refId: string; methods: PaymentMethod[] }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      {methods.includes("stripe") && (
        <StripePay createUrl="/api/sourcing/pay" createBody={() => ({ action: "stripe", ref: refId })} label="Pay £50 by card" />
      )}
      {methods.length === 2 && (
        <div className="flex items-center gap-3 text-sm text-subtle">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>
      )}
      {methods.includes("paypal") && (
        <PayPalPay
          createUrl="/api/sourcing/pay"
          captureUrl="/api/sourcing/pay"
          createBody={() => ({ action: "create", ref: refId })}
          captureBody={(paypalOrderId) => ({ action: "capture", ref: refId, paypalOrderId })}
          onPaid={() => router.refresh()}
        />
      )}
    </div>
  );
}