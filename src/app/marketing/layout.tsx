import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Marketing & Publicité - ZaLaMa",
  description: "Découvrez la plateforme marketing ZaLaMa : ciblage intelligent, analyses en temps réel, visibilité locale forte. Espace publicitaire intégré pour entreprises locales et internationales.",
  keywords: "marketing, publicité, ciblage, visibilité, plateforme publicitaire, ZaLaMa, Guinée, entreprises",
  openGraph: {
    title: "Marketing & Publicité - ZaLaMa",
    description: "Plateforme publicitaire innovante pour connecter les entreprises à une audience qualifiée et engagée.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 