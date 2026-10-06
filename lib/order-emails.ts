import "server-only";
import { gbp } from "@/lib/data";
import { emailButton, emailLayout, escapeHtml, sendEmail, staffInbox } from "@/lib/email";
import { royalMailTrackingUrl, type Order } from "@/lib/order-types";
import { site } from "@/lib/site";

const firstName = (o: Order) => o.customerName.trim().split(/\s+/)[0] || "there";

function itemsTable(o: Order) {
  const rows = o.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ece3d5;width:64px;vertical-align:top;">
          ${i.imageUrl ? `<img src="${i.imageUrl}" alt="" width="56" height="56" style="width:56px;height:56px;object-fit:cover;border-radius:10px;display:block;" />` : ""}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #ece3d5;font-size:15px;vertical-align:top;">
          <strong>${escapeHtml(i.name)}</strong>
          ${i.variant ? `<br /><span style="color:#8a7f70;font-size:13px;">${escapeHtml(i.variant)}</span>` : ""}
          <br /><span style="color:#8a7f70;font-size:13px;">Qty ${i.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #ece3d5;font-size:15px;text-align:right;vertical-align:top;white-space:nowrap;">
          ${gbp(i.unitPrice * i.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const line = (label: string, value: string, bold = false) => `
      <tr>
        <td colspan="2" style="padding:6px 0;font-size:15px;${bold ? "font-weight:bold;" : "color:#4f473d;"}">${label}</td>
        <td style="padding:6px 0;font-size:15px;text-align:right;${bold ? "font-weight:bold;" : ""}">${value}</td>
      </tr>`;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 4px;">
      ${rows}
      ${line("Subtotal", gbp(o.subtotal))}
      ${line(escapeHtml(o.shippingMethod), o.shippingPrice === 0 ? "Free" : gbp(o.shippingPrice))}
      ${line("Total paid", gbp(o.total), true)}
    </table>`;
}

const addressBlock = (o: Order) =>
  `<p style="margin:0;font-size:15px;line-height:1.6;">${o.addressLines.map(escapeHtml).join("<br />")}</p>`;

// ---------- To the customer ----------

export function orderConfirmationEmail(o: Order) {
  return {
    subject: `Thank you for your order #${o.number}`,
    html: emailLayout({
      preview: `We've got your order #${o.number} and we're getting it ready.`,
      body: `
        <h1 style="margin:0 0 8px;font-size:24px;">Thank you, ${escapeHtml(firstName(o))}!</h1>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4f473d;">
          We've got your order <strong>#${o.number}</strong> and we're getting it ready. We'll email you again as soon as it's on its way.
        </p>
        ${itemsTable(o)}
        <h2 style="margin:24px 0 8px;font-size:16px;">Delivering to</h2>
        ${addressBlock(o)}
        <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#4f473d;">
          Any questions? Just reply to this email.
        </p>`,
    }),
  };
}

export function orderShippedEmail(o: Order) {
  const tracking = o.trackingNumber
    ? `
        <p style="margin:0 0 6px;font-size:14px;color:#8a7f70;">Royal Mail tracking number</p>
        <p style="margin:0 0 20px;font-size:18px;font-weight:bold;letter-spacing:0.5px;">${escapeHtml(o.trackingNumber)}</p>
        ${emailButton(royalMailTrackingUrl(o.trackingNumber), "Track your parcel")}`
    : `<p style="margin:0;font-size:15px;line-height:1.6;color:#4f473d;">It's been sent without tracking, so it will simply arrive with your post.</p>`;

  return {
    subject: `Your order #${o.number} is on its way`,
    html: emailLayout({
      preview: `Good news, your order #${o.number} has been posted.`,
      body: `
        <h1 style="margin:0 0 8px;font-size:24px;">It's on its way, ${escapeHtml(firstName(o))}!</h1>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4f473d;">
          Your order <strong>#${o.number}</strong> has been posted with ${escapeHtml(o.shippingMethod)}.
        </p>
        ${tracking}
        <h2 style="margin:28px 0 8px;font-size:16px;">What's in the parcel</h2>
        ${itemsTable(o)}
        <h2 style="margin:24px 0 8px;font-size:16px;">Delivering to</h2>
        ${addressBlock(o)}`,
    }),
  };
}

// ---------- To Goody ----------

export function newOrderAlertEmail(o: Order) {
  const count = o.items.reduce((n, i) => n + i.quantity, 0);
  return {
    subject: `New order #${o.number}: ${gbp(o.total)}`,
    html: emailLayout({
      preview: `${o.customerName} ordered ${count} ${count === 1 ? "item" : "items"}.`,
      body: `
        <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#b8542a;text-transform:uppercase;letter-spacing:1px;">New order</p>
        <h1 style="margin:0 0 4px;font-size:24px;">#${o.number} | ${gbp(o.total)}</h1>
        <p style="margin:0 0 20px;font-size:15px;color:#4f473d;">${escapeHtml(o.customerName)} | ${escapeHtml(o.email)}${o.phone ? ` | ${escapeHtml(o.phone)}` : ""}</p>
        ${itemsTable(o)}
        <h2 style="margin:24px 0 8px;font-size:16px;">Ship to</h2>
        ${addressBlock(o)}
        <p style="margin:28px 0 0;">${emailButton(`${site.url}/admin/orders/${o.number}`, "Open in the admin")}</p>`,
    }),
  };
}

export const sendOrderConfirmation = (o: Order) => sendEmail({ to: o.email, ...orderConfirmationEmail(o) });
export const sendOrderShipped = (o: Order) => sendEmail({ to: o.email, ...orderShippedEmail(o) });
export const sendNewOrderAlert = (o: Order) => {
  const to = staffInbox();
  return to ? sendEmail({ to, replyTo: o.email, ...newOrderAlertEmail(o) }) : Promise.resolve({ ok: false, error: "No staff inbox set." });
};