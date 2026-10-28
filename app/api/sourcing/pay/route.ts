import { NextRequest, NextResponse } from "next/server";
import { getSourcingPaymentMethods } from "@/lib/payment-settings";
import { capturePayPalOrder, createPayPalOrder } from "@/lib/paypal";
import { getSourcingRequestByRef } from "@/lib/sourcing";
import { markSourcingFeePaid } from "@/lib/sourcing-payments";
import { getStripe, stripeReady, toPence } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// The £50 sourcing fee.
// PayPal: "create" opens the PayPal payment; "capture" takes it and marks the request paid.
// Stripe: "stripe" opens Stripe's payment page; the webhook (or the return page) marks it paid.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ref = typeof body.ref === "string" ? body.ref : "";
  const request = await getSourcingRequestByRef(ref);
  if (!request) return NextResponse.json({ error: "We couldn't find this request." }, { status: 404 });
  if (request.feeStatus !== "unpaid") return NextResponse.json({ paid: true });

  try {
    if (body.action === "stripe") {
      const methods = await getSourcingPaymentMethods();
      if (!methods.includes("stripe") || !stripeReady()) {
        return NextResponse.json({ error: "Card payment isn't available for this. Please use PayPal." }, { status: 400 });
      }
      const origin = req.nextUrl.origin;
      const metadata = { kind: "sourcing", request_id: request.id, public_ref: request.publicRef };
      const session = await getStripe().checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: { currency: "gbp", unit_amount: toPence(request.feeAmount), product_data: { name: `Sourcing commitment fee (${request.number})` } },
          },
        ],
        customer_email: request.email,
        client_reference_id: request.id,
        metadata,
        payment_intent_data: { description: `Sourcing request ${request.number}: commitment fee`, metadata },
        success_url: `${origin}/sourcing/r/${request.publicRef}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/sourcing/r/${request.publicRef}`,
        locale: "en-GB",
      });
      return NextResponse.json({ url: session.url });
    }

    if (body.action === "create") {
      const methods = await getSourcingPaymentMethods();
      if (!methods.includes("paypal")) {
        return NextResponse.json({ error: "PayPal isn't available for this. Please pay by card." }, { status: 400 });
      }
      const id = await createPayPalOrder({
        reference: request.id,
        description: `Sourcing request ${request.number}: commitment fee`,
        items: [{ name: `Sourcing commitment fee (${request.number})`, quantity: 1, unitPrice: request.feeAmount }],
        itemTotal: request.feeAmount,
        shipping: 0,
        total: request.feeAmount,
        physical: false,
      });
      return NextResponse.json({ id });
    }

    if (body.action === "capture" && typeof body.paypalOrderId === "string") {
      const payment = await capturePayPalOrder(body.paypalOrderId.slice(0, 64));
      if (!payment.ok) return NextResponse.json({ error: payment.message, declined: payment.declined }, { status: payment.declined ? 422 : 502 });
      if (Math.abs(payment.amount - request.feeAmount) > 0.01) {
        console.error(`Sourcing fee mismatch on ${request.number}: paid ${payment.amount}`);
        return NextResponse.json({ error: "The payment amount didn't match. Please contact us." }, { status: 400 });
      }
      await markSourcingFeePaid(request.id, `PayPal ${payment.captureId}`);
      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    console.error("Sourcing payment:", err);
    return NextResponse.json({ error: "We couldn't process the payment. Please try again." }, { status: 500 });
  }
}