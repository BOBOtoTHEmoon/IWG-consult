import "server-only";
import { createClient } from "@supabase/supabase-js";

// Full-access database client for trusted server code only (saving sourcing requests, and later
// PayPal orders). It bypasses the database rules, so it must never be imported into browser code.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role key is not set");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}