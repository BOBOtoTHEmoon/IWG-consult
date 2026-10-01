"use client";

import { useState } from "react";
import { CheckIcon } from "../Icons";

const input = "h-[52px] rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base font-normal text-ink";
const label = "flex flex-col gap-2 text-sm font-semibold";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: new FormData(e.currentTarget) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-line bg-paper p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-jade text-white">
          <CheckIcon size={22} strokeWidth={2.5} />
        </span>
        <h2 className="font-display text-3xl">Message sent</h2>
        <p className="text-base leading-relaxed text-muted">Thanks for getting in touch. We&apos;ll reply by email soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-3xl border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Name<input name="name" required autoComplete="name" className={input} /></label>
        <label className={label}>Email address<input name="email" type="email" required autoComplete="email" className={input} /></label>
      </div>
      <label className={label}>
        Order number <span className="font-normal text-subtle">(if it&apos;s about an order)</span>
        <input name="order" placeholder="e.g. IWG-1042" className={input} />
      </label>
      <label className={label}>
        Message
        <textarea
          name="message"
          required
          rows={6}
          className="resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-4 py-3 text-base font-normal leading-normal"
        />
      </label>
      {status === "error" && (
        <p role="alert" className="rounded-[14px] bg-[#f6ddd0] p-3.5 text-sm font-semibold text-clay-dark">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="h-[54px] rounded-full bg-clay px-7 text-base font-semibold text-white hover:bg-clay-dark disabled:opacity-60 sm:self-start"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}