import Link from "next/link";
import { ChevronLeftIcon, SparkleIcon } from "@/components/Icons";
import { getAskedQuestions } from "@/lib/assistant-questions";

export const dynamic = "force-dynamic";

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" }).format(new Date(iso));

export default async function AdminAssistant() {
  const questions = await getAskedQuestions(30);
  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <Link href="/admin/more" className="-ml-2 flex h-10 items-center gap-1 self-start rounded-full pr-3 text-sm font-semibold text-ink lg:hidden">
        <ChevronLeftIcon size={20} />
        More
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">AI assistant</h1>
        <p className="text-[15px] text-muted">What shoppers asked Ask Goody in the last 30 days, most asked first.</p>
      </div>

      <section className="flex flex-col gap-2 rounded-[20px] bg-brown p-5 text-cream sm:p-6">
        <div className="flex items-center gap-2.5">
          <SparkleIcon className="text-gold" />
          <h2 className="text-[17px] font-bold">How it knows the answers</h2>
        </div>
        <p className="text-[15px] leading-relaxed text-[#e8d9c6]">
          The assistant reads your live products, your delivery options and prices, and the About, Sourcing, Delivery,
          Returns, FAQs, Contact and Terms pages. Change any of those and its answers follow within about 10 minutes. If a
          question keeps coming up that it can&apos;t answer, add the answer to your FAQs.
        </p>
      </section>

      {questions.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-paper p-10 text-center">
          <p className="text-lg font-semibold">No questions yet</p>
          <p className="mt-1 text-sm text-muted">Questions shoppers ask the assistant will appear here.</p>
        </div>
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-paper">
          {questions.map((q) => (
            <li key={q.question} className="flex items-start gap-3 border-b border-[#ece3d5] px-4 py-3.5 last:border-b-0">
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[15px]">{q.question}</span>
                <span className="text-[13px] text-subtle">Last asked {when(q.lastAsked)}</span>
              </span>
              {q.count > 1 && (
                <span className="shrink-0 rounded-full bg-[#f1e6c8] px-2.5 py-1 text-xs font-bold text-[#6e5316]">{q.count} times</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}