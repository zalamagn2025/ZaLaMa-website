import React from 'react';
import Contact from '@/components/sections/Contact/Contact';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

// Named function component with display name
function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header /> 
      <Contact />
      <Footer />
    </main>
  );
}

// Set display name
// ContactPage.displayName = 'ContactPage';

// Export the named component
export default ContactPage;