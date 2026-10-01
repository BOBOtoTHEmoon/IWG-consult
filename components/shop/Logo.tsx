import Image from "next/image";
import Link from "next/link";

export default function Logo({ small = false, light = false }: { small?: boolean; light?: boolean }) {
  return (
    <Link href="/" className="flex items-center" aria-label="Import with Goody, home">
      <Image
        src="/logo.png"
        alt="Import with Goody"
        width={200}
        height={60}
        priority={!light}
        unoptimized
        className={`w-auto ${small ? "h-8" : "h-9 sm:h-11"}`}
      />
    </Link>
  );
}