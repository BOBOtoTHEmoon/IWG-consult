import { createClient } from "@/lib/supabase/server";

export type Subscriber = { id: string; email: string; source: string; createdAt: string };

export async function getSubscribers(): Promise<Subscriber[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getSubscribers:", error.message);
    return [];
  }
  return data.map((r) => ({ id: r.id, email: r.email, source: r.source, createdAt: r.created_at }));
}