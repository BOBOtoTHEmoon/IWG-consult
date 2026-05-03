import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Import with Goody — Global Procurement, Personally Managed",
  description:
    "We source, verify, and ship products from trusted global factories — straight to your door. Over 7 years of supply chain expertise serving 200+ verified manufacturers.",
  openGraph: {
    title: "Import with Goody — Global Procurement, Personally Managed",
    description:
      "Sourcing, verification and logistics handled end-to-end by import experts.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html
      lang="en"
      className={`${inter.variable} ${interDisplay.variable} ${jetbrains.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  )
}