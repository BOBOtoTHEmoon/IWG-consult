type P = { className?: string; size?: number; strokeWidth?: number };

const base = (size = 20, strokeWidth = 1.75) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const SearchIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
export const UserIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
);
export const BagIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M5 8h14l-1 13H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);
export const MenuIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h10" /></svg>
);
export const CloseIcon = ({ className, size, strokeWidth = 2 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
);
export const ArrowRightIcon = ({ className, size, strokeWidth = 2 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);
export const ChevronLeftIcon = ({ className, size, strokeWidth = 2 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M15 6l-6 6 6 6" /></svg>
);
export const CheckIcon = ({ className, size, strokeWidth = 2 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M5 12l4 4 10-10" /></svg>
);
export const TruckIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M3 6h11v10H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
);
export const ShieldIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></svg>
);
export const GlobeIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z" /></svg>
);
export const SparkleIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg>
);
export const ImageIcon = ({ className, size, strokeWidth = 1.5 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 17l-5-5-9 8" /></svg>
);
export const CameraIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
export const HeartIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
);
export const PlusIcon = ({ className, size, strokeWidth = 2 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M12 5v14" /><path d="M5 12h14" /></svg>
);
export const MinusIcon = ({ className, size, strokeWidth = 2 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M5 12h14" /></svg>
);
export const SendIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M4 12l16-8-6 16-3-7z" /></svg>
);
export const LockIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const InfoIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16.5v.01" /></svg>
);
export const CheckboxIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" /></svg>
);
export const RouteIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" /></svg>
);
export const PinIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const GridIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
export const BoxIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>
);
export const PenIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4z" /><path d="M13.5 6.5l4 4" /></svg>
);
export const ListIcon = ({ className, size, strokeWidth }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" /><path d="M4.5 6h.01" /><path d="M4.5 12h.01" /><path d="M4.5 18h.01" /></svg>
);
export const ExternalIcon = ({ className, size, strokeWidth = 2 }: P) => (
  <svg {...base(size, strokeWidth)} className={className}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
);
