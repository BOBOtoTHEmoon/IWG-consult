import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";

// One place for sending every email the site sends, with Goody's branding.

export const escapeHtml = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Where new-order and sourcing alerts go (Goody's inbox).
export const staffInbox = () => process.env.BRIEF_RECIPIENT_EMAIL ?? "";

const FROM = () => process.env.ORDER_FROM_EMAIL || `Import with Goody <orders@importwithgoody.com>`;

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendEmail: RESEND_API_KEY is missing");
    return { ok: false, error: "Email isn't set up." };
  }
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: from ?? FROM(),
      to,
      subject,
      html,
      replyTo: replyTo ?? (site.email || undefined),
    });
    if (result.error) {
      console.error("Resend error:", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("sendEmail failed:", err);
    return { ok: false, error: "The email couldn't be sent." };
  }
}

// ---------- Building blocks for branded emails ----------

export const emailButton = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#b8542a;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 28px;border-radius:999px;">${escapeHtml(label)}</a>`;

export function emailLayout({ preview, body }: { preview: string; body: string }) {
  return `<!doctype html>
<html lang="en-GB">
  <body style="margin:0;padding:0;background:#f5f0e8;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</span>
    <div style="background:#f5f0e8;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1a1814;">
      <div style="max-width:560px;margin:0 auto;">
        <div style="padding:0 4px 20px;">
          <img src="${site.url}/logo.png" alt="Import with Goody" height="44" style="height:44px;width:auto;display:block;" />
        </div>
        <div style="background:#ffffff;border-radius:20px;padding:28px;">
          ${body}
        </div>
        <p style="margin:20px 4px 0;font-size:12px;line-height:1.6;color:#8a7f70;">
          ${escapeHtml(site.name)} | <a href="${site.url}" style="color:#8a7f70;">${site.url.replace(/^https?:\/\//, "")}</a>
          ${site.email ? ` | <a href="mailto:${site.email}" style="color:#8a7f70;">${escapeHtml(site.email)}</a>` : ""}
        </p>
      </div>
    </div>
  </body>
</html>`;
}