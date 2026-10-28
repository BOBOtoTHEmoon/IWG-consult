"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckIcon, InfoIcon } from "../Icons";
import { useBasket } from "./BasketProvider";

type View = { kind: "working" } | { kind: "slow" } | { kind: "problem"; message: string; unpaid: boolean };

// Shown after a card payment: confirms it with the server, empties the basket and opens the order.
export default function FinishOrder({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { clear } = useBasket();
  const [view, setView] = useState<View>({ kind: "working" });

  useEffect(() => {
    let stopped = false;
    (async () => {
      for (let attempt = 0; attempt < 8 && !stopped; attempt++) {
        try {
          const res = await fetch("/api/checkout/stripe/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json().catch(() => ({}));
          if (stopped) return;
          if (data.status === "done") {
            clear();
            router.replace(data.ref ? `/order/${data.ref}` : "/shop");
            return;
          }
          if (data.status === "failed" || data.status === "unpaid") {
            setView({ kind: "problem", message: data.message || "Something went wrong with your payment.", unpaid: data.status === "unpaid" });
            return;
          }
        } catch {
          // Network hiccup: try again below.
        }
        await new Promise((r) => setTimeout(r, 2500));
      }
      // Paid, but not confirmed yet. The webhook will finish the order and email them.
      if (!stopped) {
        clear();
        setView({ kind: "slow" });
      }
    })();
    return () => {
      stopped = true;
    };
  }, [sessionId, clear, router]);

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4 px-5 py-24 text-center">
      {view.kind === "working" && (
        <>
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-sand border-t-clay" aria-hidden />
          <h1 className="font-display text-3xl">Confirming your payment...</h1>
          <p className="text-muted">This only takes a moment. Please don&apos;t close this page.</p>
        </>
      )}
      {view.kind === "slow" && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-jade text-white">
            <CheckIcon size={26} strokeWidth={2.5} />
          </span>
          <h1 className="font-display text-3xl">Thank you, your payment is in</h1>
          <p className="text-muted">
            We&apos;re just finishing your order. You&apos;ll get a confirmation email shortly. There&apos;s no need to pay again.
          </p>
          <Link href="/shop" className="mt-2 flex h-12 items-center rounded-full bg-clay px-6 font-semibold text-white">
            Back to the shop
          </Link>
        </>
      )}
      {view.kind === "problem" && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f6ddd0] text-clay-dark">
            <InfoIcon size={26} />
          </span>
          <h1 className="font-display text-3xl">{view.unpaid ? "Payment not completed" : "There was a problem"}</h1>
          <p className="text-muted">{view.message}</p>
          <Link
            href={view.unpaid ? "/checkout" : "/contact"}
            className="mt-2 flex h-12 items-center rounded-full bg-clay px-6 font-semibold text-white"
          >
            {view.unpaid ? "Back to checkout" : "Contact us"}
          </Link>
        </>
      )}
    </div>
  );
}