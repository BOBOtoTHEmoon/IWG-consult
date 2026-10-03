import Link from "next/link";
import SourcingForm from "@/components/shop/SourcingForm";
import { ChevronLeftIcon } from "@/components/Icons";

export const metadata = {
  title: "Start a sourcing request | Import with Goody",
  description: "Send Goody your list of products to source from China. £50 to start, refunded when you go ahead.",
  alternates: { canonical: "/sourcing/request" },
};

export default function SourcingRequestPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-4 sm:px-10 lg:px-20 lg:pt-8">
      <Link href="/sourcing" className="-ml-2 mb-4 flex h-10 w-fit items-center gap-1 rounded-full pr-3 text-sm font-semibold text-ink">
        <ChevronLeftIcon size={20} />
        How sourcing works
      </Link>
      <SourcingForm />
    </div>
  );
}