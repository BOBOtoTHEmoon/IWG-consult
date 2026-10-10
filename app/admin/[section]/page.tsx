import Link from "next/link";
import { notFound } from "next/navigation";

const sections: Record<string, { title: string; body: string }> = {
  sourcing: {
    title: "Sourcing requests",
    body: "Review customer lists, see who has paid the £50 commitment fee, send quotes, and mark requests as proceeding or closed.",
  },
  content: { title: "Site content", body: "Edit homepage text, hero images and featured products without touching code." },
  assistant: { title: "AI assistant", body: "See what shoppers ask and add answers the assistant should use." },
  delivery: { title: "Delivery rates", body: "Set Royal Mail rates for UK and international zones, by weight band." },
};

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = sections[section];
  if (!s) notFound();

  return (
    <main className="flex flex-col gap-4 px-4 py-6 sm:px-8 lg:px-12 lg:py-9">
      <h1 className="font-display text-[32px] font-medium sm:text-[40px]">{s.title}</h1>
      <div className="max-w-[640px] rounded-[20px] border border-dashed border-line-strong bg-paper p-8">
        <p className="text-base leading-relaxed text-muted">{s.body}</p>
        <p className="mt-3 text-sm text-subtle">This screen is designed next, then built with the backend.</p>
        <Link href="/admin" className="mt-5 inline-block text-sm font-semibold">Back to overview</Link>
      </div>
    </main>
  );
}
