"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { CloseIcon, SendIcon, SparkleIcon } from "../Icons";

type Msg = { role: "assistant" | "user"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi! I'm Goody's shopping assistant. Ask me about a product, delivery, returns or our sourcing service.",
};

const chips = ["What's new in the shop?", "How long does delivery take?", "How does sourcing work?"];

// Turns **bold**, [links](/path) and "- " lists in answers into formatting. Only links on this site are clickable.
function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const inline = (line: string, key: string) =>
    line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      if (bold) return <strong key={`${key}-${i}`}>{bold[1]}</strong>;
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = link[2].replace(/^https?:\/\/(www\.)?importwithgoody\.com/i, "");
        return href.startsWith("/") ? (
          <Link key={`${key}-${i}`} href={href} onClick={onNavigate} className="font-semibold text-clay underline underline-offset-2">
            {link[1]}
          </Link>
        ) : (
          <Fragment key={`${key}-${i}`}>{link[1]}</Fragment>
        );
      }
      return <Fragment key={`${key}-${i}`}>{part}</Fragment>;
    });

  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const item = line.match(/^\s*[-*]\s+(.*)$/);
        if (item) {
          return (
            <span key={i} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{inline(item[1], String(i))}</span>
            </span>
          );
        }
        return line.trim() ? (
          <span key={i} className="block">
            {inline(line, String(i))}
          </span>
        ) : (
          <span key={i} className="block h-2" />
        );
      })}
    </>
  );
}

export default function AssistantWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, thinking]);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || thinking) return;
    setDraft("");
    setThinking(true);

    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The welcome message is only for display, so it isn't sent.
        body: JSON.stringify({ messages: history.slice(1), page: pathname }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Sorry, I couldn't answer just now. Please try again in a moment.");
      }

      // Show the answer as it's written.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
        setThinking(false);
      }
      if (!answer.trim()) throw new Error("Sorry, I couldn't answer just now. Please try again in a moment.");
    } catch (err) {
      setMessages([...history, { role: "assistant", content: (err as Error).message }]);
    } finally {
      setThinking(false);
    }
  }

  const close = () => setOpen(false);

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
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-cream sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:max-h-[calc(100vh-48px)] sm:w-[400px] sm:rounded-3xl sm:border sm:border-line sm:shadow-[0_24px_60px_rgba(26,24,20,0.25)]"
        >
          <div className="flex h-[72px] shrink-0 items-center gap-3 bg-ink pl-[18px] pr-3 text-cream">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brown">
              <SparkleIcon className="text-gold" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="font-display text-[19px]">Ask Goody</span>
              <span className="text-xs text-[#c9bfb0]">Shopping assistant, answers from our website</span>
            </span>
            <button onClick={close} aria-label="Close assistant" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink-soft">
              <CloseIcon />
            </button>
          </div>

          <div ref={listRef} className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="max-w-[80%] self-end whitespace-pre-wrap rounded-[18px_18px_6px_18px] bg-clay px-4 py-3 text-[15px] leading-normal text-white">
                  {m.content}
                </div>
              ) : m.content ? (
                <div key={i} className="flex max-w-[88%] flex-col self-start rounded-[18px_18px_18px_6px] border border-line bg-paper px-4 py-3 text-[15px] leading-normal">
                  <Rich text={m.content} onNavigate={close} />
                </div>
              ) : null
            )}
            {thinking && (
              <div className="flex gap-1.5 self-start rounded-[18px_18px_18px_6px] border border-line bg-paper px-4 py-4" aria-label="Writing an answer">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-subtle motion-reduce:animate-none" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
          </div>

          {messages.length === 1 && (
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
          )}
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
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={800}
                placeholder="Ask about a product or delivery"
                className="h-12 rounded-full border-[1.5px] border-line-strong bg-white px-4 text-base font-normal text-ink"
              />
            </label>
            <button
              type="submit"
              disabled={thinking || !draft.trim()}
              aria-label="Send message"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-clay text-white hover:bg-clay-dark disabled:opacity-50"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </>
  );
}