import SourcingList from "@/components/admin/SourcingList";
import SourcingPaymentSetting from "@/components/admin/SourcingPaymentSetting";
import { getSourcingPaymentMethods } from "@/lib/payment-settings";
import { getSourcingRequests } from "@/lib/sourcing";

export const dynamic = "force-dynamic";

export default async function AdminSourcing() {
  const [requests, paymentMethods] = await Promise.all([getSourcingRequests(), getSourcingPaymentMethods()]);
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Sourcing requests</h1>
        <span className="text-sm text-subtle">Lists customers have sent. New ones have their £50 commitment fee paid.</span>
      </div>
      <SourcingPaymentSetting initial={paymentMethods} />
      <SourcingList requests={requests} />
    </main>
  );
}