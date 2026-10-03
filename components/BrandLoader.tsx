// Goody's G mark, gently breathing, shown while a page loads.
export default function BrandLoader({ label = "Loading", className = "" }: { label?: string; className?: string }) {
  return (
    <div role="status" className={`loader-wrap flex flex-col items-center justify-center gap-5 ${className}`}>
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span aria-hidden="true" className="loader-ring absolute inset-0 rounded-full border-2 border-clay/40" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/apple-touch-icon.png" alt="" width={72} height={72} className="loader-mark relative h-[72px] w-[72px] object-contain" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}