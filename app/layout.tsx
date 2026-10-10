import type { Metadata, Viewport } from "next";
import { Figtree, Fredoka } from "next/font/google";
import BasketDrawer from "@/components/shop/BasketDrawer";
import BasketProvider from "@/components/shop/BasketProvider";
import SiteAnalytics from "@/components/SiteAnalytics";
import { site } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Import with Goody | Beautiful things, sourced with care",
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Import with Goody",
    "sourcing from China",
    "China sourcing agent UK",
    "procurement service UK",
    "homeware",
    "baby essentials",
    "gifts",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    title: "Import with Goody | Beautiful things, sourced with care",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Import with Goody | Beautiful things, sourced with care",
    description: site.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fredoka.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* Marks that JavaScript is running, so scroll animations can start hidden */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <BasketProvider>
          {children}
          <BasketDrawer />
        </BasketProvider>
         <SiteAnalytics />
      </body>
    </html>
  );
}