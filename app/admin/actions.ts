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

// Refresh the cached shop pages straight after a product changes,
// so shoppers see the update immediately instead of within a minute.
export async function refreshShop(slug?: string) {
  if (!(await getStaff())) return;
  revalidatePath("/");
  revalidatePath("/shop");
  if (slug) revalidatePath(`/product/${slug}`);
  revalidatePath("/admin", "layout");
}