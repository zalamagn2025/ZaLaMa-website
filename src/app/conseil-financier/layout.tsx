import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conseil financier - ZaLaMa",
  description: "Découvrez le service de conseil financier ZaLaMa : accompagnement personnalisé par IA, gestion des dépenses, planification budgétaire. Service gratuit et disponible 24/7.",
  keywords: "conseil financier, IA, gestion finances, budget, épargne, investissement, ZaLaMa, Guinée",
  openGraph: {
    title: "Conseil financier - ZaLaMa",
    description: "Accompagnement personnalisé par IA pour optimiser vos finances, gérer vos dépenses et planifier votre avenir financier.",
    type: "website",
  },
};

export default function ConseilFinancierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 