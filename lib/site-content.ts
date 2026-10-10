import { createPublicClient } from "@/lib/supabase/public";
import {
  DEFAULT_SETTINGS,
  SETTINGS_COLUMNS,
  mergeCategories,
  toSettings,
  type HomeCategory,
  type SiteSettings,
} from "@/lib/site-content-types";

// Falls back to the defaults if the database can't be reached, so the homepage never breaks.
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("site_settings").select(SETTINGS_COLUMNS).eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) console.error("getSiteSettings:", error.message);
    return DEFAULT_SETTINGS;
  }
  return toSettings(data);
}

export async function getCategories(): Promise<HomeCategory[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("categories").select("slug, image, show_on_home, sort_order");
  if (error) console.error("getCategories:", error.message);
  return mergeCategories(data ?? []);
}