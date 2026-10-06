"use server";

import { revalidatePath } from "next/cache";
import { getStaff } from "@/lib/auth";
import { sendOrderConfirmation, sendOrderShipped } from "@/lib/order-emails";
import { getOrderById } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; message: string } | { ok: false; error: string };

// Marks an order as shipped and emails the customer, with tracking if there is any.
export async function markShipped(orderId: string, tracking: string, notify: boolean): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: "Please sign in again." };
  const supabase = await createClient();
  const code = tracking.trim().toUpperCase() || null;
  const { error } = await supabase
    .from("orders")
    .update({ status: "shipped", shipped_at: new Date().toISOString(), tracking_number: code })
    .eq("id", orderId);
  if (error) return { ok: false, error: "We couldn't save that. Please try again." };

  revalidatePath("/admin", "layout");
  if (!notify) return { ok: true, message: code ? `Marked as shipped with tracking ${code}.` : "Marked as shipped." };

  const order = await getOrderById(orderId);
  const sent = order ? await sendOrderShipped(order) : { ok: false };
  return sent.ok
    ? { ok: true, message: `Marked as shipped and the customer has been emailed${code ? " their tracking number" : ""}.` }
    : { ok: true, message: "Marked as shipped, but the email to the customer didn't send. You can contact them directly." };
}

// Sends the order confirmation email again (e.g. if the customer can't find it).
export async function resendConfirmation(orderId: string): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: "Please sign in again." };
  const order = await getOrderById(orderId);
  if (!order) return { ok: false, error: "We couldn't find that order." };
  const sent = await sendOrderConfirmation(order);
  return sent.ok ? { ok: true, message: `Order confirmation sent to ${order.email}.` } : { ok: false, error: "The email didn't send. Please try again." };
}