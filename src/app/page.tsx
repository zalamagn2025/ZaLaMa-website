import { HeroSection } from "@/components/sections/Home/Hero";
import FonctionnementZalama from "@/components/sections/Home/FonctionnementZalama.client";
import { Connect } from "@/components/sections/Home/CTA";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { FooterSection } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FAQSection } from "@/components/sections/Home/FAQS";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <BackgroundEffects />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FonctionnementZalama />
        <FAQSection />
        <Connect />
      </main>
      <FooterSection />
    </div>
  );
}
