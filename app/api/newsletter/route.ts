import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export const runtime = "nodejs";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const source = String(body.source ?? "homepage").slice(0, 40);

    // Hidden field that people never fill in. Bots usually do.
    if (body.company) return NextResponse.json({ ok: true });

    if (!EMAIL.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = createPublicClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email, source });

    // 23505 means they're already signed up. Treat that as success.
    if (error && error.code !== "23505") {
      console.error("Newsletter sign-up:", error.message);
      return NextResponse.json({ error: "We couldn't sign you up just now. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter sign-up:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}