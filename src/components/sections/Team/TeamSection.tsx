"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Phone, Linkedin, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Mamadouba Youla",
    role: "Fondateur & CEO",
    description:
      "Mamadouba dirige la vision stratégique de ZaLaMa, avec une expertise en inclusion financière et en technologies financières pour transformer la Guinée.",
    image: "/images/shawn.jpeg",
    phone: "+224 612 34 75 79",
    linkedin: "https://linkedin.com/in/mamadouba-youla",
    email: "mamadouba@zalama.com",
  },
  {
    name: "Aissata Camara",
    role: "Directrice Technologie",
    description:
      "Aissata supervise le développement de notre IA locale, garantissant des solutions financières sécurisées et adaptées aux besoins des utilisateurs.",
    image: "/images/télécharger (1).jpg",
    phone: "+224 623 45 67 89",
    linkedin: "https://linkedin.com/in/aissata-camara",
    email: "aissata@zalama.com",
  },
  {
    name: "Ibrahima Diallo",
    role: "Responsable Produit",
    description:
      "Ibrahima conçoit des interfaces intuitives, rendant les services de ZaLaMa accessibles et agréables pour tous, avec un focus sur l’expérience utilisateur.",
    image: "/images/télécharger (2).jpg",
    phone: "+224 634 56 78 90",
    linkedin: "https://linkedin.com/in/ibrahima-diallo",
    email: "ibrahima@zalama.com",
  },
];

export default function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const currentMember = teamMembers[currentIndex];

  return (
    <section className="relative w-full py-16">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .zalama-font {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="zalama-font text-3xl sm:text-4xl font-extrabold text-white text-center mb-12 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Notre Équipe
        </motion.h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Image Block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="relative bg-[#111827]/80 border border-[#3B82F6]/30 rounded-xl overflow-hidden w-80 h-96"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={currentMember.image}
                alt={currentMember.name}
                width={320}
                height={384}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Info Block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="bg-[#111827]/80 border border-[#3B82F6]/30 p-6 rounded-xl max-w-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="zalama-font text-xl sm:text-2xl font-semibold text-white">
                {currentMember.name}
              </h3>
              <p className="zalama-font text-[#3B82F6] text-lg mt-1">
                {currentMember.role}
              </p>
              <p className="zalama-font text-gray-300 mt-3 text-base">
                {currentMember.description}
              </p>
              <motion.div
                className="mt-4 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-5 w-5 text-[#3B82F6]" />
                  {currentMember.phone}
                </span>
                <div className="flex gap-4">
                  <motion.a
                    href={currentMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3B82F6]"
                    whileHover={{ scale: 1.2, color: "#60A5FA" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href={`mailto:${currentMember.email}`}
                    className="text-[#3B82F6]"
                    whileHover={{ scale: 1.2, color: "#60A5FA" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Mail className="h-5 w-5" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-6 mt-10">
          <motion.button
            onClick={prev}
            className="p-4 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg hover:shadow-2xl"
            whileHover={{ scale: 1.15, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft size={28} />
          </motion.button>
          <motion.button
            onClick={next}
            className="p-4 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg hover:shadow-2xl"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}