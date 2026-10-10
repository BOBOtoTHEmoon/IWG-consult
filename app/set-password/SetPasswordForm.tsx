"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const input = "h-[52px] w-full rounded-xl border-[1.5px] border-line-strong bg-white px-4 pr-20 text-base";

export default function SetPasswordForm({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");

    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      setError(
        error.message.toLowerCase().includes("different")
          ? "Choose a password you haven't used before."
          : "We couldn't save your password. Please try again."
      );
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
      <Image src="/logo.png" alt="Import with Goody" width={200} height={60} unoptimized priority className="h-12 w-auto" />
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4 rounded-3xl border border-line bg-paper p-6 sm:p-8">
        <div className="flex flex-col gap-1.5 pb-1">
          <h1 className="font-display text-[28px] leading-tight">Hi {firstName}, set your password</h1>
          <p className="text-[15px] text-muted">You&apos;ll use this with your email to sign in to the shop admin.</p>
        </div>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          New password
          <span className="relative">
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-1.5 top-1/2 h-10 -translate-y-1/2 rounded-lg px-3 text-sm font-semibold text-clay"
            >
              {show ? "Hide" : "Show"}
            </button>
          </span>
          <span className="font-normal text-subtle">At least 8 characters.</span>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Type it again
          <input
            type={show ? "text" : "password"}
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={input}
          />
        </label>
        {error && (
          <p role="alert" className="rounded-xl bg-[#f6ddd0] px-3.5 py-2.5 text-sm font-semibold text-clay-dark">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 h-[54px] rounded-full bg-clay text-base font-semibold text-white transition-colors hover:bg-clay-dark disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save password and continue"}
        </button>
      </form>
    </div>
  );
}