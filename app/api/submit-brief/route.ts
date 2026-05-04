import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(key);
}

const PACKAGE_NAMES: Record<string, string> = {
  business: "Sourcing for Business",
  home: "Home, Décor & Appliances",
  baby: "Expecting Mum",
  souvenirs: "Souvenirs & Co",
  wardrobe: "Wardrobe Package",
  unsure: "Not sure yet",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const fullName = (formData.get("fullName") as string) || "";
    const email = (formData.get("email") as string) || "";
    const phone = (formData.get("phone") as string) || "—";
    const company = (formData.get("company") as string) || "—";
    const packageId = (formData.get("packageId") as string) || "";
    const productDescription =
      (formData.get("productDescription") as string) || "";
    const quantity = (formData.get("quantity") as string) || "—";
    const budget = (formData.get("budget") as string) || "—";
    const timeline = (formData.get("timeline") as string) || "—";
    const deliveryCountry =
      (formData.get("deliveryCountry") as string) || "—";
    const notes = (formData.get("notes") as string) || "—";

    const packageName = PACKAGE_NAMES[packageId] || packageId || "Not selected";

    // Convert files to attachments
    const files = formData.getAll("files") as File[];
    const attachments = await Promise.all(
      files
        .filter((f) => f instanceof File && f.size > 0)
        .map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          return {
            filename: file.name,
            content: buffer,
          };
        })
    );

    // HTML email template — branded
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; background: #f5f0e8; padding: 24px;">
        <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #d9cfbf;">
          <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a8579; font-weight: 600; margin: 0 0 8px;">New Sourcing Brief</p>
          <h1 style="font-size: 28px; color: #1a1814; margin: 0 0 4px; font-weight: 600;">${escapeHtml(fullName)}</h1>
          <p style="color: #8a8579; font-size: 14px; margin: 0 0 24px;">${escapeHtml(email)}${phone !== "—" ? ` · ${escapeHtml(phone)}` : ""}${company !== "—" ? ` · ${escapeHtml(company)}` : ""}</p>

          <div style="background: #faf7f1; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #d9cfbf;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #8a8579; margin: 0 0 4px;">Package</p>
            <p style="font-size: 18px; color: #b8542a; font-weight: 600; margin: 0;">${escapeHtml(packageName)}</p>
          </div>

          <h3 style="font-size: 16px; color: #1a1814; margin: 24px 0 8px; font-weight: 600;">What they want to source</h3>
          <p style="color: #2d2924; font-size: 14px; line-height: 1.6; margin: 0 0 20px; white-space: pre-wrap;">${escapeHtml(productDescription)}</p>

          <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #8a8579; font-size: 12px;">Quantity</td><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #1a1814; font-size: 14px; text-align: right;">${escapeHtml(quantity)}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #8a8579; font-size: 12px;">Budget</td><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #1a1814; font-size: 14px; text-align: right;">${escapeHtml(budget)}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #8a8579; font-size: 12px;">Timeline</td><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #1a1814; font-size: 14px; text-align: right;">${escapeHtml(timeline)}</td></tr>
            <tr><td style="padding: 8px 0; color: #8a8579; font-size: 12px;">Delivery to</td><td style="padding: 8px 0; color: #1a1814; font-size: 14px; text-align: right;">${escapeHtml(deliveryCountry)}</td></tr>
          </table>

          ${
            notes !== "—"
              ? `<h3 style="font-size: 16px; color: #1a1814; margin: 24px 0 8px; font-weight: 600;">Additional notes</h3>
                 <p style="color: #2d2924; font-size: 14px; line-height: 1.6; margin: 0 0 20px; white-space: pre-wrap;">${escapeHtml(notes)}</p>`
              : ""
          }

          ${
            attachments.length > 0
              ? `<p style="background: #ebe3d5; padding: 12px; border-radius: 8px; font-size: 13px; color: #2d2924; margin: 20px 0 0;"><strong>${attachments.length} file${attachments.length === 1 ? "" : "s"} attached</strong> — see attachments below.</p>`
              : ""
          }

          <p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #d9cfbf; font-size: 11px; color: #8a8579;">
            Reply directly to this email to respond to ${escapeHtml(fullName)}.
          </p>
        </div>
      </div>
    `;

    // Send via Resend
    const resend = getResend();
    const result = await resend.emails.send({
      from: process.env.BRIEF_FROM_EMAIL || "briefs@importwithgoody.com",
      to: process.env.BRIEF_RECIPIENT_EMAIL || "",
      replyTo: email,
      subject: `New brief: ${packageName} — ${fullName}`,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (err) {
    console.error("Submit brief error:", err);
    return NextResponse.json(
      { error: "Server error", message: (err as Error).message },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}