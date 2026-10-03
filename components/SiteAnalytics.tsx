"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Cookie-free visitor stats and page speed from Vercel.
// Admin, login and checkout visits are left out so the numbers only reflect shoppers browsing.
const PRIVATE = ["/admin", "/login", "/set-password", "/auth"];

export default function SiteAnalytics() {
  return (
    <>
      <Analytics
        beforeSend={(event) => {
          const path = new URL(event.url).pathname;
          return PRIVATE.some((p) => path.startsWith(p)) ? null : event;
        }}
      />
      <SpeedInsights />
    </>
  );
}