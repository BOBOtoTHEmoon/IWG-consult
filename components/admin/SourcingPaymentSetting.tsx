"use client";

import { useState, useTransition } from "react";
import { saveSourcingPaymentMethods } from "@/app/admin/sourcing/actions";
import { PAYMENT_CHOICES, sameMethods, type PaymentMethod } from "@/lib/payment-methods";

// Lets Goody choose how customers pay the £50 sourcing fee.
export default function SourcingPaymentSetting({ initial }: { initial: PaymentMethod[] }) {
  const [methods, setMethods] = useState(initial);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, startSaving] = useTransition();

  function choose(next: PaymentMethod[]) {
    const before = methods;
    setMethods(next);
    setMessage(null);
    startSaving(async () => {
      const result = await saveSourcingPaymentMethods(next);
      if (result.ok) setMessage({ ok: true, text: "Saved. New payments use this straight away." });
      else {
        setMethods(before);
        setMessage({ ok: false, text: result.error });
      }
    });
  }

  return (
    <section className="flex flex-col gap-3 rounded-[18px] border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold">How customers pay the £50 fee</span>
        <span className="text-[13px] text-subtle">Choose PayPal, Stripe (card), or let the customer pick either.</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:max-w-[480px]">
        {PAYMENT_CHOICES.map((choice) => {
          const on = sameMethods(methods, choice.value);
          return (
            <button
              key={choice.label}
              type="button"
              disabled={saving}
              onClick={() => !on && choose(choice.value)}
              aria-pressed={on}
              className={`rounded-xl border-[1.5px] px-2 py-3 text-[15px] font-semibold disabled:opacity-60 ${on ? "border-ink bg-paper" : "border-line-strong"}`}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
      {message && (
        <span role="status" className={`text-sm font-semibold ${message.ok ? "text-jade" : "text-clay-dark"}`}>
          {message.text}
        </span>
      )}
    </section>
  );
}