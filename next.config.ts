import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product photos are resized, converted to WebP and cached by Vercel, so visitors and
  // Facebook/Instagram fetch them from Vercel instead of downloading them from Supabase every time.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
    formats: ["image/webp"],
    // Uploaded photos get a new file name, so a cached copy never goes out of date.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  // Old site addresses, so existing links and Google results land on the right new pages.
  async redirects() {
    return [
      { source: "/services", destination: "/sourcing", permanent: true },
      { source: "/pricing", destination: "/sourcing#pricing", permanent: true },
      { source: "/start-brief", destination: "/sourcing/request", permanent: true },
    ];
  },
};

export default nextConfig;