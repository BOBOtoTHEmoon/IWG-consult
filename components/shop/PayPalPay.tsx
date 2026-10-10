"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRef, useState } from "react";

// PayPal's buttons (PayPal, and debit or credit card), wired to our server.
// The server works out the amount; the browser never decides the price.
export default function PayPalPay({
  createUrl,
  captureUrl,
  createBody,
  captureBody,
  onPaid,
  disabled,
  refreshKey,
}: {
  createUrl: string;
  captureUrl: string;
  createBody: () => Record<string, unknown> | null; // null = the form isn't ready yet
  captureBody: (paypalOrderId: string) => Record<string, unknown>;
  onPaid: (result: Record<string, unknown>) => void;
  disabled?: boolean;
  refreshKey?: unknown[];
}) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lastError = useRef("");

  if (!clientId) {
    return <p className="rounded-[14px] bg-[#f6ddd0] px-4 py-3 text-sm font-semibold text-clay-dark">Payments aren&apos;t set up yet.</p>;
  }

  const fail = (message: string) => {
    lastError.current = message;
    throw new Error(message);
  };

  return (
    <PayPalScriptProvider options={{ clientId, currency: "GBP", intent: "capture", components: "buttons", locale: "en_GB" }}>
      <div className={`flex flex-col gap-3 ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <PayPalButtons
          style={{ layout: "vertical", shape: "pill", color: "gold", label: "pay", height: 50 }}
          disabled={disabled}
          forceReRender={refreshKey}
          onClick={(_data, actions) => {
            lastError.current = "";
            if (!createBody()) {
              // The browser has already highlighted and scrolled to the first missing field.
              setError("Please fill in the highlighted details above to continue.");
              return actions.reject();
            }
            setError("");
            return actions.resolve();
          }}
          createOrder={async () => {
            const body = createBody();
            if (!body) fail("Please check the form above.");
            const res = await fetch(createUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.id) fail(data.error || "We couldn't start your payment. Please try again.");
            return data.id as string;
          }}
          onApprove={async (data, actions) => {
            setBusy(true);
            try {
              const res = await fetch(captureUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(captureBody(data.orderID)),
              });
              const result = await res.json().catch(() => ({}));
              // Card declined: let them try another way without starting over.
              if (result.declined) {
                setError("Your payment method was declined. Please try another card or payment method.");
                return actions.restart();
              }
              if (!res.ok) {
                setError(result.error || "The payment didn't go through. You haven't been charged.");
                return;
              }
              onPaid(result);
            } finally {
              setBusy(false);
            }
          }}
          onCancel={() => setError("Payment cancelled. You haven't been charged.")}
          onError={() => setError(lastError.current || "Something went wrong with PayPal. Please try again.")}
        />
        {busy && <p className="text-center text-sm font-semibold text-muted">Confirming your payment...</p>}
        {error && (
          <p role="alert" className="rounded-[14px] bg-[#f6ddd0] px-4 py-3 text-sm font-semibold text-clay-dark">
            {error}
          </p>
        )}
      </div>
    </PayPalScriptProvider>
  );
}