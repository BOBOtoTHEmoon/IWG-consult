import { createClient } from "@/lib/supabase/server";
import { ORDER_COLUMNS, toOrder, type Order, type OrderRow } from "@/lib/order-types";

// All admin order reads need a signed-in staff member (enforced by the database rules).

export async function getOrders(limit = 200): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getOrders:", error.message);
    return [];
  }
  return (data as unknown as OrderRow[]).map(toOrder);
}

export async function getOrderByNumber(number: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select(ORDER_COLUMNS).eq("number", number).maybeSingle();
  if (error) console.error("getOrderByNumber:", error.message);
  return data ? toOrder(data as unknown as OrderRow) : null;
}

export async function getToPackCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "to_pack");
  return count ?? 0;
}

// Sales and order count since the start of this month (UK time), not counting cancelled orders.
export async function getMonthSales(): Promise<{ total: number; count: number }> {
  const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: "Europe/London" }).format(new Date());
  const monthStart = `${parts}-01T00:00:00Z`;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("total")
    .gte("created_at", monthStart)
    .neq("status", "cancelled");
  if (error) {
    console.error("getMonthSales:", error.message);
    return { total: 0, count: 0 };
  }
  return { total: data.reduce((s, r) => s + Number(r.total), 0), count: data.length };
}