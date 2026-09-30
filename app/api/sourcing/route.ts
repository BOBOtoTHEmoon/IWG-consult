import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel rejects request bodies over about 4.5 MB, so photos are capped at 4 MB in total.
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

type Item = {
  name: string;
  qty: string;
  description: string;
  link: string;
  photo?: File;
};

function field(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

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
    console.error("Sourcing request: RESEND_API_KEY or BRIEF_RECIPIENT_EMAIL is missing");
    return NextResponse.json({ error: "We couldn't send your request right now. Please try again later." }, { status: 500 });
  }

  try {
    const fd = await req.formData();

    const name = field(fd, "name");
    const email = field(fd, "email");
    const phone = field(fd, "phone");
    const country = field(fd, "country");
    const budget = field(fd, "budget");
    const deadline = field(fd, "deadline");
    const notes = field(fd, "notes");

    if (!name || !email) {
      return NextResponse.json({ error: "Please add your name and email address." }, { status: 400 });
    }

    // Collect items[0][name], items[1][name] ... until there are no more.
    const items: Item[] = [];
    for (let i = 0; i < 50; i++) {
      if (!fd.has(`items[${i}][name]`)) break;
      const itemName = field(fd, `items[${i}][name]`);
      if (!itemName) continue;
      const photo = fd.get(`items[${i}][photo]`);
      items.push({
        name: itemName,
        qty: field(fd, `items[${i}][qty]`) || "1",
        description: field(fd, `items[${i}][description]`),
        link: field(fd, `items[${i}][link]`),
        photo: photo instanceof File && photo.size > 0 ? photo : undefined,
      });
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "Please add at least one item to your list." }, { status: 400 });
    }

    const totalPhotoBytes = items.reduce((sum, it) => sum + (it.photo?.size ?? 0), 0);
    if (totalPhotoBytes > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Your photos add up to more than 4 MB. Remove one or use smaller photos." },
        { status: 413 }
      );
    }

    const attachments: { filename: string; content: Buffer }[] = [];
    for (let i = 0; i < items.length; i++) {
      const photo = items[i].photo;
      if (photo) {
        attachments.push({
          filename: `item-${i + 1}-${photo.name}`,
          content: Buffer.from(await photo.arrayBuffer()),
        });
      }
    }

    const itemRows = items
      .map((it, i) => {
        const safeLink = /^https?:\/\//i.test(it.link) ? escapeHtml(it.link) : "";
        return `
          <div style="border: 1px solid #e0d5c3; border-radius: 10px; padding: 16px; margin: 0 0 12px; background: #fbf8f3;">
            <p style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #1a1814;">
              ${i + 1}. ${escapeHtml(it.name)} <span style="color: #6b5f52; font-weight: 400;">(qty ${escapeHtml(it.qty)})</span>
            </p>
            ${it.description ? `<p style="margin: 6px 0 0; font-size: 14px; line-height: 1.6; color: #4f473d; white-space: pre-wrap;">${escapeHtml(it.description)}</p>` : ""}
            ${safeLink ? `<p style="margin: 8px 0 0; font-size: 13px;"><a href="${safeLink}" style="color: #b8542a;">Reference link</a></p>` : ""}
            ${it.photo ? `<p style="margin: 8px 0 0; font-size: 13px; color: #6b5f52;">Photo attached as item-${i + 1}</p>` : ""}
          </div>`;
      })
      .join("");

    const detailRow = (label: string, value: string) =>
      value
        ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #6b5f52; font-size: 13px;">${label}</td><td style="padding: 8px 0; border-bottom: 1px solid #ebe3d5; color: #1a1814; font-size: 14px; text-align: right;">${escapeHtml(value)}</td></tr>`
        : "";

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; background: #f5f0e8; padding: 24px;">
        <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e0d5c3;">
          <p style="font-size: 12px; color: #b8542a; font-weight: 600; margin: 0 0 8px;">New sourcing request</p>
          <h1 style="font-size: 26px; color: #1a1814; margin: 0 0 4px; font-weight: 600;">${escapeHtml(name)}</h1>
          <p style="color: #6b5f52; font-size: 14px; margin: 0 0 24px;">
            ${escapeHtml(email)}${phone ? ` | ${escapeHtml(phone)}` : ""}
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
            ${detailRow("Deliver to", country)}
            ${detailRow("Budget for products", budget ? `£${budget}` : "")}
            ${detailRow("Needed by", deadline)}
            ${detailRow("Items", String(items.length))}
          </table>

          <h2 style="font-size: 17px; color: #1a1814; margin: 0 0 12px;">Their list</h2>
          ${itemRows}

          ${notes ? `<h2 style="font-size: 17px; color: #1a1814; margin: 24px 0 8px;">Notes</h2><p style="color: #4f473d; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(notes)}</p>` : ""}

          <p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e0d5c3; font-size: 12px; color: #6b5f52;">
            Reply to this email to respond to ${escapeHtml(name)} directly.
          </p>
        </div>
      </div>`;

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New sourcing request: ${items.length} ${items.length === 1 ? "item" : "items"} from ${name}`,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json({ error: "We couldn't send your request. Please try again." }, { status: 500 });
    }

    // Confirmation to the customer. A failure here should not fail the request.
    try {
      await resend.emails.send({
        from,
        to: email,
        replyTo: to,
        subject: "We've received your sourcing request",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1814;">
            <h1 style="font-size: 22px; margin: 0 0 12px;">Thanks, ${escapeHtml(name.split(" ")[0])}</h1>
            <p style="font-size: 15px; line-height: 1.6; color: #4f473d;">
              Goody has your list of ${items.length} ${items.length === 1 ? "item" : "items"} and will come back to you with suppliers and the full product cost within 2 to 4 working days.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #4f473d;">
              Your £50 commitment fee is refunded when you go ahead with the purchase. If you have anything to add, just reply to this email.
            </p>
            <p style="font-size: 15px; margin-top: 24px;">Import with Goody</p>
          </div>`,
      });
    } catch (confirmErr) {
      console.error("Confirmation email failed:", confirmErr);
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (err) {
    console.error("Sourcing request error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}