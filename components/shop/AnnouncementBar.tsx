export default function AnnouncementBar() {
  return (
    <div className="bg-brown text-cream text-xs sm:text-[13px]">
      <div className="mx-auto flex h-9 sm:h-10 max-w-[1440px] items-center justify-center gap-6 px-4">
        <span>UK and international delivery with Royal Mail</span>
        <span className="hidden text-gold sm:inline" aria-hidden="true">·</span>
        <span className="hidden sm:inline">Pay securely with PayPal</span>
        <span className="hidden text-gold lg:inline" aria-hidden="true">·</span>
        <span className="hidden lg:inline">Custom sourcing from China on request</span>
      </div>
    </div>
  );
}
