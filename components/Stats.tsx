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
    <div ref={ref} className="border-t border-[var(--color-ink)]/15 pt-8">
      <div className="flex items-baseline gap-1">
       <span className="number-display text-6xl lg:text-8xl tracking-[-0.04em] text-[var(--color-ochre)]">
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </span>
      </div>
      <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)]">
        {label}
      </p>
      <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] max-w-[28ch]">
        {caption}
      </p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
        <div className="lg:col-span-12 text-center max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-5">
            Why IWG
          </p>
          <h2 className="text-4xl lg:text-6xl leading-[1] tracking-[-0.025em]">
            Seven years.{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              Over £100k
            </span>{" "}
            in orders managed.
          </h2>
          <p className="text-[var(--color-ink-soft)] text-base leading-relaxed mt-8 max-w-xl mx-auto">
            Most sourcing agents disappear after the deposit clears. We don't.
            Every brief gets one consultant, one channel, one schedule — from
            first quote to final delivery.
          </p>
        </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          <Stat
            target={500}
            suffix="+"
            label="Orders managed"
            caption="Successful sourcing & delivery briefs completed since 2018."
          />
          <Stat
            target={7}
            suffix="+"
            label="Years experience"
            caption="In supply chain, factory verification, and freight logistics."
          />
          <Stat
            target={200}
            suffix="+"
            label="Verified factories"
            caption="An audited network across China, Vietnam, Turkey, and India."
          />
          <Stat
            target={98}
            suffix="%"
            label="Client return rate"
            caption="Customers who return for a second or third sourcing brief."
          />
        </div>
      </div>
    </section>
  );
}
