import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { SOURCING_COLUMNS, toSourcingRequest, type SourcingRequest, type SourcingRow } from "@/lib/sourcing-types";

const BUCKET = "sourcing-uploads";

// ---------- Staff (admin pages): uses the signed-in staff member's access ----------

export async function getSourcingRequests(): Promise<SourcingRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sourcing_requests")
    .select(SOURCING_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) {
    console.error("getSourcingRequests:", error.message);
    return [];
  }
  return (data as unknown as SourcingRow[]).map((r) => toSourcingRequest(r));
}

export async function getSourcingRequestByNumber(number: string): Promise<SourcingRequest | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sourcing_requests").select(SOURCING_COLUMNS).eq("number", number).maybeSingle();
  if (error) console.error("getSourcingRequestByNumber:", error.message);
  if (!data) return null;
  const row = data as unknown as SourcingRow;

  // Short-lived links (1 hour) to the customer's private photos.
  const paths = (row.sourcing_items ?? []).map((i) => i.image_path).filter((p): p is string => Boolean(p));
  const urls: Record<string, string> = {};
  if (paths.length) {
    const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 3600);
    signed?.forEach((s) => s.path && s.signedUrl && (urls[s.path] = s.signedUrl));
  }
  return toSourcingRequest(row, urls);
}

export async function getNewSourcingCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase.from("sourcing_requests").select("id", { count: "exact", head: true }).eq("status", "new");
  return count ?? 0;
}

// ---------- Customer's own page: found by the secret link, read on the server ----------

export async function getSourcingRequestByRef(ref: string): Promise<SourcingRequest | null> {
  if (!/^[0-9a-f-]{36}$/i.test(ref)) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("sourcing_requests").select(SOURCING_COLUMNS).eq("public_ref", ref).maybeSingle();
  if (error) console.error("getSourcingRequestByRef:", error.message);
  return data ? toSourcingRequest(data as unknown as SourcingRow) : null;
}