import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder, createPayPalOrder } from "@/lib/paypal";
import { getSourcingRequestByRef } from "@/lib/sourcing";
import { markSourcingFeePaid } from "@/lib/sourcing-payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// The £50 sourcing fee. "create" opens the PayPal payment; "capture" takes it and marks the request paid.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ref = typeof body.ref === "string" ? body.ref : "";
  const request = await getSourcingRequestByRef(ref);
  if (!request) return NextResponse.json({ error: "We couldn't find this request." }, { status: 404 });
  if (request.feeStatus !== "unpaid") return NextResponse.json({ paid: true });

  try {
    if (body.action === "create") {
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