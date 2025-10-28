"use client";
import { motion } from 'framer-motion';
import { HandCoins, LineChart, Megaphone, TrendingUp, BarChart3, CheckCircle2, CreditCard } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ServicesSection() {
  const services = [
    {
      title: "Avances sur salaire",
      description: "Permet aux salariés et pensionnés un accès rapide à une partie de leurs salaires avant la date de paie officielle pour les imprévus et urgences financières.",
      icon: <HandCoins className="w-6 h-6" />,
      features: [
        "100% digital et disponible 24h/24",
        "Montant disponible jusqu'à 30% du salaire",
        "Plusieurs avances sur salaire possible ",
        "Traitement en moins de 5 minutes",
        "Frais fixes transparents et minimes",
      ],
      // ctaText: "En savoir plus",
      // ctaLink: "/avance-sur-salaire"
    },
    {
      title: "Paiement de salaire",
      description: "Permet aux entreprises de payer leurs salariés, ou d'assurer le paiement en temps réel via ZaLaMa lorsqu'elles rencontrent un retard de trésorerie.",
      icon: <CreditCard className="w-6 h-6 text-[#FF671E]" />,
      features: [
        "100% digital",
        "Avec bulletin de paie",
        "Frais fixes et transparents"
      ]
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
      // ctaLink: "/conseil-financier",
    },
    {
      title: "Marketing",
      description: "Un espace publicitaire intégrée permettant aux entreprises locales et internationales de promouvoir leurs produits et services auprès de notre communauté d'utilisateurs.",
      icon: <BarChart3 className="w-6 h-6" />,
      features: [
        "Ciblage intelligent",
        "Interfaces de gestion et statistiques à temps réel",
        "Forte visibilité locale",
        "Soutien technologique et accompagnement",
        "Paiement échelonné dans nos boutiques partenaires"
      ]
      // ctaText: "En savoir plus",
      // ctaLink: "/marketing",
    }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-gray-950">
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
          {services.slice(0, 3).map((service, index) => (
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
        
        {/* Version desktop - Pleine largeur */}
        <motion.div 
          className="hidden md:block mt-12 w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-full p-8 rounded-2xl bg-gray-800/50 border border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col items-center text-center w-full max-w-6xl mx-auto">
              <div className="flex-shrink-0 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-[#FF671E] mx-auto">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {services[3].icon}
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{services[3].title}</h3>
              <p className="text-gray-300 mb-8 text-lg max-w-3xl mx-auto">{services[3].description}</p>
              
              <div className="w-full max-w-5xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row items-stretch justify-center">
                  {services[3].features.map((feature, index) => (
                    <div key={index} className="relative flex-1 px-4 py-2">
                      <div className="flex flex-col items-center h-full">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" color='#FF671E' />
                        </div>
                        <span className="text-base text-gray-300">{feature}</span>
                      </div>
                      {index < services[3].features.length - 1 && (
                        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-gray-600 h-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Version mobile - Centrée comme les autres cartes */}
        <motion.div 
          className="block md:hidden mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 gap-6 justify-items-center">
            <ServiceCard 
              title={services[3].title}
              description={services[3].description}
              features={services[3].features}
              icon={services[3].icon}
              delay={3}
              fullWidth={false}
              className="w-full max-w-md"
            />
          </div>
        </motion.div>

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