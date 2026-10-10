import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { stockLines, type ResolvedCheckout } from "@/lib/checkout-server";
import { emailLayout, escapeHtml, sendEmail, staffInbox } from "@/lib/email";
import { sendNewOrderAlert, sendOrderConfirmation } from "@/lib/order-emails";
import { getOrderAdmin } from "@/lib/orders";
import { capturePayPalOrder } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Step 2, after the customer approves in PayPal:
// hold the stock, take the payment, then create the order and send the emails.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const paypalOrderId = typeof body.paypalOrderId === "string" ? body.paypalOrderId.slice(0, 64) : "";
  if (!paypalOrderId) return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });

  const supabase = createAdminClient();
  const { data: checkout } = await supabase
    .from("checkouts")
    .select("id, status, data, subtotal, shipping_price, total, order_id")
    .eq("paypal_order_id", paypalOrderId)
    .maybeSingle();
  if (!checkout) return NextResponse.json({ error: "We couldn't find this payment. Please try again." }, { status: 404 });

  // Already done (e.g. the customer pressed twice): just show their order.
  if (checkout.status === "completed" && checkout.order_id) {
    const existing = await getOrderAdmin({ id: checkout.order_id });
    return NextResponse.json({ ref: existing?.publicRef });
  }

  const c = checkout.data as ResolvedCheckout;
  const lines = stockLines(c.items);

  // 1. Hold the stock first, so nobody pays for something that's gone.
  const { error: holdError } = await supabase.rpc("adjust_stock", { p_items: lines, p_direction: -1 });
  if (holdError) {
    const name = holdError.message.split(":").slice(1).join(":").trim();
    return NextResponse.json(
      { error: name ? `Sorry, ${name} has just sold out. You haven't been charged.` : "Something in your basket has just sold out. You haven't been charged." },
      { status: 409 }
    );
  }

  // 2. Take the payment.
  const payment = await capturePayPalOrder(paypalOrderId);
  if (!payment.ok) {
    await supabase.rpc("adjust_stock", { p_items: lines, p_direction: 1 }); // give the stock back
    return NextResponse.json({ error: payment.message, declined: payment.declined }, { status: payment.declined ? 422 : 502 });
  }

  // 3. Create the order. The payment has gone through now, so if anything fails, tell Goody straight away.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: `${c.customer.firstName} ${c.customer.lastName}`,
      email: c.customer.email,
      phone: c.customer.phone || null,
      address_line1: c.customer.address1,
      address_line2: c.customer.address2 || null,
      city: c.customer.city,
      postcode: c.customer.postcode || null,
      country: c.customer.countryName,
      shipping_method: c.shippingMethod.name,
      shipping_price: c.shipping,
      subtotal: c.subtotal,
      total: c.total,
      paypal_order_id: paypalOrderId,
      paypal_capture_id: payment.captureId,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Order insert after payment:", orderError?.message);
    await supabase.from("checkouts").update({ status: "failed" }).eq("id", checkout.id);
    const inbox = staffInbox();
    if (inbox) {
      await sendEmail({
        to: inbox,
        subject: "Action needed: a payment came in but the order didn't save",
        html: emailLayout({
          preview: "Please check PayPal and contact the customer.",
          body: `<h1 style="margin:0 0 8px;font-size:22px;">A payment needs checking</h1>
            <p style="font-size:15px;line-height:1.6;">A customer paid, but the website couldn't save their order. Please check PayPal and contact them.</p>
            <p style="font-size:15px;line-height:1.6;">Customer: ${escapeHtml(c.customer.firstName)} ${escapeHtml(c.customer.lastName)} (${escapeHtml(c.customer.email)})<br />
            PayPal transaction: ${escapeHtml(payment.captureId)}<br />Total: £${c.total.toFixed(2)}</p>`,
        }),
      });
    }
    return NextResponse.json(
      { error: "Your payment went through, but we had trouble saving your order. Goody has been notified and will email you shortly." },
      { status: 500 }
    );
  }

  await supabase.from("order_items").insert(
    c.items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_slug: i.slug,
      name: i.name,
      variant: i.variant ? `${i.variantLabel ?? "Option"}: ${i.variant}` : null,
      image_path: i.imagePath,
      quantity: i.quantity,
      unit_price: i.unitPrice,
    }))
  );
  await supabase.from("checkouts").update({ status: "completed", order_id: order.id }).eq("id", checkout.id);

  if (Math.abs(payment.amount - c.total) > 0.01) {
    console.error(`Amount mismatch on ${paypalOrderId}: paid ${payment.amount}, expected ${c.total}`);
  }

  if (c.newsletter) {
    await supabase.from("newsletter_subscribers").insert({ email: c.customer.email, source: "checkout" }); // duplicates are ignored
  }

  // 4. Emails, and refresh the shop so stock counts are up to date.
  const saved = await getOrderAdmin({ id: order.id });
  if (saved) await Promise.all([sendOrderConfirmation(saved), sendNewOrderAlert(saved)]);
  revalidatePath("/", "layout");

  return NextResponse.json({ ref: saved?.publicRef });
}