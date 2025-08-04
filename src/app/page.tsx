import { Metadata } from 'next';
import { HeroSection } from "@/components/sections/Home/Hero";
import FonctionnementZalama from "@/components/sections/Home/FonctionnementZalama.client";
import { Connect } from "@/components/sections/Home/CTA";
import { BackgroundEffects } from "@/components/ui/background-effects";
import { FooterSection } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FAQSection } from "@/components/sections/Home/FAQS";
import { generateMetadata } from '@/lib/metadata';
import { SEOProvider } from "@/components/SEO/SEOProvider";
import { generateOrganizationSchema } from "@/lib/structured-data";
import { FAQStructuredData } from "@/components/SEO/FAQStructuredData";

export const metadata: Metadata = generateMetadata('home');

export default function Home() {
  return (
    <SEOProvider 
      structuredData={generateOrganizationSchema()}
      canonicalUrl="https://www.zalamagn.com"
    >
      <div className="flex flex-col min-h-screen relative">
        <BackgroundEffects />
        <Header />
        <main className="flex-1">
          <HeroSection />
          <FonctionnementZalama />
          <FAQStructuredData />
          <FAQSection />
          <Connect />
        </main>
        <FooterSection />
      </div>
    </SEOProvider>
  );
}
