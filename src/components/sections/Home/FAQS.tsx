"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Comment fonctionne le crédit salaire ?",
    answer: "Le crédit salaire vous permet d'obtenir une avance sur votre salaire de manière simple et rapide. Vous pouvez demander jusqu'à 70% de votre salaire net, qui sera remboursé automatiquement sur votre prochaine paie avec des frais minimes.",
  },
  {
    question: "Quels sont les documents nécessaires pour une demande ?",
    answer: "Pour une demande de crédit salaire, vous aurez besoin de votre pièce d'identité, de votre dernier bulletin de paie et d'un RIB. Pour les entreprises, une copie du K-bis de moins de 3 mois est également requise.",
  },
  {
    question: "Quel est le délai de traitement ?",
    answer: "Le traitement de votre demande est rapide. Une fois tous les documents fournis, vous recevrez une réponse sous 24 à 48 heures. Le virement est effectué sous 24 heures après approbation.",
  },
  {
    question: "Y a-t-il des frais cachés ?",
    answer: "Non, la transparence est notre priorité. Tous les frais sont clairement indiqués lors de votre demande. Les seuls frais appliqués sont les frais de dossier et les intérêts, calculés de manière transparente.",
  },
  {
    question: "Puis-je rembourser par anticipation ?",
    answer: "Oui, vous pouvez rembourser votre crédit par anticipation à tout moment sans frais supplémentaires. Cela vous permet de réduire le coût total de votre crédit.",
  },
];

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
      duration: 0.5,
      ease: [0.16, 0.77, 0.47, 0.97],
    },
  },
  hover: {
    y: -2,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
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
}

const FAQItem = ({ item, isOpen, onClick, index }: FAQItemProps) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-20px" }}
    whileHover={!isOpen ? "hover" : "visible"}
    className="overflow-hidden rounded-xl bg-zalama-card border border-zalama-border/50 hover:border-zalama-border/70 transition-all duration-300"
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
                  duration: 0.4, 
                  ease: [0.16, 0.77, 0.47, 0.97] 
                }
              }
            },
            collapsed: { 
              opacity: 0, 
              height: 0,
              transition: { 
                opacity: { duration: 0.1 },
                height: { 
                  duration: 0.3, 
                  ease: [0.16, 0.77, 0.47, 0.97] 
                }
              }
            },
          }}
          className="overflow-hidden"
        >
          <motion.div 
            className="px-5 pb-5 pt-0 text-sm text-zalama-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.2, duration: 0.3 }
            }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.1 }
            }}
          >
            <motion.div 
              className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent my-3"
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: 1,
                transition: { delay: 0.15, duration: 0.4, ease: [0.6, 0.01, 0, 0.9] }
              }}
              exit={{ 
                scaleX: 0,
                transition: { duration: 0.2 }
              }}
            />
            <motion.p 
              className="leading-relaxed"
              initial={{ y: -5, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { delay: 0.2, duration: 0.3 }
              }}
              exit={{ 
                y: -5, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
            >
              {item.answer}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              Trouvez les réponses aux questions les plus courantes sur nos services
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-4 sm:gap-5"
          >
            {FAQS.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onClick={() => toggleItem(index)}
                index={index}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}