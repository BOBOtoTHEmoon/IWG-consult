import { CheckIcon, LockIcon, TruckIcon } from "@/components/Icons";
import Logo from "@/components/shop/Logo";
import { gbp, products } from "@/lib/data";

export const metadata = { title: "Checkout | Import with Goody" };

// Sample basket until basket state exists.
const basket = [
  { product: products[0], variant: "Oat", qty: 1 },
  { product: products[1], variant: "Size 12, sand", qty: 1 },
];

const input = "h-[52px] rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base font-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";
const card = "flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7";

// Delivery rates are set by Goody in the admin (Standard level: flat rate by zone).
const methods = [
  { id: "uk-standard", title: "UK Standard, Royal Mail", note: "[X to Y] working days", price: "£[rate]" },
  { id: "uk-tracked", title: "UK Tracked, Royal Mail", note: "Tracking number sent by email once posted", price: "£[rate]" },
  { id: "intl", title: "International, Royal Mail", note: "Shown when the delivery country is outside the UK", price: "By zone", disabled: true },
];

export default function CheckoutPage() {
  const subtotal = basket.reduce((s, b) => s + b.product.price * b.qty, 0);

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-10 lg:h-[84px] lg:px-20">
          <Logo />
          <ol aria-label="Checkout steps" className="hidden items-center gap-3.5 text-sm font-semibold md:flex">
            <li className="flex items-center gap-2 text-jade">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-jade text-white"><CheckIcon size={14} strokeWidth={3} /></span>
              Basket
            </li>
            <li className="h-px w-10 bg-line-strong" aria-hidden="true" />
            <li className="flex items-center gap-2" aria-current="step">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-cream">2</span>
              Details and delivery
            </li>
            <li className="h-px w-10 bg-line-strong" aria-hidden="true" />
            <li className="flex items-center gap-2 text-subtle">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-[#b3a591] text-xs">3</span>
              Payment
            </li>
          </ol>
          <span className="flex items-center gap-2 text-sm text-muted"><LockIcon size={18} />Secure checkout</span>
        </div>
      </header>

      <form className="mx-auto flex max-w-[1440px] flex-col-reverse items-start gap-8 px-5 pb-20 pt-8 sm:px-10 lg:flex-row lg:gap-12 lg:px-20 lg:pt-12">
        <div className="flex w-full flex-1 flex-col gap-5">
          <h1 className="mb-2 hidden font-display text-[44px] font-medium tracking-[-0.015em] lg:block">Checkout</h1>

          <section className={card}>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold">Contact</h2>
              <a href="#" className="text-sm font-semibold">Have an account? Sign in</a>
            </div>
            <label className={label}>Email address<input type="email" required autoComplete="email" placeholder="you@example.com" className={input} /></label>
            <label className="flex min-h-8 items-center gap-2.5 text-[15px]">
              <input type="checkbox" className="h-[18px] w-[18px] accent-clay" />
              Email me when new stock lands
            </label>
          </section>

          <section className={card}>
            <h2 className="text-xl font-bold">Delivery address</h2>
            <label className={label}>
              Country
              <select autoComplete="country-name" className={input}>
                <option>United Kingdom</option>
                <option>Ireland</option>
                <option>Nigeria</option>
                <option>United States</option>
                <option>Other country</option>
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>First name<input autoComplete="given-name" className={input} /></label>
              <label className={label}>Last name<input autoComplete="family-name" className={input} /></label>
            </div>
            <label className={label}>Address<input autoComplete="address-line1" placeholder="Start typing your address or postcode" className={input} /></label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className={label}>Town or city<input autoComplete="address-level2" className={input} /></label>
              <label className={label}>Postcode<input autoComplete="postal-code" className={input} /></label>
              <label className={label}>Phone<input type="tel" autoComplete="tel" className={input} /></label>
            </div>
          </section>

          <fieldset className={card}>
            <legend className="float-left mb-1 text-xl font-bold">Delivery method</legend>
            {methods.map((m, i) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3.5 rounded-[14px] border-[1.5px] border-line-strong bg-white px-[18px] py-4 has-[:checked]:border-2 has-[:checked]:border-ink ${
                  m.disabled ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                <input type="radio" name="shipping" value={m.id} defaultChecked={i === 0} disabled={m.disabled} className="h-5 w-5 accent-clay" />
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-base font-semibold">{m.title}</span>
                  <span className="text-sm text-muted">{m.note}</span>
                </span>
                <span className="text-base font-semibold">{m.price}</span>
              </label>
            ))}
          </fieldset>

          <section className={card}>
            <h2 className="text-xl font-bold">Payment</h2>
            <p className="text-[15px] leading-relaxed text-muted">
              You will finish paying securely with PayPal. Use your PayPal balance, or pay by debit or credit card
              without an account.
            </p>
            {/* TODO (payments phase): replace with PayPal JS SDK buttons + server-side order create/capture */}
            <button type="submit" className="h-[58px] rounded-full bg-paypal text-[17px] font-bold text-ink">
              Pay with PayPal
            </button>
            <span className="text-center text-[13px] text-subtle">By placing your order you agree to our terms and returns policy.</span>
          </section>
        </div>

        <aside className="flex w-full flex-col gap-5 rounded-3xl border border-line bg-white p-6 sm:p-7 lg:sticky lg:top-8 lg:mt-[72px] lg:w-[460px] lg:shrink-0">
          <h2 className="text-xl font-bold">Order summary</h2>
          {basket.map(({ product, variant, qty }) => (
            <div key={product.slug} className="flex items-center gap-4">
              <span className="relative h-[84px] w-[72px] shrink-0 rounded-xl" style={{ background: product.tint }}>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-cream">{qty}</span>
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[15px] font-semibold">{product.name}</span>
                <span className="text-[13px] text-subtle">{variant}</span>
              </span>
              <span className="text-[15px] font-semibold">{gbp(product.price * qty)}</span>
            </div>
          ))}
          <div className="flex items-end gap-2.5 pt-1.5">
            <label className="flex flex-1 flex-col gap-2 text-sm font-semibold">
              Discount code
              <input className="h-12 rounded-xl border-[1.5px] border-line-strong bg-paper px-3.5 text-[15px] font-normal" />
            </label>
            <button type="button" className="h-12 rounded-xl border-[1.5px] border-ink px-5 text-[15px] font-semibold">Apply</button>
          </div>
          <div className="flex flex-col gap-3 border-t border-[#ece3d5] pt-4 text-[15px]">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{gbp(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Delivery, UK Standard</span><span>£[rate]</span></div>
          </div>
          <div className="flex items-baseline justify-between border-t border-[#ece3d5] pt-4">
            <span className="text-[17px] font-bold">Total</span>
            <span className="font-display text-3xl font-semibold">£[total]</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-[14px] bg-cream px-4 py-3.5 text-sm text-muted">
            <TruckIcon size={18} className="shrink-0 text-jade" />
            Posted from the UK. You will get an email when it ships.
          </div>
        </aside>
      </form>
    </div>
  );
}
