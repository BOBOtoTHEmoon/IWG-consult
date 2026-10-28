import AnnouncementBar from "@/components/shop/AnnouncementBar";
import AssistantWidget from "@/components/shop/AssistantWidget";
import Footer from "@/components/shop/Footer";
import Header from "@/components/shop/Header";
import RecentPurchases from "@/components/shop/RecentPurchases";
import { getSiteSettings } from "@/lib/site-content";

// Shop pages refresh at least every minute. Saving in the admin refreshes them straight away.
export const revalidate = 60;

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const announcement = settings.announcementOn ? settings.announcementText.trim() : "";

  return (
    <>
      {announcement && <AnnouncementBar text={announcement} />}
      <Header />
      <main>{children}</main>
      <Footer />
      <AssistantWidget />
      <RecentPurchases />
    </>
  );
}