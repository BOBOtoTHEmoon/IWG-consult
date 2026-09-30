# Import with Goody, phase 2 (front end)

Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript.
This is the approved redesign turned into real, responsive pages. Everything runs on
sample data in `lib/data.ts`. Supabase, PayPal, Royal Mail rates and the AI assistant
are wired in later phases (look for `TODO` comments).

## Run it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home |
| `/shop` | Shop all, with `?category=homeware` etc. |
| `/product/[slug]` | Product page (gallery, colour, quantity) |
| `/sourcing` | Sourcing services and request form (£50 commitment fee, 10% service charge) |
| `/checkout` | Checkout (Royal Mail options, PayPal) |
| `/admin` | Admin overview |
| `/admin/orders` | Orders, filter by status |
| `/admin/products/new` | Add product (built for phone use) |
| `/admin/sourcing`, `/admin/content`, `/admin/assistant`, `/admin/delivery` | Placeholders for screens still to design |

The Ask Goody assistant floats on every shop page (bottom right).

## Structure

```
app/
  (shop)/          storefront pages share the header, footer and assistant
  checkout/        focused checkout layout
  admin/           admin layout with sidebar (desktop) and tab bar (phone)
components/
  shop/            header, footer, product card, assistant, sourcing form, product gallery and buy box
  admin/           admin navigation
  Icons.tsx        inline SVG icon set
  PhotoPlaceholder.tsx   tinted stand-in until real photos are uploaded
lib/data.ts        sample products, categories and orders
app/globals.css    design tokens (colours and fonts)
```

## Design tokens

Colours live in `app/globals.css` under `@theme` and are used as Tailwind classes,
for example `bg-cream`, `text-clay`, `bg-brown`, `text-jade`, `bg-paypal`.
Fonts: Fraunces (headings, `font-display`) and Figtree (body, `font-sans`), loaded with `next/font`.

## Next phases

1. Supabase: products, categories, orders, sourcing requests, storage for photos, auth for `/admin`.
2. Basket state and PayPal checkout (orders API: create and capture on the server).
3. Sourcing request flow: save request, take £50 via PayPal, email Goody and the customer (Resend).
4. Delivery rates by zone and weight band, editable in the admin.
5. AI assistant API route with product search.
6. Remaining admin screens: sourcing requests, site content, assistant answers, delivery rates.

## Open questions for Goodness

- Is shipping on sourcing orders quoted separately from the 10% service charge?
- Should the £50 be refunded, or deducted from what the customer owes when they go ahead?
- Delivery rates and times for UK Standard, UK Tracked and international zones.
