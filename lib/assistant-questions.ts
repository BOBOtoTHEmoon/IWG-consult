import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AskedQuestion = { question: string; count: number; lastAsked: string };

// Questions from the last N days, grouped so the same question asked twice shows once with a count.
export async function getAskedQuestions(days: number, limit = 100): Promise<AskedQuestion[]> {
  const supabase = await createClient();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("assistant_questions")
    .select("question, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) {
    console.error("getAskedQuestions:", error.message);
    return [];
  }
  const groups = new Map<string, AskedQuestion>();
  for (const row of data) {
    const key = row.question.trim().toLowerCase().replace(/[?!.\s]+$/g, "");
    const g = groups.get(key);
    if (g) g.count++;
    else groups.set(key, { question: row.question.trim(), count: 1, lastAsked: row.created_at });
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || b.lastAsked.localeCompare(a.lastAsked)).slice(0, limit);
}