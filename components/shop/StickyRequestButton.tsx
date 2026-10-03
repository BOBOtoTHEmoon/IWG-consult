"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "../Icons";

// Phones only: a "Start your request" button that stays at the bottom of the screen
// once the visitor has scrolled past the button at the top of the page.
export default function StickyRequestButton({ watchId }: { watchId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`fixed bottom-6 left-5 right-[92px] z-30 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Link
        href="/sourcing/request"
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-clay text-base font-semibold text-white shadow-[0_12px_30px_rgba(184,84,42,0.4)]"
      >
        Start your request <ArrowRightIcon size={18} />
      </Link>
    </div>
  );
}