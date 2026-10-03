"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown if a page fails to load. The header and basket stay usable around it.
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center gap-5 px-5 py-20 text-center">
      <h1 className="font-display text-[36px] leading-tight sm:text-5xl">Something went wrong</h1>
      <p className="text-lg leading-relaxed text-muted">
        Sorry, this page didn&apos;t load properly. Please try again. If it keeps happening, let us know.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="h-[52px] rounded-full bg-clay px-[26px] font-semibold text-white hover:bg-clay-dark">
          Try again
        </button>
        <Link href="/" className="flex h-[52px] items-center rounded-full border-[1.5px] border-ink px-[26px] font-semibold text-ink">
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}