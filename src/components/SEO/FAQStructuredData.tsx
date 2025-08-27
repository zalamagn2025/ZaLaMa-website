'use client';

import { createStructuredDataScript, generateFAQSchema } from '@/lib/structured-data';

// Données FAQ pour ZaLaMa (basées sur votre FAQ existant)
const zalamaFAQData = [
  {
    question: "Qui peut utiliser ZaLaMa ?",
    answer: "Les étudiants, les salariés et les pensionnaires affiliés à une entreprise ou minsitère partenaire."
  },
  {
    question: "Quels sont les avantages de ZaLaMa pour un utilisateur ?",
    answer: "Réduction du stress financier en cas d'urgence. Augmentation du pouvoir d'achat sans recourir à l'endettement. Amélioration de la gestion budgétaire personnelle. Réduction des inégalités en matière d'accès au financement, notamment pour les plus modestes. Diminution des risques de surendettement en limitant les prêts informels et usuriers."
  },
  {
    question: "Quel est le montant maximum que je peux demander ?",
    answer: "Avance sur salaire : Jusqu'à 30% de votre revenu mensuel."
  },
  {
    question: "En combien de temps puis-je recevoir l'argent ?",
    answer: "En moins de 10 minutes après validation de votre demande."
  },
  {
    question: "Est-ce que je peux faire plusieurs demandes par mois ?",
    answer: "Oui, tant que le montant total ne dépasse pas votre limite autorisée."
  },
  {
    question: "Puis-je utiliser ZaLaMa sans passer par mon entreprise ?",
    answer: "Non. ZaLaMa fonctionne avec les entreprises partenaires qui valident l'éligibilité des salariés et pensionnaires."
  },
  {
    question: "Quels sont les avantages pour une entreprise d'adhérer à ZaLaMa ?",
    answer: "Renforcement de la relation employeur-employé en valorisant votre politique sociale. Réduction du turnover et fidélisation des talents. Augmentation de la motivation et de la productivité des collaborateurs. Gestion sereine des éventuels retards de paiement sans tensions internes. Élimination des demandes d'avances internes souvent difficiles à gérer."
  },
  {
    question: "Comment l'entreprise est-elle impliquée dans le processus ?",
    answer: "Elle valide l'identité, le statut du salarié, et autorise l'accès aux services."
  },
  {
    question: "Que coûte l'adhésion au service ZaLaMa ?",
    answer: "1 000 000 GNF pour une adhésion unique."
  },
  {
    question: "Est-ce que ZaLaMa interfère avec la gestion de la paie ?",
    answer: "Non. ZaLaMa complète la paie sans la modifier. L'entreprise garde le contrôle total."
  },
  {
    question: "Est-ce que ZaLaMa peut être intégré à notre logiciel RH ?",
    answer: "Oui. Une intégration simple est possible pour faciliter le suivi des demandes."
  }
];

export function FAQStructuredData() {
  const faqSchema = generateFAQSchema(zalamaFAQData);

  return (
    <script {...createStructuredDataScript(faqSchema)} />
  );
} 