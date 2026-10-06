"use server";

import { revalidatePath } from "next/cache";
import { getStaff } from "@/lib/auth";
import { getSourcingRequestByNumber } from "@/lib/sourcing";
import { sendSourcingQuote } from "@/lib/sourcing-emails";
import { markSourcingFeePaid } from "@/lib/sourcing-payments";
import type { SourcingStatus } from "@/lib/sourcing-types";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true; message: string } | { ok: false; error: string };

const done = () => revalidatePath("/admin", "layout");

// For payments taken outside PayPal (e.g. bank transfer). Sends the same emails as a PayPal payment.
export async function markFeePaid(requestId: string): Promise<Result> {
  const staff = await getStaff();
  if (!staff) return { ok: false, error: "Please sign in again." };
  const result = await markSourcingFeePaid(requestId, `Marked paid by ${staff.firstName}`);
  done();
  if (!result.ok) return { ok: false, error: result.error };
  if (result.alreadyPaid) return { ok: true, message: "This fee was already marked as paid." };
  return {
    ok: true,
    message: result.emails?.customer
      ? "Marked as paid. The customer has been emailed their confirmation."
      : "Marked as paid, but the confirmation email didn't send. You can contact the customer directly.",
  };
}

// Saves the quote, emails it to the customer, and moves the request to "Quote sent".
export async function sendQuote(
  number: string,
  quote: { productCost: number; shipping: number | null; notes: string }
): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: "Please sign in again." };
  if (!(quote.productCost > 0)) return { ok: false, error: "Add the product cost first." };
  if (quote.shipping != null && quote.shipping < 0) return { ok: false, error: "Shipping can't be below £0." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("sourcing_requests")
    .update({
      quote_product_cost: Math.round(quote.productCost * 100) / 100,
      quote_shipping: quote.shipping == null ? null : Math.round(quote.shipping * 100) / 100,
      quote_notes: quote.notes.trim().slice(0, 3000) || null,
      quote_sent_at: new Date().toISOString(),
      status: "quote_sent",
    })
    .eq("number", number);
  if (error) return { ok: false, error: "We couldn't save the quote. Please try again." };

  const request = await getSourcingRequestByNumber(number);
  const sent = request ? await sendSourcingQuote(request) : { ok: false };
  done();
  return sent.ok
    ? { ok: true, message: `Quote sent to ${request!.email}.` }
    : { ok: true, message: "Quote saved, but the email didn't send. You can share it with the customer directly." };
}

export async function setSourcingStatus(number: string, status: SourcingStatus): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: "Please sign in again." };
  if (!["new", "quote_sent", "going_ahead", "not_proceeding"].includes(status)) return { ok: false, error: "That status isn't allowed." };
  const supabase = await createClient();
  const { error } = await supabase.from("sourcing_requests").update({ status }).eq("number", number);
  done();
  return error ? { ok: false, error: "We couldn't update the request. Please try again." } : { ok: true, message: "Updated." };
}

// After refunding the £50 in PayPal, Goody records it here.
export async function markFeeRefunded(number: string): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: "Please sign in again." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("sourcing_requests")
    .update({ fee_status: "refunded" })
    .eq("number", number)
    .eq("fee_status", "paid");
  done();
  return error ? { ok: false, error: "We couldn't update the fee. Please try again." } : { ok: true, message: "The £50 is marked as refunded." };
}