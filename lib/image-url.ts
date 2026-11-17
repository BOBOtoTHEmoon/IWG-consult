// Sends a Supabase photo through Vercel's image cache at a set width.
// Use it anywhere a plain URL is needed (small <img> tags, emails, link previews).
// Widths must be ones Next.js allows: 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920.
export function imageUrl(src: string | null | undefined, width: number, quality = 75): string | undefined {
  if (!src) return undefined;
  if (!/^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}
