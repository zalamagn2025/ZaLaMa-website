"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export function AboutHeroCarousel() {
  return (
    <div className="relative w-full sm:py-6 lg:py-10">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .zalama-font {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Présentation de ZaLaMa */}
        <motion.section
          className="mb-10 lg:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Contenu textuel */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="zalama-font text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent tracking-tight leading-tight">
                C’est quoi ZaLaMa ?
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full" />
              </motion.div>
              
              <motion.div
                className="prose prose-lg zalama-font text-gray-300 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-lg leading-relaxed">
                  ZaLaMa est une startup guinéenne innovante, à fort impact, au service du bien-être financier.
                </p>
                <p className="text-lg leading-relaxed">
                  Elle propose aux salariés un service d'avance sur salaire, ainsi qu'un accompagnement en gestion et conseil financier, grâce à une intelligence artificielle locale et personnalisée.
                </p>
                <p className="text-lg leading-relaxed">
                  ZaLaMa répond aux besoins urgents de trésorerie tout en encourageant une meilleure gestion des finances personnelles.
                </p>
              </motion.div>
            </motion.div>

            {/* Image d'équipe avec gestion professionnelle */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="relative bg-gradient-to-br from-zalama-bg-dark to-zalama-bg-darker rounded-2xl p-6 shadow-2xl border border-border/30"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src="/images/zlm.jpg"
                    alt="ZaLaMa"
                    width={800}
                    height={600}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
                
                {/* Badge "Notre équipe" */}
                <motion.div
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  Présentation
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section Notre mission */}
        <motion.section
          className="mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="relative bg-gradient-to-br from-zalama-bg-dark to-zalama-bg-darker rounded-2xl p-6 shadow-2xl border border-border/30"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src="/images/zalamaAppDesigner.png"
                    alt="Notre mission"
                    width={800}
                    height={600}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
                
                {/* Badge "Notre mission" */}
                <motion.div
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-primary via-orange-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  Notre mission
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Contenu textuel */}
            <motion.div
              className="space-y-8 order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="zalama-font text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent tracking-tight leading-tight">
                  Notre mission
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full" />
              </motion.div>
              
              <motion.div
                className="prose prose-lg zalama-font text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-xl leading-relaxed font-medium">
                  Offrir à chaque salarié guinéen une solution fiable, simple, rapide et humaine, adaptée à ses besoins financiers, grâce à une technologie locale, accessible et inclusive, qui soulage aujourd'hui et construit demain.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}