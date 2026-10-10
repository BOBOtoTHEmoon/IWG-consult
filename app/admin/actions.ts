"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Refresh the cached shop pages straight after a product or the homepage changes,
// so shoppers see the update immediately instead of within a minute.
// The slug argument is accepted for older callers but not needed.
export async function refreshShop(_slug?: string) {
  if (!(await getStaff())) return;
  // Refreshes every page, including the announcement bar in the shop layout.
  revalidatePath("/", "layout");
}