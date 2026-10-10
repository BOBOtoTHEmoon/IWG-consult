import { NextRequest, NextResponse } from "next/server";
import { resolveCheckout } from "@/lib/checkout-server";
import { createPayPalOrder } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Step 1: check the basket on the server, save it, and open a PayPal payment for the exact total.
export async function POST(req: NextRequest) {
  try {
    const result = await resolveCheckout(await req.json().catch(() => ({})));
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    const c = result.checkout;

    const supabase = createAdminClient();
    const { data: checkout, error } = await supabase
      .from("checkouts")
      .insert({ data: c, subtotal: c.subtotal, shipping_price: c.shipping, total: c.total })
      .select("id")
      .single();
    if (error || !checkout) {
      console.error("Saving checkout:", error?.message);
      return NextResponse.json({ error: "We couldn't start your payment. Please try again." }, { status: 500 });
    }

    const paypalOrderId = await createPayPalOrder({
      reference: checkout.id,
      description: "Import with Goody order",
      items: c.items.map((i) => ({
        name: i.variant ? `${i.name} (${i.variant})` : i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        sku: i.slug,
      })),
      itemTotal: c.subtotal,
      shipping: c.shipping,
      total: c.total,
      physical: true,
    });

    await supabase.from("checkouts").update({ paypal_order_id: paypalOrderId }).eq("id", checkout.id);
    return NextResponse.json({ id: paypalOrderId });
  } catch (err) {
    console.error("Checkout create:", err);
    return NextResponse.json({ error: "We couldn't start your payment. Please try again." }, { status: 500 });
  }
}