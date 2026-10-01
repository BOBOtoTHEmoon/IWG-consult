import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The picture shown when the site is shared on WhatsApp, Instagram, X, Facebook and LinkedIn.
export const alt = "Import with Goody. Beautiful things, sourced with care.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Loads the brand font (Fredoka) from Google Fonts. Falls back to the default font if that fails.
async function loadFredoka(): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Fredoka:wght@400")).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [logo, fredoka] = await Promise.all([readFile(join(process.cwd(), "public", "logo.png")), loadFredoka()]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f0e8",
          padding: "64px 80px",
          color: "#1a1814",
          ...(fredoka ? { fontFamily: "Fredoka" } : {}),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={320} height={96} style={{ width: 320, height: 96, objectFit: "contain", objectPosition: "left" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 1.05, letterSpacing: -1 }}>
            <span>Beautiful things,</span>
            <span style={{ display: "flex" }}>
              <span style={{ color: "#b8542a" }}>sourced</span>
              <span>&nbsp;with care.</span>
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#4f473d" }}>
            Homeware, fashion, baby and gifts. Custom sourcing from China.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#5c1d05" }}>
          <div style={{ width: 48, height: 6, background: "#b8542a", borderRadius: 3 }} />
          importwithgoody.com
        </div>
      </div>
    ),
    {
      ...size,
      ...(fredoka ? { fonts: [{ name: "Fredoka", data: fredoka, weight: 400 as const, style: "normal" as const }] } : {}),
    }
  );
}