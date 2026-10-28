import "server-only";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { stockLines, type ResolvedCheckout } from "@/lib/checkout-server";
import { emailLayout, escapeHtml, sendEmail, staffInbox } from "@/lib/email";
import { sendNewOrderAlert, sendOrderConfirmation } from "@/lib/order-emails";
import { getOrderAdmin } from "@/lib/orders";
import { getSourcingRequestByRef } from "@/lib/sourcing";
import { markSourcingFeePaid } from "@/lib/sourcing-payments";
import { getStripe, paymentIntentId, toPence } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export type OrderResult =
  | { status: "done"; ref: string | null }
  | { status: "pending" } // still being confirmed; check again shortly
  | { status: "failed"; message: string };

const NOT_SAVED =
  "Your payment went through, but we had trouble saving your order. Goody has been notified and will email you shortly.";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const refFor = async (orderId: string) => (await getOrderAdmin({ id: orderId }))?.publicRef ?? null;

async function emailStaff(subject: string, preview: string, body: string) {
  const inbox = staffInbox();
  if (inbox) await sendEmail({ to: inbox, subject, html: emailLayout({ preview, body }) });
}

// Turns a paid Stripe Checkout Session into an order: takes the stock, saves the order and sends the emails.
// The webhook and the customer's return page can both call this, even at the same moment.
// Only one of them creates the order; the other waits and returns the same order.
export async function finalizeStripeOrder(session: Stripe.Checkout.Session): Promise<OrderResult> {
  const checkoutId = session.metadata?.checkout_id;
  if (session.metadata?.kind !== "order" || !checkoutId) return { status: "failed", message: "This payment isn't linked to an order." };
  if (session.payment_status !== "paid") return { status: "pending" };

  const supabase = createAdminClient();
  const { data: checkout } = await supabase.from("checkouts").select("id, status, data, order_id").eq("id", checkoutId).maybeSingle();
  if (!checkout) return { status: "failed", message: "We couldn't find this payment. Please contact us." };
  if (checkout.order_id) return { status: "done", ref: await refFor(checkout.order_id) };
  if (checkout.status === "failed") return { status: "failed", message: NOT_SAVED };

  // Claim this checkout so only one request turns it into an order. A claim older than 2 minutes is treated as abandoned.
  const staleBefore = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const { data: claimed } = await supabase
    .from("checkouts")
    .update({ finalizing_at: new Date().toISOString() })
    .eq("id", checkout.id)
    .is("order_id", null)
    .or(`finalizing_at.is.null,finalizing_at.lt."${staleBefore}"`)
    .select("id");
  if (!claimed || claimed.length === 0) {
    for (let i = 0; i < 6; i++) {
      await wait(1000);
      const { data: now } = await supabase.from("checkouts").select("status, order_id").eq("id", checkout.id).maybeSingle();
      if (now?.order_id) return { status: "done", ref: await refFor(now.order_id) };
      if (now?.status === "failed") return { status: "failed", message: NOT_SAVED };
    }
    return { status: "pending" };
  }

  const c = checkout.data as ResolvedCheckout;
  const lines = stockLines(c.items);
  const paymentId = paymentIntentId(session);
  const who = `${escapeHtml(c.customer.firstName)} ${escapeHtml(c.customer.lastName)} (${escapeHtml(c.customer.email)})`;

  // 1. Take the stock. The customer has already paid, so if something has just sold out, refund them in full.
  const { error: holdError } = await supabase.rpc("adjust_stock", { p_items: lines, p_direction: -1 });
  if (holdError) {
    const name = holdError.message.split(":").slice(1).join(":").trim() || "something in your basket";
    let refunded = false;
    if (paymentId) {
      try {
        await getStripe().refunds.create({ payment_intent: paymentId }, { idempotencyKey: `soldout-${checkout.id}` });
        refunded = true;
      } catch (err) {
        console.error("Stripe refund after sell-out:", err);
      }
    }
    await supabase.from("checkouts").update({ status: "failed" }).eq("id", checkout.id);
    await emailStaff(
      refunded ? "A card payment was refunded: item sold out" : "Action needed: refund a card payment",
      refunded ? "An item sold out during payment, so the customer was refunded." : "Please refund this customer in Stripe.",
      `<h1 style="margin:0 0 8px;font-size:22px;">${refunded ? "Payment refunded" : "Please refund this payment"}</h1>
        <p style="font-size:15px;line-height:1.6;">${escapeHtml(name)} sold out while the customer was paying by card.
        ${refunded ? "Their payment has been refunded in full automatically." : "The automatic refund didn't work, so please refund them in Stripe."}</p>
        <p style="font-size:15px;line-height:1.6;">Customer: ${who}<br />Stripe payment: ${escapeHtml(paymentId ?? session.id)}<br />Total: £${c.total.toFixed(2)}</p>`
    );
    return {
      status: "failed",
      message: refunded
        ? `Sorry, ${name} sold out while you were paying. Your payment has been refunded in full, and no order was placed.`
        : `Sorry, ${name} sold out while you were paying. Goody has been notified and will refund you in full.`,
    };
  }

  // 2. Create the order. If anything fails now, tell Goody straight away.
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
      payment_provider: "stripe",
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentId,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    // Another request already saved this exact payment: give the stock back and return that order.
    if (orderError?.code === "23505") {
      await supabase.rpc("adjust_stock", { p_items: lines, p_direction: 1 });
      const { data: existing } = await supabase.from("orders").select("id").eq("stripe_session_id", session.id).maybeSingle();
      if (existing) return { status: "done", ref: await refFor(existing.id) };
    }
    console.error("Order insert after Stripe payment:", orderError?.message);
    await supabase.from("checkouts").update({ status: "failed" }).eq("id", checkout.id);
    await emailStaff(
      "Action needed: a payment came in but the order didn't save",
      "Please check Stripe and contact the customer.",
      `<h1 style="margin:0 0 8px;font-size:22px;">A payment needs checking</h1>
        <p style="font-size:15px;line-height:1.6;">A customer paid by card, but the website couldn't save their order. Please check Stripe and contact them.</p>
        <p style="font-size:15px;line-height:1.6;">Customer: ${who}<br />Stripe payment: ${escapeHtml(paymentId ?? session.id)}<br />Total: £${c.total.toFixed(2)}</p>`
    );
    return { status: "failed", message: NOT_SAVED };
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

  if (session.amount_total != null && session.amount_total !== toPence(c.total)) {
    console.error(`Amount mismatch on ${session.id}: paid ${session.amount_total}p, expected ${toPence(c.total)}p`);
  }
  if (c.newsletter) {
    await supabase.from("newsletter_subscribers").insert({ email: c.customer.email, source: "checkout" }); // duplicates are ignored
  }

  // 3. Emails, and refresh the shop so stock counts are up to date.
  const saved = await getOrderAdmin({ id: order.id });
  if (saved) await Promise.all([sendOrderConfirmation(saved), sendNewOrderAlert(saved)]);
  revalidatePath("/", "layout");
  return { status: "done", ref: saved?.publicRef ?? null };
}

