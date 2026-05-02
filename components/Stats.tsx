"use client";

import { useEffect, useRef, useState } from "react";

function useCounter(target: number, duration = 2200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(target * eased));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function Stat({
  prefix = "",
  target,
  suffix = "",
  label,
  caption,
}: {
  prefix?: string;
  target: number;
  suffix?: string;
  label: string;
  caption: string;
}) {
  const { value, ref } = useCounter(target);
  return (
    <div
  ref={ref}
  className="border-t border-[var(--color-ink)]/15 pt-5 lg:pt-8 text-center lg:text-left"
>
      <div className="flex items-baseline justify-center lg:justify-start gap-1">
        <span className="number-display text-4xl sm:text-5xl lg:text-8xl tracking-[-0.04em] text-[var(--color-ochre)]">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <p className="mt-2 lg:mt-3 text-[10px] lg:text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)]">
        {label}
      </p>
      <p className="mt-1 lg:mt-1.5 text-[12px] lg:text-sm text-[var(--color-ink-soft)] leading-snug max-w-[28ch]">
        {caption}
      </p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-14 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="lg:col-span-12 text-center max-w-3xl mx-auto mb-10 lg:mb-16">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-4">
            Why IWG
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl leading-[1.05] tracking-[-0.025em]">
           In Seven years.{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              Over £100k
            </span>{" "}
            orders within our management.
          </h2>
          <p className="text-[var(--color-ink-soft)] text-sm lg:text-base leading-relaxed mt-5 lg:mt-8 max-w-xl mx-auto">
            Your trusted procurement partner.
            We handle everything from China so you don't have to.
          </p>
        </div>

        {/* 2x2 on mobile, 4x1 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-7 lg:gap-6">
          <Stat
            target={500}
            suffix="+"
            label="Orders managed"
            caption="Successful briefs since 2018."
          />
          <Stat
            target={7}
            suffix="+"
            label="Years experience"
            caption="In supply chain & freight."
          />
          <Stat
            target={200}
            suffix="+"
            label="Verified factories"
            caption="Audited supplier network."
          />
          <Stat
            target={98}
            suffix="%"
            label="Client return rate"
            caption="Customers ordering again."
          />
        </div>
      </div>
    </section>
  );
}