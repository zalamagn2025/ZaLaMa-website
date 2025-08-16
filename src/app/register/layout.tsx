import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription Employé - ZaLaMa',
  description: 'Inscrivez-vous en tant qu\'employé pour accéder aux services d\'avance sur salaire de ZaLaMa.',
  keywords: 'inscription, employé, avance salaire, ZaLaMa, fintech, Guinée',
  robots: 'noindex, nofollow', // Empêcher l'indexation de cette page
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {children}
    </div>
  );
}