// Marks a sourcing request's £50 as paid after a Stripe payment. Safe to call more than once.
export async function finalizeStripeSourcing(session: Stripe.Checkout.Session) {
  if (session.metadata?.kind !== "sourcing" || session.payment_status !== "paid") return false;
  const request = await getSourcingRequestByRef(session.metadata.public_ref ?? "");
  if (!request) return false;
  if (session.amount_total !== toPence(request.feeAmount)) {
    console.error(`Sourcing fee mismatch on ${request.number}: paid ${session.amount_total}p`);
    return false;
  }
  const result = await markSourcingFeePaid(request.id, `Stripe ${paymentIntentId(session) ?? session.id}`);
  return result.ok;
}

// Used by the webhook: works out what the payment was for.
export async function handlePaidSession(session: Stripe.Checkout.Session) {
  if (session.metadata?.kind === "order") return finalizeStripeOrder(session);
  if (session.metadata?.kind === "sourcing") return finalizeStripeSourcing(session);
  return null;
}

// When a customer comes back from paying the sourcing fee, record it straight away
// (the webhook does the same, so whichever arrives first wins).
// Stripe can take a moment to mark a payment as paid, so check a few times before giving up.
export async function confirmSourcingReturn(sessionId: string, publicRef: string): Promise<boolean> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return false;
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.metadata?.public_ref !== publicRef) return false;
      if (session.payment_status === "paid") return finalizeStripeSourcing(session);
      if (session.status !== "complete") return false; // cancelled or never finished
      await wait(1500);
    }
  } catch (err) {
    console.error("confirmSourcingReturn:", err);
  }
  return false;
}