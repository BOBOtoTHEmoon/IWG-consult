import Image from "next/image";
import PhotoPlaceholder from "./PhotoPlaceholder";

// A product photo, or the tinted placeholder when the product has no photo yet.
// next/image serves a resized WebP from Vercel's cache instead of the full photo from Supabase.
export default function ProductImage({
  src,
  alt,
  tint,
  className = "",
  imgClassName = "",
  label,
  eager = false,
  sizes = "(min-width: 1024px) 33vw, 50vw",
}: {
  src?: string;
  alt: string;
  tint: string;
  className?: string;
  imgClassName?: string;
  label?: string;
  eager?: boolean;
  /** How wide the photo shows on screen, so phones get small files. */
  sizes?: string;
}) {
  if (!src) return <PhotoPlaceholder tint={tint} label={label} className={className} />;
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: tint }}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={eager} className={`object-cover ${imgClassName}`} />
    </div>
  );
}
