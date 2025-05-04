import React from 'react';
import Contact from '@/components/sections/Contact/Contact';

// Named function component with display name
function ContactPage() {
  return (
    <main className="min-h-screen">
      <Contact />
    </main>
  );
}

// Set display name
ContactPage.displayName = 'ContactPage';

// Export the named component
export default ContactPage;