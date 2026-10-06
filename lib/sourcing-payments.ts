import "server-only";
import { sendSourcingPaidEmails } from "@/lib/sourcing-emails";
import { SOURCING_COLUMNS, toSourcingRequest, type SourcingRow } from "@/lib/sourcing-types";
import { createAdminClient } from "@/lib/supabase/admin";

// Marks a request's £50 as paid, moves it to "New" and sends the emails.
// Safe to call twice: only the first call changes anything or sends emails.
// PayPal will call this after a successful payment; staff can also call it for manual payments.
export async function markSourcingFeePaid(requestId: string, reference: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sourcing_requests")
    .update({ fee_status: "paid", fee_paid_at: new Date().toISOString(), fee_reference: reference, status: "new" })
    .eq("id", requestId)
    .eq("fee_status", "unpaid")
    .select(SOURCING_COLUMNS)
    .maybeSingle();

  if (error) {
    console.error("markSourcingFeePaid:", error.message);
    return { ok: false as const, error: "We couldn't record the payment." };
  }
  if (!data) return { ok: true as const, alreadyPaid: true, emails: null };

  const emails = await sendSourcingPaidEmails(toSourcingRequest(data as unknown as SourcingRow));
  return { ok: true as const, alreadyPaid: false, emails };
}