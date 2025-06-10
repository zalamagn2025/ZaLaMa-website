"use client";

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Smartphone, UserCheck, CreditCard, BarChart, Mail } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const FonctionnementZalama = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 0.77, 0.47, 0.97]
      }
    }
  };

  const slideUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 0.77, 0.47, 0.97] 
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const etapes = [
    {
      id: 1,
      title: "Adhésion de l'entreprise",
      description: [
        "L'employeur signe un contrat de partenariat avec ZaLaMa",
        "Un salarié peut également recommander le service à son employeur",
      ],
      image: "/images/etape1.jpg",
      reverse: false,
    },
    {
      id: 2,
      title: "Mise en place de la plateforme",
      description: [
        "ZaLaMa fournit une application mobile ou web aux salariés",
        "Chaque salarié reçoit un lien d'accès pour activer son compte.",
      ],
      image: "/images/etape2.jpg",
      reverse: true,
    },
    {
      id: 3,
      title: "Activation du compte salarié",
      description: [
        "Le salarié télécharge l'application ou se connecte au site web",
        "Il modifie son mot de passe et accède à son compte",
      ],
      image: "/images/etape3.jpg"
    },
    {
      id: 4,
      title: "Accès aux services ZaLaMa",
      description: "Découvrez les services dédiés aux salariés et employeurs.",
      image: "/images/etape4.jpg",
      reverse: true,
      tabs: [
        {
          value: "salarie",
          label: "Service Salarié",
          content: [
            "Le salarié effectue une demande en remplissant un formulaire correspondant au service souhaité.",
            "Les fonds sont débloqués après validation de la demande, de manière rapide et sécurisés"
          ]
        },
        {
          value: "employeur",
          label: "Service Employeur",
          content: [
            "Paiement des salaires via un tableau de bord.",
            "Promotion de ses produits/services auprès de la communauté ZaLaMa."
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Remboursement automatique",
      description: [
        "Avances : Déduction automatique du salaire mensuel",
        "Prêts : Remboursement échelonné selon un pourcentage choisi par le salarié",
        "Gestion & Conseils financiers : Service 100% gratuit"
      ],
      image: "/images/etape5.jpg",
      reverse: false,
    },
    {
      id: 6,
      title: "Suivi et fidélisation",
      description: [
        "Communication et relance régulière avec les utilisateurs",
        "Offres exclusives et personnalisées selon le profil",
        "Programme de fidélité avec avantages progressifs"
      ],
      image: "/images/etape6.jpg", // Vous devrez ajouter cette image dans votre dossier public/images
      reverse: true,
    }
  ];

  return (
    <section 
      ref={ref}
      className="w-full py-12 sm:py-16 md:py-20 lg:py-28 bg-zalama-bg-darker overflow-hidden flex justify-center"
    >
      <motion.div 
        className="container flex flex-col items-center justify-center px-4 sm:px-6 mx-auto"
        initial="hidden"
        animate={controls}
        variants={container}
      >
        <motion.div 
          className="mx-auto max-w-3xl text-center space-y-4"
          variants={item}
        >
          <motion.h2 
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-block"
            variants={slideUp}
          >
            Fonctionnement de ZaLaMa
          </motion.h2>
          <motion.p 
            className="text-base sm:text-lg text-zalama-text-secondary max-w-[700px] mx-auto"
            variants={slideUp}
          >
            Découvrez comment ZaLaMa simplifie la vie financière des entreprises et leurs employés
          </motion.p>
        </motion.div>

        {/* Version Desktop (cachée sur mobile) */}
        <motion.div 
          className="hidden md:block mx-auto max-w-6xl py-12 space-y-20 lg:space-y-24"
          variants={staggerContainer}
        >
          {etapes.map((etape, index) => (
            <motion.div 
              key={`desktop-${etape.id}`}
              className={`flex flex-col items-center gap-10 lg:gap-16 ${etape.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              variants={item}
              viewport={{ once: true, margin: "-100px" }}
              initial="hidden"
              whileInView="visible"
              custom={index}
            >
              <div className="flex-1 space-y-5 text-primary">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                    {etape.id === 1 && <Building className="h-5 w-5" />}
                    {etape.id === 2 && <Smartphone className="h-5 w-5" />}
                    {etape.id === 3 && <UserCheck className="h-5 w-5" />}
                    {etape.id === 4 && <CreditCard className="h-5 w-5" />}
                    {etape.id === 5 && <BarChart className="h-5 w-5" />}
                    {etape.id === 6 && <Mail className="h-5 w-5" />}
                  </div>
                  <span className="text-sm font-medium text-primary">Étape {etape.id}</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-zalama-text">
                  {etape.title}
                </h3>
                
                {etape.tabs ? (
                  <Tabs defaultValue="salarie" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2 gap-1 p-1 bg-zalama-bg-dark rounded-lg">
                      {etape.tabs.map((tab) => (
                        <TabsTrigger 
                          key={tab.value} 
                          value={tab.value}
                          className="tabs-trigger rounded-md py-2 text-sm font-medium transition-all"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {etape.tabs.map((tab) => (
                      <TabsContent key={tab.value} value={tab.value} className="mt-6 space-y-3">
                        <ul className="list-disc pl-5 space-y-2 text-secondary">
                          {tab.content.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {Array.isArray(etape.description) ? (
                      etape.description.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2.5 mr-2"></span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mt-2.5 mr-2"></span>
                        <span className="text-muted-foreground">{etape.description}</span>
                      </li>
                    )}
                  </ul>
                )}
                
                {etape.id === 4 && (
                  <Button className="mt-6 border-border bg-card hover:bg-zalama-card-hover hover:text-primary transition-colors" variant="outline">
                    En savoir plus
                  </Button>
                )}
              </div>
              
              <div className="flex-1 hidden md:block w-full">
                {etape.image ? (
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50 bg-zalama-bg-light shadow-lg">
                    <Image
                      src={etape.image}
                      alt={etape.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 40vw"
                      priority={etape.id <= 2} // Priorise le chargement des premières images
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50 bg-zalama-bg-light/50 flex items-center justify-center p-8">
                    <div className="text-center">
                      <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-primary/80 mb-3 sm:mb-4" />
                      <h4 className="text-base sm:text-lg font-medium mb-2 text-primary">Services ZaLaMa</h4>
                      <p className="text-xs sm:text-sm text-secondary/80">
                        Sélectionnez un onglet pour voir les détails
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Version Mobile (cartes) */}
        <motion.div 
          className="md:hidden space-y-8 py-8"
          variants={staggerContainer}
        >
          {etapes.map((etape, index) => (
            <motion.div 
              key={`mobile-${etape.id}`}
              className="fonctionnement-card card-hover overflow-hidden transition-all duration-300 hover:shadow-lg"
              variants={item}
              viewport={{ once: true, margin: "-50px" }}
              initial="hidden"
              whileInView="visible"
              custom={index}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                    {etape.id === 1 && <Building className="h-5 w-5" />}
                    {etape.id === 2 && <Smartphone className="h-5 w-5" />}
                    {etape.id === 3 && <UserCheck className="h-5 w-5" />}
                    {etape.id === 4 && <CreditCard className="h-5 w-5" />}
                    {etape.id === 5 && <BarChart className="h-5 w-5" />}
                    {etape.id === 6 && <Mail className="h-5 w-5" />}
                  </div>
                  <span className="text-sm font-medium text-primary">Étape {etape.id}</span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-primary leading-tight">
                  {etape.title}
                </h3>
                
                {etape.tabs ? (
                  <Tabs defaultValue="salarie" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2 gap-1.5 p-1 bg-zalama-bg-dark rounded-lg">
                      {etape.tabs.map((tab) => (
                        <TabsTrigger 
                          key={tab.value} 
                          value={tab.value}
                          className="tabs-trigger rounded-md py-2 text-xs sm:text-sm font-medium transition-all"
                        >
                          <span className="truncate">{tab.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {etape.tabs.map((tab) => (
                      <TabsContent key={tab.value} value={tab.value} className="mt-4 space-y-2">
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-secondary">
                          {tab.content.map((item, i) => (
                            <li key={i} className="leading-relaxed">{item}</li>
                          ))}
                        </ul>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  Array.isArray(etape.description) ? (
                    <ul className="pl-2 space-y-1.5 text-sm text-secondary">
                      {etape.description.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full bg-primary inline-block"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      {etape.description}
                    </p>
                  )
                )}
                
                {etape.id === 4 && (
                  <Button 
                    className="mt-4 w-full sm:w-auto border-border bg-card hover:bg-zalama-card-hover hover:text-primary transition-colors" 
                    variant="outline" 
                    size="sm"
                  >
                    En savoir plus
                  </Button>
                )}
              </div>
              
              {/* Images masquées sur mobile */}
              {etape.image && (
                <div className="hidden md:block relative aspect-video w-full bg-zalama-bg-light">
                  <Image
                    src={etape.image}
                    alt={etape.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FonctionnementZalama;