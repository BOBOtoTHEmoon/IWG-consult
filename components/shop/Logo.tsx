import Link from "next/link";

export default function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 text-ink">
      <span
        className={`flex items-center justify-center rounded-full bg-clay font-display font-semibold text-cream ${
          small ? "h-8 w-8 text-lg" : "h-9 w-9 text-xl sm:h-[38px] sm:w-[38px]"
        }`}
      >
        G
      </span>
      <span className={`font-display font-semibold tracking-[-0.01em] ${small ? "text-lg" : "text-xl sm:text-[25px]"}`}>
        Import with Goody
      </span>
    </Link>
  );
}
