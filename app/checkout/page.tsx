import { LockIcon } from "@/components/Icons";
import CheckoutView from "@/components/shop/CheckoutView";
import Logo from "@/components/shop/Logo";

export const metadata = { title: "Checkout | Import with Goody", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-10 lg:h-[84px] lg:px-20">
          <Logo />
          <span className="flex items-center gap-2 text-sm text-muted">
            <LockIcon size={18} />
            Secure checkout
          </span>
        </div>
      </header>
      <CheckoutView />
    </div>
  );
}