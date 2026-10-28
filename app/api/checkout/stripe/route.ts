import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { resolveCheckout } from "@/lib/checkout-server";
import { productImageUrl } from "@/lib/product-types";
import { getStripe, stripeReady, toPence } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Card payment, step 1: check the basket on the server, save it, and open Stripe's payment page for the exact total.
export async function POST(req: NextRequest) {
  if (!stripeReady()) {
    return NextResponse.json({ error: "Card payments aren't available right now. Please try again later." }, { status: 503 });
  }
  try {
    const result = await resolveCheckout(await req.json().catch(() => ({})), "stripe");
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    const c = result.checkout;

    const supabase = createAdminClient();
    const { data: checkout, error } = await supabase
      .from("checkouts")
      .insert({ data: c, subtotal: c.subtotal, shipping_price: c.shipping, total: c.total, provider: "stripe" })
      .select("id")
      .single();
    if (error || !checkout) {
      console.error("Saving checkout:", error?.message);
      return NextResponse.json({ error: "We couldn't start your payment. Please try again." }, { status: 500 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = c.items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "gbp",
        unit_amount: toPence(i.unitPrice),
        product_data: {
          name: (i.variant ? `${i.name} (${i.variant})` : i.name).slice(0, 250),
          ...(i.imagePath ? { images: [productImageUrl(i.imagePath)] } : {}),
        },
      },
    }));
    if (c.shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: { currency: "gbp", unit_amount: toPence(c.shipping), product_data: { name: `Delivery: ${c.shippingMethod.name}`.slice(0, 250) } },
      });
    }

    const origin = req.nextUrl.origin;
    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        line_items: lineItems,
        customer_email: c.customer.email,
        client_reference_id: checkout.id,
        metadata: { kind: "order", checkout_id: checkout.id },
        payment_intent_data: { description: "Import with Goody order", metadata: { kind: "order", checkout_id: checkout.id } },
        success_url: `${origin}/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?payment=cancelled`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        locale: "en-GB",
      },
      { idempotencyKey: `checkout-${checkout.id}` }
    );

    await supabase.from("checkouts").update({ stripe_session_id: session.id }).eq("id", checkout.id);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout:", err);
    return NextResponse.json({ error: "We couldn't start your payment. Please try again." }, { status: 500 });
  }
}