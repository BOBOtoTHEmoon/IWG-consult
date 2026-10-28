"use client";

import { useEffect, useState } from "react";
import { LockIcon } from "../Icons";

// The card payment button. Asks our server for a Stripe payment page, then sends the customer there.
// The server works out the amount; the browser never decides the price.
export default function StripePay({
  createUrl,
  createBody,
  disabled,
  label = "Pay by card",
}: {
  createUrl: string;
  createBody: () => Record<string, unknown> | null; // null = the form isn't ready yet
  disabled?: boolean;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // If they come back with the browser's back button, let them press it again.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) setBusy(false);
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  async function pay() {
    setError("");
    const body = createBody();
    if (!body) {
      // The browser has already highlighted and scrolled to the first missing field.
      setError("Please fill in the highlighted details above to continue.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(createUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.assign(data.url as string);
        return; // stay busy while the browser leaves
      }
      if (res.ok && data.paid) {
        window.location.reload();
        return;
      }
      setError(data.error || "We couldn't start your payment. Please try again.");
    } catch {
      setError("We couldn't reach the payment service. Please check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={pay}
        disabled={disabled || busy}
        className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-ink text-base font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LockIcon size={18} />
        {busy ? "Opening secure payment..." : label}
      </button>
      {error && (
        <p role="alert" className="rounded-[14px] bg-[#f6ddd0] px-4 py-3 text-sm font-semibold text-clay-dark">
          {error}
        </p>
      )}
    </div>
  );
}