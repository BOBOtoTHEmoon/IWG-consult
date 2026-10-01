import type { Metadata } from "next";
import { Figtree, Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  title: "Import with Goody | Beautiful things, sourced with care",
  description:
    "Homeware, fashion, baby essentials and gifts, hand-picked from trusted makers in China and delivered in the UK and beyond. Custom sourcing on request.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fredoka.variable} ${figtree.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}