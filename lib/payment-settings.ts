import "server-only";
import { toPaymentMethods, type PaymentMethod } from "@/lib/payment-methods";
import { createAdminClient } from "@/lib/supabase/admin";

// How the £50 sourcing fee can be paid. Staff set this on the admin sourcing page.
export async function getSourcingPaymentMethods(): Promise<PaymentMethod[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("site_settings").select("sourcing_payment_methods").eq("id", 1).maybeSingle();
  if (error) console.error("getSourcingPaymentMethods:", error.message);
  return toPaymentMethods(data?.sourcing_payment_methods);
}