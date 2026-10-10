import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Staff = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  role: "owner" | "staff";
};

// The signed-in admin user, or null. Cached so the layout and page share one lookup per request.
export const getStaff = cache(async (): Promise<Staff | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  // Only people with a staff profile can use the admin.
  if (!profile) return null;

  const fullName = profile.full_name?.trim() || user.email?.split("@")[0] || "there";
  return {
    id: user.id,
    email: user.email ?? "",
    fullName,
    firstName: fullName.split(" ")[0],
    role: profile.role === "owner" ? "owner" : "staff",
  };
});