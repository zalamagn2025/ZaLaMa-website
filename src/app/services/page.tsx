import { FooterSection } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ServicesSection } from '@/components/sections/Service/ServicesSection';
import { BackgroundEffects } from '@/components/ui/background-effects';
import React from 'react'

export default function ServicePage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <BackgroundEffects />
      <Header />
      <main className="flex-1">
        <ServicesSection />
      </main>
      <FooterSection />
    </div>
  );
}
