import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { finalizeStripeOrder } from "@/lib/stripe-fulfil";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Card payment, step 2: the customer is back from Stripe. Confirm the payment and return their order.
// The webhook does the same job, so whichever arrives first creates the order.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ status: "failed", message: "We couldn't find this payment." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.kind !== "order") {
      return NextResponse.json({ status: "failed", message: "This payment isn't linked to an order." }, { status: 400 });
    }
    if (session.payment_status !== "paid") {
      // Finished on Stripe but the money is still on its way (some payment types take a moment).
      if (session.status === "complete") return NextResponse.json({ status: "pending" });
      return NextResponse.json({ status: "unpaid", message: "Your payment wasn't completed, so you haven't been charged." });
    }
    return NextResponse.json(await finalizeStripeOrder(session));
  } catch (err) {
    console.error("Stripe confirm:", err);
    return NextResponse.json({ status: "pending" });
  }
}