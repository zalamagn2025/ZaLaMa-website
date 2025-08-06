"use client";

import { motion } from 'framer-motion';
import { HandCoins, LineChart, Megaphone } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ServicesSection() {
  const services = [
    {
      title: "Avances sur salaire",
      description: "Permet aux salariés et pensionnés un accès rapide à une partie de leurs salaires avant la date de paie officielle pour les imprévus et urgences financières.",
      icon: <HandCoins className="w-6 h-6" />,
      features: [
        "Montant disponible jusqu'à 25% de votre salaire",
        "Traitement en moins de 30 minutes",
        "Frais fixes transparents et minimes",
      ],
      // ctaText: "En savoir plus",
      // ctaLink: "/avance-sur-salaire"
    },
    {
      title: "Gestion & Conseil financier",
      description: "IA sur-mesure intégrer pour accompagner les utilisateurs dans la gestion de leurs dépenses, leurs comptabilités et la planification de leurs avenir financier.",
      icon: <LineChart className="w-6 h-6" />,
      features: [
        "Gestion des dépenses",
        "Livre de comptabilité",
        "Stimulateur financier",
        "Chat avec l'IA",
        "Alertes intelligentes"
      ]
      // ctaText: "En savoir plus",
      // ctaLink: "/conseil-financier"
    },
    {
      title: "Marketing",
      description: "Un espace publicitaire intégrée permettant aux entreprises locales et internationales de promouvoir leurs produits et services auprès de notre communauté d'utilisateurs.",
      icon: <Megaphone className="w-6 h-6" />,
      features: [
        "Ciblage intelligent",
        "Interfaces de gestion et statistiques à temps réel",
        "Forte visibilité locale",
        "Soutien technologique et accompagnement"
      ]
      // ctaText: "En savoir plus",
      // ctaLink: "/marketing"
    }
  ];

  return (
    <section className="w-full py-8 md:py-12 lg:py-18 ">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
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
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez nos solutions financières innovantes conçues pour répondre à tous vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
          <h3 className="text-2xl font-bold mb-4 text-white">
            Vous avez des questions sur nos services ?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
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