// The thin strip above the menu. Goody turns it on and writes the message in the homepage editor.
export default function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="bg-brown text-cream">
      <p className="mx-auto flex min-h-9 max-w-[1440px] items-center justify-center px-4 py-2 text-center text-xs font-medium sm:min-h-10 sm:text-[13px]">
        {text}
      </p>
    </div>
  );
}