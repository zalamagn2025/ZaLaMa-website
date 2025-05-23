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
    title: "Présentation de ZaLaMa",
    description: (
      <>
        <p>
          ZaLaMa est une FinTech guinéenne innovante à fort impact social. Elle propose aux salariés,
          pensionnés et étudiants les services d&apos;avance sur salaire, de prêt P2P, de paiement de salaire et
          de conseil financier via une intelligence artificielle locale et sur mesure. 
        </p>
        <p>
          ZaLaMa répond aux besoins de trésorerie immédiate, facilite le paiement des non-bancarisés et
          l&apos;accès aux crédits spéciaux, tout en favorisant une meilleure gestion des finances personnelles.
        </p>
      </>
    ),
    badge: "",
    image: "/images/zalamaHeroImg1.png",
  },
  {
    title: "Notre mission sociale",
    description: (
      <>
        <p>
          ZaLaMa vise à renforcer l&apos;inclusion financière et l&apos;autonomie économique en Guinée, en
          offrant aux étudiants, salariés et pensionnaires un accès simple, rapide et sécurisé à des
          services financiers adaptés à leurs besoins
        </p>
        <p>
          ZaLaMa lutte contre le surendettement, encourage
          la gestion responsable des revenus et soutient l&apos;éducation financière. Notre mission est de
          permettre à chacun de mieux vivre le quotidien et de construire un avenir financier plus stable
          et digne
        </p>
      </>
    ),
    badge: "",
    image: "/images/zalamaHeroImg1.png",
  },
];