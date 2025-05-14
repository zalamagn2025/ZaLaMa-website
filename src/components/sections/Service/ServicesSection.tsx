"use client";

import { motion } from 'framer-motion';
import { HandCoins, PieChart, ShieldCheck, Zap, Clock, Users, Building2, Smartphone as SmartphoneIcon } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ServicesSection() {
  const services = [
    {
      title: "Avances sur salaire",
      description: "Permettre aux employeurs de payer les salaires de leurs employés non bancarisés via l'application ZaLaMa.",
      icon: <HandCoins className="w-6 h-6" />,
      features: [
        "Montant disponible jusqu'à 25% de votre salaire",
        "Traitement en moins de 30 minutes",
        "Frais fixes transparents et minimes",
      ],
      // ctaText: "Demander une avance",
      // ctaLink: "/contact"
    },
    {
      title: "Prêt P2P (Peer-to-Peer)",
      description: "Faciliter l'octroi de prêts entre particuliers en toute sécurité grâce à un système fiable et structuré.",
      icon: <PieChart className="w-6 h-6" />,
      features: [
        "Montant de 5.000.000 à 25.000.000 GNF",
        "Durée de 6 à 24 mois",
        "Taux d'intérêt compétitifs",
        "Réponse de principe en 7 jours"
      ],
      // ctaText: "Demander un prêt",
      // ctaLink: "/contact"
    },
    {
      title: "Conseil financier personnalisé",
      description: "IA sur-mesure intégrer pour accompagner les utilisateurs dans la gestion de leurs dépenses, leurs comptabilités et la planification de leurs avenir financière.",
      icon: <ShieldCheck className="w-6 h-6" />,
      features: [
        "Gestion des dépenses",
        "Livre de comptabilité",
        "Stimulateur financier",
        "Alertes intelligentes"
      ],
      // ctaText: "Prendre rendez-vous",
      // ctaLink: "/contact"
    },
    {
      title: "Marketing",
      description: "Un espace publicitaire intégrée permettant aux entreprises locales et internationales de promouvoir leurs produits et services auprès de notre communauté d'utilisateurs.",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Versements automatiques",
        "Réductions d'impôts",
        "Rendements attractifs",
        "Disponible pour tous les salariés"
      ],
      // ctaText: "Découvrir l'épargne",
      // ctaLink: "/contact"
    },
    {
      title: "Payement de salaire & pension",
      description: "Permettre aux employeurs de payer les salaires de leurs employés non bancarisés via l'application ZaLaMa.",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Versements automatiques",
        "Réductions d'impôts",
        "Rendements attractifs",
        "Disponible pour tous les salariés"
      ],
      // ctaText: "Découvrir l'épargne",
      // ctaLink: "/contact"
    }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-block">
            Nos Services
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez nos solutions financières innovantes conçues pour répondre à tous vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              features={service.features}
              // ctaText={service.ctaText}
              // ctaLink={service.ctaLink}
              icon={service.icon}
              delay={index}
            />
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Vous avez des questions sur nos services ?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour vous guider et vous conseiller dans le choix de la solution la plus adaptée à vos besoins.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            Nous contacter
          </a>
        </motion.div>
      </div>
    </section>
  );
}
