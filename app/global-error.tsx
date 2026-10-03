"use client";

// Last-resort page if the whole site fails to load. It can't use the site's styles, so it's kept simple.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5f0e8", color: "#1a1814" }}>
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 36, marginBottom: 16 }}>Something went wrong</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#4f473d", marginBottom: 28 }}>
            Sorry, the site didn&apos;t load properly. Please try again in a moment.
          </p>
          <button
            onClick={reset}
            style={{ height: 52, padding: "0 26px", borderRadius: 999, border: "none", background: "#b8542a", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}