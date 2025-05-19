import { BackgroundEffects } from '@/components/ui/background-effects';
import { FooterSection } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { HeroDemo } from '@/components/sections/Partenariat/HeroSection';
import FeaturesSection from '@/components/sections/Partenariat/FeaturesSection';

export default function PartenariatPage() {


  return (
    <div className="flex flex-col min-h-screen relative">
      <BackgroundEffects />
      <Header />
      <main className="flex-1">
        <HeroDemo />
        <FeaturesSection />
      </main>
      <FooterSection />
    </div>
  );
}
