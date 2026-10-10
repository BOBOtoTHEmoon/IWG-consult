import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_RECIPIENT_EMAIL;
  const from = process.env.BRIEF_FROM_EMAIL || "briefs@importwithgoody.com";

  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or BRIEF_RECIPIENT_EMAIL is missing");
    return NextResponse.json({ error: "We couldn't send your message right now. Please email us instead." }, { status: 500 });
  }

  try {
    const fd = await req.formData();
    const get = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" ? v.trim() : "";
    };
    const name = get("name");
    const email = get("email");
    const order = get("order");
    const message = get("message");

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Please fill in your name, email and message." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Your message is too long. Please shorten it or email us directly." }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New message from ${name}${order ? ` about ${order}` : ""}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1814;">
          <p style="font-size: 12px; color: #b8542a; font-weight: 600; margin: 0 0 8px;">New contact message</p>
          <h1 style="font-size: 22px; margin: 0 0 4px;">${escapeHtml(name)}</h1>
          <p style="font-size: 14px; color: #6b5f52; margin: 0 0 20px;">${escapeHtml(email)}${order ? ` | Order ${escapeHtml(order)}` : ""}</p>
          <p style="font-size: 15px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
          <p style="margin-top: 28px; font-size: 12px; color: #6b5f52;">Reply to this email to answer ${escapeHtml(name)} directly.</p>
        </div>`,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json({ error: "We couldn't send your message. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}