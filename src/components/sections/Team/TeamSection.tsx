"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";

type SocialNetwork = {
  name: string;
  url: string;
  icon: keyof typeof LucideIcons;
  color?: string;
};

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  phone: string;
  email: string;
  socials: SocialNetwork[];
};

const teamMembers: TeamMember[] = [
  {
    name: "Fassou Gbagan HABA",
    role: "Cofondateur & Président",
    description:
      "Fort d'une expertise solide, il dirige la vision stratégique de ZaLaMa. Visionnaire et engagé, il incarne un leadership audacieux et représente une nouvelle génération d'entrepreneurs Guinéens.",
    image: "/images/fassou.jpg",
    phone: "+224 627 12 94 79",
    email: "fassougbaganhaba@gmail.com",
    socials: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gbagan-fati-haba-6339a3269?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', icon: 'Linkedin' },
      { name: 'Facebook', url: 'https://www.facebook.com/gbagan.haba', icon: 'Facebook' },
      // { name: 'GitHub', url: 'https://github.com/example', icon: 'Github' },
      { name: 'Email', url: 'mailto:fassougbaganhaba@gmail.com', icon: 'Mail' },
    ],
  },
  {
    name: "Mory Koulibaly",
    role: "Cofondateur & Directeur Général",
    description:
      "Fort d’une expérience technique acquise à travers des projets innovants tels que Kambily et Findaara, il dirige ZaLaMa avec rigueur et vision. Aujourd’hui, il fait partie de cette nouvelle génération qui construit activement l’avenir du digital en Guinée.",
    image: "/images/mory.jpg",
    phone: "+224 625 21 21 15",
    email: "morykoulibaly2023@gmail.com",
    socials: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mory-koulibaly-76005a324/?originalSubdomain=gn', icon: 'Linkedin' },
      { name: 'GitHub', url: 'https://github.com/Morymirco', icon: 'Github' },
      { name: 'Portfolio', url: 'https://www.morykoulibaly.me/', icon: 'BriefcaseBusiness' },
      { name: 'Mail', url: 'mailto:morykoulibaly2023@gmail.com', icon: 'Mail' },
    ],
  },
  {
    name: "Karfalla Diaby",
    role: "Co-Fontdateur & Directeur des Opérations",
    description:
      "Designer, stratège opérationnel et créateur de solutions, il transforme les idées en produits concrets. À la croisée du design, de la tech et de l’organisation, il pilote les opérations avec une vision claire : construire des projets utiles, agiles et profondément ancrés dans la réalité Guinéenne.",
    image: "/images/Karfalla.jpg",
    phone: "+224 628 77 45 73",
    email: "diabykarfalla2@gmailcom",
    socials: [
      { name: 'GitHub', url: 'https://github.com/KarfallaDiaby', icon: 'Github' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/karfalla-diaby-75bb66217/', icon: 'Linkedin' },
      // { name: 'Behance', url: 'https://behance.net/example', icon: 'Behance' },
      { name: 'Facebook', url: 'https://www.facebook.com/karfalla.diaby.18/', icon: 'Facebook' },
      { name: 'Mail', url: 'mailto:diabykarfalla2@gmailcom', icon: 'Mail' },
    ],
  },
  {
    name: "Jean Keloua Ouamouno",
    role: "Cofondateur & Développeur",
    description:
      "Conçoit des solutions web et mobiles robustes, centrées sur l’impact et la performance. Expert en Symfony, Laravel, Next.js, Django et Expo, il allie maîtrise technique et vision stratégique.Chez Zalama, il contribue activement à l’innovation numérique en Guinée...",
    image: "/images/jeanos.jpg",
    phone: "+224 620 32 79 06",
    email: "jeankelouaouamouno71@gmailcom",
    socials: [
      { name: 'GitHub', url: 'https://github.com/Jeanos224', icon: 'Github' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jeanos-ouamouno-183a09356/', icon: 'Linkedin' },
      // { name: 'Behance', url: 'https://behance.net/example', icon: 'Behance' },
      { name: 'Facebook', url: 'https://www.facebook.com/jeanos.ouamouno', icon: 'Facebook' },
      { name: 'Mail', url: 'mailto:jeankelouaouamouno71@gmailcom', icon: 'Mail' },
    ],
  },
  {
    name: "Mamadouba Youla",
    role: "Co-fondateur & Responsable Client",
    description:
      "Il garantit une expérience client exceptionnelle, en créant des liens forts avec la communauté Zalama. Expert en développement web et mobile, passionné par l’intelligence artificielle, il incarne la synergie entre la technologie et la relation client au sein de Zalama.",
    image: "/images/youla.jpg",
    phone: "+224 612 34 75 79",
    email: "mamadoubayoula240@gmail.com",
    socials: [
      { name: 'GitHub', url: 'https://github.com/YoulaMamadouba', icon: 'Github' },
      // { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jeanos-ouamouno-183a09356/', icon: 'Linkedin' },
      // { name: 'Behance', url: 'https://behance.net/example', icon: 'Behance' },
      { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100086278847241', icon: 'Facebook' },
      { name: 'Mail', url: 'mailto:mamadoubayoula240@gmail.com', icon: 'Mail' },
    ],
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
                  <LucideIcons.Phone className="h-5 w-5 text-[#3B82F6]" />
                  {currentMember.phone}
                </span>
                <div className="flex gap-4 mt-2">
                  {currentMember.socials.map((social, index) => {
                    const IconComponent = LucideIcons[social.icon] as React.ElementType;
                    return (
                      <motion.a
                        key={`${social.name}-${index}`}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        title={social.name}
                        aria-label={`${social.name} de ${currentMember.name}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </motion.a>
                    );
                  })}
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
            <LucideIcons.ChevronLeft size={28} />
          </motion.button>
          <motion.button
            onClick={next}
            className="p-4 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg hover:shadow-2xl"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <LucideIcons.ChevronRight size={28} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}