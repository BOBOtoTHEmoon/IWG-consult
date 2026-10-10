import "server-only";
import { gbp } from "@/lib/data";
import { emailButton, emailLayout, escapeHtml, sendEmail, staffInbox } from "@/lib/email";
import { site } from "@/lib/site";
import { serviceCharge, whatsappLink, whatsappMessage, type SourcingRequest } from "@/lib/sourcing-types";

const FROM = () => process.env.BRIEF_FROM_EMAIL ? `Import with Goody <${process.env.BRIEF_FROM_EMAIL}>` : undefined;
const firstName = (r: SourcingRequest) => r.name.trim().split(/\s+/)[0] || "there";

function itemsList(r: SourcingRequest) {
  return r.items
    .map((i, n) => {
      const link = i.link && /^https?:\/\//i.test(i.link) ? `<br /><a href="${escapeHtml(i.link)}" style="color:#b8542a;font-size:13px;">Reference link</a>` : "";
      return `
        <div style="border:1px solid #ece3d5;border-radius:12px;padding:14px;margin:0 0 10px;background:#fbf8f3;">
          <strong style="font-size:15px;">${n + 1}. ${escapeHtml(i.name)}</strong> <span style="color:#8a7f70;font-size:14px;">(x${i.quantity})</span>
          ${i.description ? `<p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:#4f473d;white-space:pre-wrap;">${escapeHtml(i.description)}</p>` : ""}
          ${i.imagePath ? `<p style="margin:6px 0 0;font-size:13px;color:#8a7f70;">Photo included</p>` : ""}
          ${link}
        </div>`;
    })
    .join("");
}

const customerPage = (r: SourcingRequest) => `${site.url}/sourcing/r/${r.publicRef}`;

// After the £50 is paid: confirmation to the customer.
export function sourcingPaidCustomerEmail(r: SourcingRequest) {
  const wa = site.whatsappNumber ? whatsappLink(site.whatsappNumber, whatsappMessage(r)) : "";
  return {
    subject: `Your sourcing request ${r.number} is confirmed`,
    html: emailLayout({
      preview: `We've received your £50 fee. Goody will be in touch within 2 to 4 working days.`,
      body: `
        <h1 style="margin:0 0 8px;font-size:24px;">You're all set, ${escapeHtml(firstName(r))}!</h1>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4f473d;">
          We've received your £50 commitment fee for request <strong>${r.number}</strong>. Goody will come back to you with
          suppliers and the full product cost within 2 to 4 working days.
        </p>
        ${wa ? `<p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#4f473d;">To share more details or photos, message Goody on WhatsApp:</p><p style="margin:0 0 24px;">${emailButton(wa, "Message Goody on WhatsApp")}</p>` : ""}
        <h2 style="margin:8px 0 10px;font-size:16px;">Your list</h2>
        ${itemsList(r)}
        <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#4f473d;">
          Your £50 is refunded when you go ahead with the purchase. You can see your request any time
          <a href="${customerPage(r)}" style="color:#b8542a;">here</a>, or just reply to this email.
        </p>`,
    }),
  };
}

// After the £50 is paid: alert to Goody.
export function sourcingPaidStaffEmail(r: SourcingRequest) {
  const detail = (label: string, value: string | null) =>
    value ? `<tr><td style="padding:6px 0;color:#8a7f70;font-size:14px;">${label}</td><td style="padding:6px 0;font-size:14px;text-align:right;">${escapeHtml(value)}</td></tr>` : "";
  return {
    subject: `New paid sourcing request ${r.number} from ${r.name}`,
    html: emailLayout({
      preview: `${r.items.length} ${r.items.length === 1 ? "item" : "items"}, £50 fee paid.`,
      body: `
        <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#b8542a;text-transform:uppercase;letter-spacing:1px;">New sourcing request, £50 paid</p>
        <h1 style="margin:0 0 4px;font-size:24px;">${escapeHtml(r.name)}</h1>
        <p style="margin:0 0 16px;font-size:15px;color:#4f473d;">${escapeHtml(r.email)}${r.phone ? ` | ${escapeHtml(r.phone)}` : ""}</p>
        <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 16px;">
          ${detail("Request", r.number)}
          ${detail("Deliver to", r.country)}
          ${detail("Budget for products", r.budget ? `£${r.budget}` : null)}
          ${detail("Needed by", r.deadline)}
        </table>
        ${itemsList(r)}
        ${r.notes ? `<h2 style="margin:16px 0 6px;font-size:16px;">Notes</h2><p style="margin:0;font-size:14px;line-height:1.6;color:#4f473d;white-space:pre-wrap;">${escapeHtml(r.notes)}</p>` : ""}
        <p style="margin:24px 0 0;">${emailButton(`${site.url}/admin/sourcing/${r.number}`, "Open in the admin")}</p>`,
    }),
  };
}

// Goody's quote to the customer.
export function sourcingQuoteEmail(r: SourcingRequest) {
  const cost = r.quoteProductCost ?? 0;
  const charge = serviceCharge(cost);
  const shipping = r.quoteShipping;
  const total = cost + charge + (shipping ?? 0);
  const row = (label: string, value: string, bold = false) =>
    `<tr><td style="padding:8px 0;font-size:15px;border-bottom:1px solid #ece3d5;${bold ? "font-weight:bold;" : "color:#4f473d;"}">${label}</td><td style="padding:8px 0;font-size:15px;text-align:right;border-bottom:1px solid #ece3d5;${bold ? "font-weight:bold;" : ""}">${value}</td></tr>`;
  const wa = site.whatsappNumber ? whatsappLink(site.whatsappNumber, `Hi Goody, I'd like to go ahead with my sourcing quote for ${r.number}.`) : "";

  return {
    subject: `Your sourcing quote for ${r.number}`,
    html: emailLayout({
      preview: `Your quote is ready: ${gbp(total)} in total.`,
      body: `
        <h1 style="margin:0 0 8px;font-size:24px;">Your quote is ready, ${escapeHtml(firstName(r))}</h1>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4f473d;">
          Goody has sourced your list for request <strong>${r.number}</strong>. Here's the full cost.
        </p>
        <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 8px;">
          ${row("Products from China", gbp(cost))}
          ${row("Service charge (10%)", gbp(charge))}
          ${row("Shipping", shipping == null ? "Confirmed separately" : shipping === 0 ? "Included" : gbp(shipping))}
          ${row("Total to go ahead", gbp(total), true)}
          ${row("Your £50 fee", `<span style="color:#2f5d50;font-weight:bold;">Refunded when you go ahead</span>`)}
        </table>
        ${r.quoteNotes ? `<h2 style="margin:20px 0 6px;font-size:16px;">A note from Goody</h2><p style="margin:0;font-size:15px;line-height:1.6;color:#4f473d;white-space:pre-wrap;">${escapeHtml(r.quoteNotes)}</p>` : ""}
        <p style="margin:24px 0 8px;font-size:15px;line-height:1.6;color:#4f473d;">To go ahead or ask a question, reply to this email${wa ? " or message Goody on WhatsApp" : ""}.</p>
        ${wa ? `<p style="margin:0;">${emailButton(wa, "Go ahead on WhatsApp")}</p>` : ""}`,
    }),
  };
}

export async function sendSourcingPaidEmails(r: SourcingRequest) {
  const from = FROM();
  const customer = sendEmail({ to: r.email, from, ...sourcingPaidCustomerEmail(r) });
  const inbox = staffInbox();
  const staff = inbox ? sendEmail({ to: inbox, from, replyTo: r.email, ...sourcingPaidStaffEmail(r) }) : Promise.resolve({ ok: false });
  const [c, s] = await Promise.all([customer, staff]);
  return { customer: c.ok, staff: s.ok };
}

export const sendSourcingQuote = (r: SourcingRequest) => sendEmail({ to: r.email, from: FROM(), ...sourcingQuoteEmail(r) });