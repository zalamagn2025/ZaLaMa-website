import { FooterSection } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AboutHeroCarousel } from '@/components/sections/About/AboutHeroCarousel';
import TeamSection from '@/components/sections/Team/TeamSection';
// import TeamSection from '@/components/sections/Team/TeamSection';
import { BackgroundEffects } from '@/components/ui/background-effects';
import React from 'react';
import { debug, info, warn, error } from '@/lib/logger';

export default function AboutPage() {
  return (
    <div className="min-h-screen ">
      <BackgroundEffects />
      <Header />
      <main className="pt-8 pb-16">
        <AboutHeroCarousel />
        <TeamSection />
      </main>
      <FooterSection />
    </div>
  );
}