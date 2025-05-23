"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AboutHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % dummyContent.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + dummyContent.length) % dummyContent.length);
  };

  return (
    <div className="relative w-full py-4 sm:py-6 -mt-12">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .zalama-font {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-full lg:w-1/2 overflow-visible">
              <motion.h2
                className="zalama-font text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-3 mb-6 tracking-tight"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {dummyContent[currentIndex].title}
              </motion.h2>
              <motion.div
                animate={{
                  y: [0, -4, 0],
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={dummyContent[currentIndex].image}
                  alt={dummyContent[currentIndex].title}
                  width={800}
                  height={604}
                  className="w-full h-[354px] sm:h-[454px] lg:h-[504px] object-contain max-h-full"
                  priority={currentIndex === 0}
                />
              </motion.div>
            </div>
            <motion.div
              className="w-full lg:w-1/2 prose prose-md zalama-font text-gray-300"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-[#3B82F6] mb-4">
                {dummyContent[currentIndex].badge}
              </h3>
              {dummyContent[currentIndex].description}
              <div className="flex justify-center gap-6 mt-4">
                <motion.button
                  onClick={prevSlide}
                  className="p-4 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg hover:shadow-2xl"
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft size={28} />
                </motion.button>
                <motion.button
                  onClick={nextSlide}
                  className="p-4 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg hover:shadow-2xl"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={28} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const dummyContent = [
  {
    title: "Présentation de ZALAMA",
    description: (
      <>
        <p>
          ZaLaMa est une FinTech guinéenne visionnaire qui redéfinit l’accès aux services financiers avec un impact social fort. Nous proposons des avances sur salaire, des prêts P2P, des paiements pour les non-bancarisés et des conseils financiers personnalisés via une intelligence artificielle adaptée aux réalités locales.
        </p>
        <p>
          Notre plateforme simplifie la gestion financière pour les salariés, pensionnés et étudiants, en répondant aux besoins de trésorerie immédiate tout en promouvant une gestion responsable.
        </p>
      </>
    ),
    badge: "Introduction",
    image: "/images/zalamaHeroImg1.png",
  },
  {
    title: "Notre mission sociale",
    description: (
      <>
        <p>
          ZaLaMa s’engage à promouvoir l’inclusion financière et l’autonomie économique en Guinée. Nos services, simples, rapides et sécurisés, sont conçus pour répondre aux besoins des étudiants, salariés et pensionnés, tout en luttant contre le surendettement.
        </p>
        <p>
          Grâce à des outils d’éducation financière, nous aidons nos utilisateurs à gérer leurs revenus et à construire un avenir financier stable et digne.
        </p>
      </>
    ),
    badge: "Mission",
    image: "/images/zalamaHeroImg1.png",
  },
  {
    title: "Notre vision d’avenir",
    description: (
      <>
        <p>
          ZaLaMa ambitionne de devenir le leader de l’inclusion financière en Afrique de l’Ouest. Nous visons à transformer la manière dont les individus accèdent et gèrent leurs finances, en rendant les services financiers accessibles, transparents et adaptés à tous.
        </p>
        <p>
          En combinant technologie de pointe et engagement social, nous bâtissons un écosystème où chaque Guinéen peut réaliser ses objectifs financiers avec confiance.
        </p>
      </>
    ),
    badge: "Vision",
    image: "/images/zalamaHeroImg1.png",
  },
];