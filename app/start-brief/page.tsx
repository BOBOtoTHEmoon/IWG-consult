import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BriefForm from "@/components/BriefForm";

export const metadata = {
  title: "Start a Brief — IWG Consult",
};

export default function StartBriefPage() {
  return (
    <>
      <Navbar />
      <main>
        <BriefForm />
      </main>
      <Footer />
    </>
  );
}