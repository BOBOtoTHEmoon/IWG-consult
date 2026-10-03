"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, SendIcon, SparkleIcon } from "../Icons";

type Msg = { role: "assistant" | "user"; text: string };

const starter: Msg[] = [
  {
    role: "assistant",
    text: "Hi! I'm Goody's shopping assistant. Ask me about a product, delivery, returns or our sourcing service.",
  },
];

const chips = ["Delivery times", "Returns", "Custom sourcing"];

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(starter);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    // TODO (AI step): send the conversation to the assistant and stream the reply.
    setMessages((m) => [
      ...m,
      { role: "user", text: t },
      {
        role: "assistant",
        text: "Thanks for your question! I'm still being set up. For now, our FAQs and contact page have the answers.",
      },
    ]);
    setDraft("");
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-5 z-30 flex h-14 items-center gap-2.5 rounded-full bg-ink px-[18px] text-[15px] font-semibold text-cream shadow-[0_14px_34px_rgba(26,24,20,0.28)] sm:right-10 sm:pr-[22px]"
          aria-label="Ask Goody, shopping assistant"
        >
          <SparkleIcon className="text-gold" />
          <span className="hidden sm:inline">Ask Goody</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Ask Goody shopping assistant"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-cream sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[calc(100vh-48px)] sm:w-[400px] sm:rounded-3xl sm:border sm:border-line sm:shadow-[0_24px_60px_rgba(26,24,20,0.25)]"
        >
          <div className="flex h-[72px] shrink-0 items-center gap-3 bg-ink pl-[18px] pr-3 text-cream">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brown">
              <SparkleIcon className="text-gold" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="font-display text-[19px]">Ask Goody</span>
              <span className="text-xs text-[#c9bfb0]">Shopping assistant</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink-soft"
            >
              <CloseIcon />
            </button>
          </div>

          <div ref={listRef} className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "max-w-[80%] self-end rounded-[18px_18px_6px_18px] bg-clay px-4 py-3 text-[15px] leading-normal text-white"
                    : "max-w-[85%] self-start rounded-[18px_18px_18px_6px] border border-line bg-paper px-4 py-3 text-[15px] leading-normal"
                }
              >
                {m.text}
              </div>
            ))}
            {messages.length > 1 && (
              <div className="flex gap-2 self-start text-sm">
                <Link href="/faqs" onClick={() => setOpen(false)} className="rounded-full border-[1.5px] border-line-strong px-3.5 py-2 font-semibold text-ink">
                  Read the FAQs
                </Link>
                <Link href="/contact" onClick={() => setOpen(false)} className="rounded-full border-[1.5px] border-line-strong px-3.5 py-2 font-semibold text-ink">
                  Contact us
                </Link>
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-2.5">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="h-10 shrink-0 rounded-full border-[1.5px] border-line-strong px-3.5 text-[13px] font-medium hover:border-ink"
              >
                {c}
              </button>
            ))}
          </div>
          <form
            className="flex items-end gap-2.5 border-t border-line bg-paper px-4 pb-6 pt-2.5 sm:pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <label className="flex flex-1 flex-col gap-1.5 text-xs font-semibold text-muted">
              Message
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about a product or delivery"
                className="h-12 rounded-full border-[1.5px] border-line-strong bg-white px-4 text-base font-normal text-ink"
              />
            </label>
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-white hover:bg-clay-dark"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}