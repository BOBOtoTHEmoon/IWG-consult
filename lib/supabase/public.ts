import { createClient } from "@supabase/supabase-js";

// Read-only client for public shop pages. No cookies, so pages can be cached.
export function createPublicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
}