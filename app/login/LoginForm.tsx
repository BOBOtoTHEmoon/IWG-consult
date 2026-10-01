"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const input = "h-[52px] w-full rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base";

const startError: Record<string, string> = {
  "not-staff": "This account doesn't have access to the shop admin.",
  "link-expired": "That link has expired or was already used. Sign in, or ask for a new link below.",
};

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(startError[params.get("error") ?? ""] ?? "");
  const [sent, setSent] = useState(false);

  async function signIn() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      setError(
        error.message.toLowerCase().includes("invalid")
          ? "That email and password don't match. Please try again."
          : "We couldn't sign you in. Please try again."
      );
      return;
    }
    // Only allow redirects back into the admin.
    const next = params.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  async function sendReset() {
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim());
    // Same message whether or not the email exists, so the form can't be used to find staff emails.
    setLoading(false);
    setSent(true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (mode === "signin") await signIn();
    else await sendReset();
  }

  function switchMode(next: "signin" | "reset") {
    setMode(next);
    setError("");
    setSent(false);
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
      <Image src="/logo.png" alt="Import with Goody" width={200} height={60} unoptimized priority className="h-12 w-auto" />
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4 rounded-3xl border border-line bg-paper p-6 sm:p-8">
        <div className="flex flex-col gap-1.5 pb-1">
          <h1 className="font-display text-[28px] leading-tight">{mode === "signin" ? "Welcome back" : "Reset your password"}</h1>
          <p className="text-[15px] text-muted">
            {mode === "signin"
              ? "Sign in to manage the shop."
              : "Enter your email and we'll send you a link to set a new password."}
          </p>
        </div>

        {sent ? (
          <p role="status" className="rounded-xl bg-jade-soft px-3.5 py-3 text-sm font-semibold text-jade">
            If that email belongs to a shop admin account, a reset link is on its way. Check your inbox and spam folder.
          </p>
        ) : (
          <>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Email address
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
              />
            </label>
            {mode === "signin" && (
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Password
                <span className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${input} pr-20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-1.5 top-1/2 h-10 -translate-y-1/2 rounded-lg px-3 text-sm font-semibold text-clay"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </span>
              </label>
            )}
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
              {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Send reset link"}
            </button>
          </>
        )}
      </form>
      <button
        type="button"
        onClick={() => switchMode(mode === "signin" ? "reset" : "signin")}
        className="h-10 px-3 text-sm font-semibold text-clay"
      >
        {mode === "signin" ? "Forgotten your password?" : "Back to sign in"}
      </button>
    </div>
  );
}