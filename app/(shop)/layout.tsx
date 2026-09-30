import AnnouncementBar from "@/components/shop/AnnouncementBar";
import AssistantWidget from "@/components/shop/AssistantWidget";
import Footer from "@/components/shop/Footer";
import Header from "@/components/shop/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <AssistantWidget />
    </>
  );
}
