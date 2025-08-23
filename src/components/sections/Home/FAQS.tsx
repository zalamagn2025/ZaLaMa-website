"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = {
  salarie: [
    {
      question: "Qui peut utiliser ZaLaMa ?",
      answer: "Les étudiants, les salariés et les pensionnaires affiliés à une entreprise ou minsitère partenaire.",
    },
    {
      question: "Quels sont les avantages de ZaLaMa pour un utilisateur ?",
      answer: "•Réduction du stress financier en cas d'urgence.\n• Augmentation du pouvoir d'achat sans recourir à l'endettement.\n• Amélioration de la gestion budgétaire personnelle.\n• Réduction des inégalités en matière d'accès au financement, notamment pour les plus modestes.\n• Diminution des risques de surendettement en limitant les prêts informels et usuriers.",
    },
    {
      question: "Quel est le montant maximum que je peux demander ?",
      answer: "Avance sur salaire : Jusqu'à 30% de votre revenu mensuel.",
    },
    {
      question: "En combien de temps puis-je recevoir l'argent ?",
      answer: "En moins de 10 minutes après validation de votre demande.",
    },
    {
      question: "Est-ce que je peux faire plusieurs demandes par mois ?",
      answer: "Oui, tant que le montant total ne dépasse pas votre limite autorisée.",
    },
    {
      question: "Puis-je utiliser ZaLaMa sans passer par mon entreprise ?",
      answer: "Non. ZaLaMa fonctionne avec les entreprises partenaires qui valident l'éligibilité des salariés et pensionnaires.",
    },
  ],
  employeur: [
    {
      question: "Quels sont les avantages pour une entreprise d'adhérer à ZaLaMa ?",
      answer: "• Renforcement de la relation employeur-employé en valorisant votre politique sociale.\n• Réduction du turnover et fidélisation des talents.\n• Augmentation de la motivation et de la productivité des collaborateurs.\n• Gestion sereine des éventuels retards de paiement sans tensions internes.\n• Élimination des demandes d'avances internes souvent difficiles à gérer.",
    },
    {
      question: "Comment l'entreprise est-elle impliquée dans le processus ?",
      answer: "Elle valide l'identité, le statut du salarié, et autorise l'accès aux services.",
    },
    {
      question: "Que coûte l'adhésion au service ZaLaMa ?",
      answer: "1 000 000 GNF pour une adhésion unique.",
    },
    {
      question: "Est-ce que ZaLaMa interfère avec la gestion de la paie ?",
      answer: "Non. ZaLaMa complète la paie sans la modifier. L'entreprise garde le contrôle total.",
    },
    {
      question: "Est-ce que ZaLaMa peut être intégré à notre logiciel RH ?",
      answer: "Oui. Une intégration simple est possible pour faciliter le suivi des demandes.",
    },
  ]
};

const fadeInUp = {
  hidden: { 
    y: 20, 
    opacity: 0,
    scale: 0.98
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    },
  },
  hover: {
    y: -2,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

interface FAQItemProps {
  item: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onClick: () => void;
  index: number;
  type: 'salarie' | 'employeur';
}

const FAQItem = ({ item, isOpen, onClick, index, type }: FAQItemProps) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-20px" }}
    whileHover={!isOpen ? "hover" : "visible"}
    className={`group relative overflow-hidden rounded-xl bg-zalama-card border border-zalama-border/50 hover:border-zalama-border/70 transition-all duration-300 cursor-pointer ${
      isOpen ? 'shadow-lg' : 'hover:shadow-md'
    } ${
      type === 'salarie' 
        ? 'hover:border-primary/50' 
        : 'hover:border-blue-600/50'
    }`}
  >
    <motion.button
      className="flex w-full items-center justify-between p-5 text-left"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={`faq-${index}`}
      whileTap={{ scale: 0.98 }}
    >
      <motion.h3 
        className="text-base font-medium text-primary sm:text-lg"
        animate={isOpen ? { color: 'hsl(var(--primary))' } : { color: 'hsl(var(--primary))' }}
        transition={{ duration: 0.2 }}
      >
        {item.question}
      </motion.h3>
      <motion.div 
        className="ml-4 flex-shrink-0"
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5 text-zalama-text-secondary" />
      </motion.div>
    </motion.button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={`faq-${index}`}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { 
              opacity: 1, 
              height: "auto",
              transition: { 
                opacity: { duration: 0.2, delay: 0.1 },
                height: { 
                  duration: 0.4
                }
              }
            },
            collapsed: { 
              opacity: 0, 
              height: 0,
              transition: { 
                opacity: { duration: 0.1 },
                height: { 
                  duration: 0.3
                }
              }
            },
          }}
          className="overflow-hidden"
        >
          {/* Effet Glassmorphism pour le bloc de réponse */}
          <motion.div 
            className="relative mx-4 mb-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.2, duration: 0.4 }
            }}
            exit={{ 
              opacity: 0, 
              y: 10,
              transition: { duration: 0.2 }
            }}
          >
            {/* Overlay de fond pour renforcer l'effet glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-xl" />
            
            {/* Contenu de la réponse */}
            <div className="relative px-5 py-4">
              {/* Séparateur avec effet glassmorphism */}
              <motion.div 
                className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: 1,
                  transition: { delay: 0.3, duration: 0.5 }
                }}
                exit={{ 
                  scaleX: 0,
                  transition: { duration: 0.2 }
                }}
              />
              
              {/* Texte de la réponse */}
              <motion.div
                className="text-sm text-zalama-text-secondary space-y-3 leading-relaxed"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { 
                      duration: 0.4, 
                      ease: 'easeOut',
                      staggerChildren: 0.1
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {item.answer.split('\n').map((paragraph, i) => (
                  <motion.p 
                    key={i} 
                    className={`${
                      paragraph.startsWith('•') 
                        ? 'flex items-start gap-2' 
                        : ''
                    }`}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: { duration: 0.3 }
                      }
                    }}
                  >
                    {paragraph.startsWith('•') && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    )}
                    <span className={paragraph.startsWith('•') ? 'flex-1' : ''}>
                      {paragraph.startsWith('•') ? paragraph.substring(1).trim() : paragraph}
                    </span>
                  </motion.p>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'salarie' | 'employeur'>('salarie');

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
      {/* Background decorative elements pour renforcer l'effet glassmorphism */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-12 text-center"
          >
            <h2 className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              Questions Fréquentes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Consultez nos réponses aux questions les plus fréquemment posées par les utilisateurs et les entreprises partenaires
            </p>

            {/* Onglets avec effet glassmorphism */}
            <div className="mt-8 inline-flex p-1 bg-zalama-bg-darker/80 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg">
              {(['salarie', 'employeur'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setOpenIndex(0);
                  }}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? `${
                          tab === 'salarie' 
                            ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg' 
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        }`
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {tab === 'salarie' ? 'Employés' : 'Employeurs'}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-4 sm:gap-5"
          >
            {FAQS[activeTab].map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onClick={() => toggleItem(index)}
                index={index}
                type={activeTab}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}