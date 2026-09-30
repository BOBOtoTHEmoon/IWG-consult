import { ImageIcon } from "./Icons";

// Tinted stand-in used until real product photos are uploaded through the admin.
export default function PhotoPlaceholder({
  tint,
  label,
  className = "",
}: {
  tint: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 text-[#7a5f49] ${className}`}
      style={{ background: tint }}
    >
      <ImageIcon size={26} />
      {label && <span className="text-[11px] uppercase tracking-[0.1em]">{label}</span>}
    </div>
  );
}
