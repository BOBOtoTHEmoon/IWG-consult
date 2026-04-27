# IWG Consult — Replica Site

A production-grade rebuild of [iwgconsult.com](https://www.iwgconsult.com) — same business (UK procurement & sourcing consultancy), tighter execution, deployable to Vercel out of the box.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **Motion** (Framer Motion's successor) for entrance + scroll animations
- **Lucide React** for icons
- **Fraunces** + **Geist** + **JetBrains Mono** via `next/font/google`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import to Vercel → it auto-detects Next.js
3. Done. No env vars required.

## What's different from the original

The Framer template at iwgconsult.com had several executional issues we fixed:

- **Real testimonials** — original had "wellness coach" / "blood pressure" quotes left over from the template. Replaced with realistic sourcing client quotes.
- **Animated counters** — original showed `0` as a stat (counter never fired). Ours uses IntersectionObserver to count up on scroll.
- **No duplicated DOM** — Framer exports duplicated each section 3x for breakpoints; ours uses Tailwind responsive classes.
- **Working FAQ accordion** — original showed every FAQ question 3x with no answers visible. Ours has proper expand/collapse with motion.
- **Hero imagery** — original used a generic fitness photo (mismatch with the business). Ours uses logistics + factory imagery.
- **Process steps** — original repeated "Select & Submit" four times. Ours has 4 distinct steps with descriptions and imagery.
- **Editorial typography** — Fraunces (display) + Geist (body) instead of generic Inter.

## Structure

```
app/
  layout.tsx          # fonts, metadata
  page.tsx            # home (composes all sections)
  globals.css         # Tailwind v4 + design tokens
  about/page.tsx
  services/page.tsx
  pricing/page.tsx
components/
  Navbar.tsx          # sticky nav with mobile menu
  Hero.tsx            # editorial split layout, animated entrance
  RoutesMarquee.tsx   # global trade routes ticker
  Stats.tsx           # animated counters on scroll
  Services.tsx        # 4 procurement packages
  Process.tsx         # 4-step journey
  Consultant.tsx      # founder profile (dark section)
  Testimonials.tsx    # client quotes
  FAQ.tsx             # working accordion
  CTA.tsx             # ochre block before footer
  Footer.tsx          # big wordmark + nav
```

## Design tokens

All colors and fonts are CSS variables defined in `globals.css` under `@theme`.
Change the brand color by editing `--color-ochre`. Change the typography via the Google Fonts imports in `layout.tsx`.

## Forms

The contact / "Get Started" buttons all link to the existing JotForm
(`/start-brief`). Swap this URL globally with
find-and-replace if/when a custom form is built.
