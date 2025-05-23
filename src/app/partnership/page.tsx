import { BackgroundEffects } from '@/components/ui/background-effects';
import { FooterSection } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroDemo } from '@/components/sections/Partenariat/HeroSection';
import FeaturesSection from '@/components/sections/Partenariat/FeaturesSection';
import AdhesionProcess from '@/components/sections/Partenariat/AdhesionProcess';
import { CTA } from '@/components/sections/Partenariat/CTA';

export default function PartenariatPage() {
  return (
    <div className="relative flex flex-col min-h-screen  text-[var(--zalama-text)]">
      <BackgroundEffects />
      <Header />
      <main className="flex-1">
        {/* Hero Section - titre, sous-titre, CTA */}
        <section className="py-16 md:py-24 lg:py-32">
          <HeroDemo />
        </section>
        {/* Avantages Partenariat */}
        <section id="avantages" className="py-10 md:py-16">
          <FeaturesSection />
        </section>
        {/* Processus d'adhésion */}
        <section className="py-10 md:py-16 ">
          <AdhesionProcess />
        </section>
        <section className="">
          <CTA />
        </section>
      </main>
      <FooterSection />
    </div>
  );
}

