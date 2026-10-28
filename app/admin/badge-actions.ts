"use server";

import { revalidatePath } from "next/cache";
import { getStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

// Saves the shop badge switches and refreshes the shop so they show straight away.
export async function saveBadgeSettings(settings: {
  showSoldCounts: boolean;
  soldCountMin: number;
  showRecentPurchases: boolean;
}): Promise<Result> {
  if (!(await getStaff())) return { ok: false, error: "Please sign in again." };
  const min = Math.floor(Number(settings.soldCountMin));
  if (!(min >= 1 && min <= 10000)) return { ok: false, error: "Choose a number of 1 or more." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      show_sold_counts: Boolean(settings.showSoldCounts),
      sold_count_min: min,
      show_recent_purchases: Boolean(settings.showRecentPurchases),
    })
    .eq("id", 1);
  if (error) {
    console.error("saveBadgeSettings:", error.message);
    return { ok: false, error: "We couldn't save that. Please try again." };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}