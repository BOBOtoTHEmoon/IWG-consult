// A random ID for file names. crypto.randomUUID only exists on secure pages (https or localhost),
// so fall back to getRandomValues, which works everywhere, including testing on a phone over the local network.
export function uniqueId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}