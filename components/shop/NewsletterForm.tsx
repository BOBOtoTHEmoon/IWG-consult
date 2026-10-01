"use client";

import { useState } from "react";
import { CheckIcon } from "../Icons";

export default function NewsletterForm({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const company = (new FormData(e.currentTarget).get("company") as string) || "";
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, company }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="flex items-center gap-2.5 rounded-full bg-jade-soft px-5 py-3.5 text-[15px] font-semibold text-jade">
        <CheckIcon size={18} />
        You&apos;re on the list. We&apos;ll email you when new stock lands.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="h-[52px] rounded-full border-[1.5px] border-line-strong bg-white px-[18px] text-base sm:w-[340px]"
        />
        {/* Hidden from people; catches bots that fill in every field */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-[52px] shrink-0 rounded-full bg-clay px-[26px] font-semibold text-white transition-[background-color,transform] hover:bg-clay-dark active:scale-[0.98] disabled:opacity-60"
        >
          {status === "sending" ? "Signing up..." : "Sign up"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm font-semibold text-clay-dark">{error}</p>
      )}
    </form>
  );
}