"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Wallet, PiggyBank, Users, Brain, Megaphone } from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
}
const services: Service[] = [
  {
    title: "Paiement de salaire & pension",
    description: "Permettre aux employeurs de payer les salaires de leurs employés non bancarisés via l'application ZaLaMa.",
    icon: Wallet,
    badge: "Service Principal"
  },
  {
    title: "Avance sur salaire",
    description: "Permet aux salariés et pensionnés un accès rapide à une partie de leurs salaires avant la date de paie officielle pour les imprévus et urgences financières.",
    icon: PiggyBank,
    badge: "Service Principal"
  },
  {
    title: "Prêt P2P (Peer-to-Peer)",
    description: "Faciliter l'octroi de prêts entre particuliers en toute sécurité grâce à un système fiable et structuré.",
    icon: Users,
    badge: "Service Principal"
  },
  {
    title: "Conseil financier personnalisé",
    description: "IA sur-mesure intégrer pour accompagner les utilisateurs dans la gestion de leurs dépenses, leurs comptabilités et la planification de leurs avenir financière.",
    icon: Brain,
    badge: "Service Principal"
  },
  {
    title: "Marketing",
    description: "Un espace publicitaire intégrée permettant aux entreprises locales et internationales de promouvoir leurs produits et services auprès de notre communauté d'utilisateurs.",
    icon: Megaphone,
    badge: "Service Complémentaire"
  }
];

export default function FeatureSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b form-white to-[#D2DCFF] overflow-x-clip">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="flex flex-col justify-center items-center mb-12">
          <h2 className="section-title text-center">Nos Services</h2>
          <div className="mt-2 flex justify-center items-center">
            <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
          </div>
          <p className="mt-4 text-center text-gray-600 max-w-2xl">
            Des solutions financières innovantes pour tous vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
            >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#10059F]/10 rounded-lg flex items-center justify-center">
                        <Icon 
                          className="w-6 h-6 text-[#10059F]" 
                        strokeWidth={1.5}
                    />
                  </div>
                      <Badge 
                    variant={service.badge === "Service Principal" ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {service.badge}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {service.title}
                </h3>

                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                <div className="mt-4">
                      <a 
                    href={`/services/${service.title.toLowerCase().replace(/ /g, '-')}`}
                    className="text-[#10059F] hover:text-[#0d0480] text-sm font-medium flex items-center"
                  >
                    En savoir plus
                        <svg 
                          className="w-4 h-4 ml-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </a>
                    </div>
                  </CardContent>
                </Card>
        </motion.div>
  );
          })}
        </div>
      </motion.div>
    </section>
  );
}
