import React from 'react';
import PartnershipSteps from '@/components/sections/Partnership/PartnershipSteps';
import { FooterSection } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
export default function PartnershipPage() {
  return (
    <main className="min-h-screen">
        <Header />
        <PartnershipSteps />
        <FooterSection />
    </main>
  );
}