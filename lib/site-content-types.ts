// Shared homepage content types. Safe to use in both server and client code.
import { categories as categoryList } from "@/lib/data";

export type SiteSettings = {
  heroHeadline: string;
  heroHighlight: string;
  heroIntro: string;
  heroImageMain: string | null; // storage paths in the site-images bucket
  heroImageTop: string | null;
  heroImageBottom: string | null;
  featuredMode: "newest" | "chosen";
  featuredProductId: string | null;
  sourcingHeading: string;
  announcementOn: boolean;
  announcementText: string;
};

export type HomeCategory = {
  slug: string;
  name: string;
  tint: string;
  image: string | null; // storage path
  showOnHome: boolean;
  sortOrder: number;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  heroHeadline: "Beautiful things, sourced with care.",
  heroHighlight: "sourced",
  heroIntro:
    "Homeware, fashion, baby essentials and gifts, hand-picked from trusted makers in China and delivered to your door in the UK and beyond.",
  heroImageMain: null,
  heroImageTop: null,
  heroImageBottom: null,
  featuredMode: "newest",
  featuredProductId: null,
  sourcingHeading: "Can't find it in the shop? Goody will source it for you.",
  announcementOn: false,
  announcementText: "",
};

export const SETTINGS_COLUMNS =
  "hero_headline, hero_highlight, hero_intro, hero_image_main, hero_image_top, hero_image_bottom, featured_mode, featured_product_id, sourcing_heading, announcement_on, announcement_text";

type SettingsRow = {
  hero_headline: string;
  hero_highlight: string;
  hero_intro: string;
  hero_image_main: string | null;
  hero_image_top: string | null;
  hero_image_bottom: string | null;
  featured_mode: "newest" | "chosen";
  featured_product_id: string | null;
  sourcing_heading: string;
  announcement_on: boolean;
  announcement_text: string;
};

export const toSettings = (r: SettingsRow): SiteSettings => ({
  heroHeadline: r.hero_headline,
  heroHighlight: r.hero_highlight,
  heroIntro: r.hero_intro,
  heroImageMain: r.hero_image_main,
  heroImageTop: r.hero_image_top,
  heroImageBottom: r.hero_image_bottom,
  featuredMode: r.featured_mode,
  featuredProductId: r.featured_product_id,
  sourcingHeading: r.sourcing_heading,
  announcementOn: r.announcement_on,
  announcementText: r.announcement_text,
});

export const toSettingsRow = (s: SiteSettings) => ({
  hero_headline: s.heroHeadline,
  hero_highlight: s.heroHighlight,
  hero_intro: s.heroIntro,
  hero_image_main: s.heroImageMain,
  hero_image_top: s.heroImageTop,
  hero_image_bottom: s.heroImageBottom,
  featured_mode: s.featuredMode,
  featured_product_id: s.featuredProductId,
  sourcing_heading: s.sourcingHeading,
  announcement_on: s.announcementOn,
  announcement_text: s.announcementText,
});

// Category names and placeholder colours live in code; pictures, order and visibility in the database.
export function mergeCategories(rows: { slug: string; image: string | null; show_on_home: boolean; sort_order: number }[]): HomeCategory[] {
  return categoryList
    .map((c, i) => {
      const row = rows.find((r) => r.slug === c.slug);
      return {
        slug: c.slug,
        name: c.name,
        tint: c.tint,
        image: row?.image ?? null,
        showOnHome: row?.show_on_home ?? true,
        sortOrder: row?.sort_order ?? i + 1,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export const siteImageUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-images/${path}`;