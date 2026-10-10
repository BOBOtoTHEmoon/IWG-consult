import Link from "next/link";
import SubscriberList from "@/components/admin/SubscriberList";
import { ChevronLeftIcon } from "@/components/Icons";
import { getSubscribers } from "@/lib/subscribers";

export default async function AdminSubscribers() {
  const subscribers = await getSubscribers();
  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <Link href="/admin/more" className="-ml-2 flex h-10 items-center gap-1 self-start rounded-full pr-3 text-sm font-semibold text-ink lg:hidden">
        <ChevronLeftIcon size={20} />
        More
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Email sign-ups</h1>
        <span className="text-sm text-subtle">
          {subscribers.length} {subscribers.length === 1 ? "person wants" : "people want"} to hear about new arrivals.
        </span>
      </div>
      <SubscriberList subscribers={subscribers} />
    </main>
  );
}