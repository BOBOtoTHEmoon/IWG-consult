// Business details used across the site.
// Confirm every value marked TODO with Goody before launch.
export const site = {
  name: "Import with Goody",
    // The live address. Set NEXT_PUBLIC_SITE_URL in Vercel if it ever changes.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.importwithgoody.com").replace(/\/$/, ""),
  description:
    "Homeware, fashion, baby essentials and gifts, hand-picked from trusted makers in China and delivered in the UK and beyond. Custom sourcing on request.",
  legalName: "Import with Goody", // TODO: registered business or trading name
  address: "[Business address, United Kingdom]", // TODO
  email: "hello@importwithgoody.com", // TODO: the inbox customers should write to
  whatsappDisplay: "[+44 WhatsApp number]", // TODO
  whatsappLink: "", // TODO: e.g. https://wa.me/447000000000 (leave empty to hide)
  instagramLink: "", // TODO: e.g. https://instagram.com/importwithgoody (leave empty to hide)
    linkedinLink: "", // e.g. https://www.linkedin.com/in/... (leave empty to hide)
  replyTime: "within 1 to 2 working days", // TODO
  policiesUpdated: "30 September 2026",
};