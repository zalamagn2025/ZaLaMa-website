"use client";

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Smartphone, UserCheck, CreditCard, BarChart, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
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
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideUp = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15
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
            "Le salarié effectue une demande en remplissant un formulaire.",
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
      image: "/images/etape6.jpg",
      reverse: true,
    }
  ];

  const getStepIcon = (stepId: number) => {
    const icons = {
      1: Building,
      2: Smartphone,
      3: UserCheck,
      4: CreditCard,
      5: BarChart,
      6: Mail
    };
    return icons[stepId as keyof typeof icons] || Building;
  };

  return (
    <section 
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-zalama-bg-darker via-zalama-bg-dark to-zalama-bg-darker overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        className="relative container mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate={controls}
        variants={container}
      >
        {/* Header Section */}
        <motion.div 
          className="mx-auto max-w-4xl text-center space-y-6 mb-16 lg:mb-20"
          variants={item}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4"
            variants={slideUp}
          >
            <CheckCircle2 className="w-4 h-4" />
            Processus simplifié
          </motion.div>
          
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent"
            variants={slideUp}
          >
            Fonctionnement de ZaLaMa
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-zalama-text-secondary max-w-3xl mx-auto leading-relaxed"
            variants={slideUp}
          >
            Découvrez comment ZaLaMa simplifie la vie financière des entreprises et leurs employés
          </motion.p>
        </motion.div>

        {/* Desktop Version */}
        <motion.div 
          className="hidden lg:block space-y-24"
          variants={staggerContainer}
        >
          {etapes.map((etape, index) => {
            const IconComponent = getStepIcon(etape.id);
            
            return (
              <motion.div 
                key={`desktop-${etape.id}`}
                className={`relative flex items-center gap-16 ${etape.reverse ? 'flex-row-reverse' : 'flex-row'}`}
                variants={item}
                viewport={{ once: true, margin: "-100px" }}
                initial="hidden"
                whileInView="visible"
              >
                {/* Step Number Badge */}
                <div className={`absolute top-0 ${etape.reverse ? 'right-0' : 'left-0'} -translate-y-8 flex items-center gap-3`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 text-white font-bold text-lg shadow-lg">
                    {etape.id}
                  </div>
                  <div className="h-px w-16 bg-gradient-to-r from-primary/50 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-zalama-text leading-tight">
                          {etape.title}
                        </h3>
                      </div>
                    </div>
                    
                    {etape.tabs ? (
                      <div className="mt-8">
                        <Tabs defaultValue="salarie" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 gap-2 p-1.5 bg-zalama-bg-dark/80 backdrop-blur-sm rounded-xl border border-border/50">
                            {etape.tabs.map((tab) => (
                              <TabsTrigger 
                                key={tab.value} 
                                value={tab.value}
                                className="tabs-trigger rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                              >
                                {tab.label}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          {etape.tabs.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value} className="mt-6 space-y-4">
                              <ul className="space-y-3">
                                {tab.content.map((item, i) => (
                                  <li key={i} className="flex items-start gap-3 text-zalama-text-secondary leading-relaxed">
                                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    ) : (
                      <ul className="space-y-3 mt-6">
                        {Array.isArray(etape.description) ? (
                          etape.description.map((item, index) => (
                            <li key={index} className="flex items-start gap-3 text-zalama-text-secondary leading-relaxed">
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start gap-3 text-zalama-text-secondary leading-relaxed">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"></div>
                            <span>{etape.description}</span>
                          </li>
                        )}
                      </ul>
                    )}
                    
                    {etape.id === 4 && (
                      <Button className="mt-8 group bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                        En savoir plus
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Image Section */}
                <div className="flex-1">
                  {etape.image ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/30 bg-zalama-bg-light shadow-2xl group">
                      <Image
                        src={etape.image}
                        alt={etape.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                        sizes="(max-width: 1024px) 50vw, 40vw"
                        priority={etape.id <= 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-zalama-bg-light to-zalama-bg-dark flex items-center justify-center p-8 shadow-2xl">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-zalama-text mb-2">Services ZaLaMa</h4>
                          <p className="text-sm text-zalama-text-secondary">
                            Sélectionnez un onglet pour voir les détails
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile Version */}
        <motion.div 
          className="lg:hidden space-y-8"
          variants={staggerContainer}
        >
          {etapes.map((etape, index) => {
            const IconComponent = getStepIcon(etape.id);
            
            return (
              <motion.div 
                key={`mobile-${etape.id}`}
                className="group relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-zalama-bg-dark to-zalama-bg-darker shadow-lg hover:shadow-xl transition-all duration-300"
                variants={item}
                viewport={{ once: true, margin: "-50px" }}
                initial="hidden"
                whileInView="visible"
              >
                {/* Step Number */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 text-white font-bold text-sm shadow-lg">
                    {etape.id}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 text-primary flex-shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-zalama-text leading-tight">
                        {etape.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Content */}
                  {etape.tabs ? (
                    <div className="space-y-4">
                      <Tabs defaultValue="salarie" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 gap-2 p-1.5 bg-zalama-bg-dark/80 backdrop-blur-sm rounded-xl border border-border/50">
                          {etape.tabs.map((tab) => (
                            <TabsTrigger 
                              key={tab.value} 
                              value={tab.value}
                              className="tabs-trigger rounded-lg py-2.5 px-3 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                            >
                              <span className="truncate">{tab.label}</span>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {etape.tabs.map((tab) => (
                          <TabsContent key={tab.value} value={tab.value} className="mt-4 space-y-3">
                            <ul className="space-y-2.5">
                              {tab.content.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-zalama-text-secondary leading-relaxed">
                                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {Array.isArray(etape.description) ? (
                        etape.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-zalama-text-secondary leading-relaxed">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-3 text-sm sm:text-base text-zalama-text-secondary leading-relaxed">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                          <span>{etape.description}</span>
                        </li>
                      )}
                    </ul>
                  )}
                  
                  {etape.id === 4 && (
                    <Button 
                      className="mt-6 w-full group bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200" 
                      size="sm"
                    >
                      En savoir plus
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
                
                {/* Mobile Image */}
                {etape.image && (
                  <div className="relative aspect-video w-full bg-zalama-bg-light">
                    <Image
                      src={etape.image}
                      alt={etape.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FonctionnementZalama;