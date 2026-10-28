import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { handlePaidSession } from "@/lib/stripe-fulfil";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Stripe calls this when a payment succeeds, so every paid order is saved
// even if the customer closes the page before coming back to the site.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Webhook not set up." }, { status: 400 });

  let event: Stripe.Event;
  try {
    // Checks the message really came from Stripe.
    event = getStripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    try {
      await handlePaidSession(event.data.object as Stripe.Checkout.Session);
    } catch (err) {
      console.error("Stripe webhook:", err);
      return NextResponse.json({ error: "Couldn't process this payment yet." }, { status: 500 }); // Stripe will retry
    }
  }
  return NextResponse.json({ received: true });
}