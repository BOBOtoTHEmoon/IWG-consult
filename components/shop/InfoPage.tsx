// Shared layout for long-form pages (delivery, returns, privacy, terms).
export default function InfoPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-10 sm:px-10 lg:px-20 lg:pt-16">
      <div className="mx-auto max-w-[760px]">
        <h1 className="font-display text-[40px] leading-[1.08] tracking-[-0.015em] sm:text-[56px]">{title}</h1>
        {intro && <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">{intro}</p>}
        {updated && <p className="mt-4 text-sm text-subtle">Last updated {updated}</p>}
        <div className="prose-page mt-10 border-t border-line pt-10">{children}</div>
      </div>
    </div>
  );
}