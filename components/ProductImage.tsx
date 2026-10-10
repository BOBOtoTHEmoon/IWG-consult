import PhotoPlaceholder from "./PhotoPlaceholder";

// A product photo, or the tinted placeholder when the product has no photo yet.
export default function ProductImage({
  src,
  alt,
  tint,
  className = "",
  imgClassName = "",
  label,
  eager = false,
}: {
  src?: string;
  alt: string;
  tint: string;
  className?: string;
  imgClassName?: string;
  label?: string;
  eager?: boolean;
}) {
  if (!src) return <PhotoPlaceholder tint={tint} label={label} className={className} />;
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: tint }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}