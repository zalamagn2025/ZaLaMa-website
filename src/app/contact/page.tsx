import React from 'react';
import Contact from '@/components/sections/Contact/Contact';
import { FooterSection } from '@/components/layout/Footer';
import { BackgroundEffects } from '@/components/ui/background-effects';
import { Header } from '@/components/layout/Header';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <BackgroundEffects />
      <Header />
      <main className="flex-1">
        <Contact />
      </main>
      <FooterSection />
    </div>
  );
}