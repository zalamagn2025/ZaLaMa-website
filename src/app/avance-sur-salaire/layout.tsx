import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Avance sur salaire - ZaLaMa",
  description: "Découvrez le service d'avance sur salaire ZaLaMa : accès rapide à 25% de votre salaire, traitement en moins de 10 minutes, frais transparents de 6,5%. Solution financière innovante pour les employés.",
  keywords: "avance sur salaire, prêt salarié, finance, ZaLaMa, Guinée, mobile money",
  openGraph: {
    title: "Avance sur salaire - ZaLaMa",
    description: "Accédez rapidement à 25% de votre salaire avant la date de paie officielle. Traitement en moins de 10 minutes, frais transparents de 6,5%.",
    type: "website",
  },
};

export default function AvanceSurSalaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 