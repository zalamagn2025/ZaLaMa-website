import { BackgroundEffects } from '@/components/ui/background-effects';
import { FooterSection } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PartnershipForm } from '@/components/sections/Partenariat/PartnershipForm';

export default function FormulairePage() {
  return (
    <div className="relative flex flex-col min-h-screen text-[var(--zalama-text)]">
      <BackgroundEffects />
      <Header />
      <main className="flex-1">
        {/* Formulaire de partenariat - Centré et avec espacement */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <BackgroundEffects />
            <PartnershipForm />
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}