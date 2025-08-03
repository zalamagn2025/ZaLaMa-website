"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
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
    role: "Co-fondateur & Gérant",
    description:
      "Fort d'une expertise solide, il dirige la vision stratégique de ZaLaMa. Visionnaire et engagé, il incarne un leadership audacieux et représente une nouvelle génération d'entrepreneurs Guinéens.",
    image: "/images/fassou.webp",
    phone: "+224 627 12 94 79",
    email: "mrgbagan@zalamagn.com",
    socials: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gbagan-fati-haba-6339a3269?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', icon: 'Linkedin' },
      { name: 'Facebook', url: 'https://www.facebook.com/gbagan.haba', icon: 'Facebook' },
      // { name: 'GitHub', url: 'https://github.com/example', icon: 'Github' },
      { name: 'Email', url: 'mailto:mrgbagan@zalamagn.com', icon: 'Mail' },
    ],
  },
  {
    name: "Mory Koulibaly",
    role: "Co-fondateur & Directeur général",
    description:
      "Fort d'une expérience technique acquise à travers des projets innovants tels que Kambily et Findaara, il dirige ZaLaMa avec rigueur et vision. Aujourd'hui, il fait partie de cette nouvelle génération qui construit activement l'avenir du digital en Guinée.",
    image: "/images/mory.webp",
    phone: "+224 625 21 21 15",
    email: "mrkoulibaly@zalamagn.com",
    socials: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mory-koulibaly-76005a324/?originalSubdomain=gn', icon: 'Linkedin' },
      { name: 'GitHub', url: 'https://github.com/Morymirco', icon: 'Github' },
      { name: 'Portfolio', url: 'https://www.morykoulibaly.me/', icon: 'BriefcaseBusiness' },
      { name: 'Mail', url: 'mailto:mrkoulibaly@zalamagn.com', icon: 'Mail' },
    ],
  },
  {
    name: "Karfalla Diaby",
    role: "Co-Fontdateur & Directeur des Opérations",
    description:
      "Designer, developpeur, stratège opérationnel et créateur de solutions, il transforme les idées en produits concrets. À la croisée du design, de la tech et de l'organisation, il pilote les opérations avec une vision claire : construire des projets utiles, agiles et profondément ancrés dans la réalité Guinéenne.",
    image: "/images/karfalladiaby.webp",
    phone: "+224 628 77 45 73",
    email: "mrdiaby@zalamagn.com",
    socials: [
      { name: 'GitHub', url: 'https://github.com/KarfallaDiaby', icon: 'Github' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/karfalla-diaby-75bb66217/', icon: 'Linkedin' },
      // { name: 'Behance', url: 'https://behance.net/example', icon: 'Behance' },
      { name: 'Facebook', url: 'https://www.facebook.com/karfalla.diaby.18/', icon: 'Facebook' },
      { name: 'Mail', url: 'mailto:mrdiaby@zalamagn.com', icon: 'Mail' },
    ],
  },
  {
    name: "Jean Keloua Ouamouno",
    role: "Cofondateur & Développeur",
    description:
      "Conçoit des solutions web et mobiles robustes, centrées sur l'impact et la performance. Expert en Symfony, Laravel, Next.js, Django et Expo, il allie maîtrise technique et vision stratégique.Chez Zalama, il contribue activement à l'innovation numérique en Guinée...",
    image: "/images/jeanos.webp",
    phone: "+224 620 32 79 06",
    email: "mrouamouno@zalamagn.com",
    socials: [
      { name: 'GitHub', url: 'https://github.com/Jeanos224', icon: 'Github' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jeanos-ouamouno-183a09356/', icon: 'Linkedin' },
      // { name: 'Behance', url: 'https://behance.net/example', icon: 'Behance' },
      { name: 'Facebook', url: 'https://www.facebook.com/jeanos.ouamouno', icon: 'Facebook' },
      { name: 'Mail', url: 'mailto:mrouamouno@zalamagn.com', icon: 'Mail' },
    ],
  },
  {
    name: "Mamadouba Youla",
    role: "Co-fondateur & Responsable Client",
    description:
      "Il garantit une expérience client exceptionnelle, en créant des liens forts avec la communauté Zalama. Expert en développement web et mobile, passionné par l'intelligence artificielle, il incarne la synergie entre la technologie et la relation client au sein de Zalama.",
    image: "/images/youla.webp",
    phone: "+224 612 34 75 79",
    email: "mryoula@zalamagn.com",
    socials: [
      { name: 'GitHub', url: 'https://github.com/YoulaMamadouba', icon: 'Github' },
      // { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jeanos-ouamouno-183a09356/', icon: 'Linkedin' },
      // { name: 'Behance', url: 'https://behance.net/example', icon: 'Behance' },
      { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100086278847241', icon: 'Facebook' },
      { name: 'Mail', url: 'mailto:mryoula@zalamagn.com', icon: 'Mail' },
    ],
  },
];

export default function TeamSection() {
  return (
    <section className="relative w-full py-16">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .zalama-font {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="zalama-font text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent tracking-tight leading-tight text-center">
            Notre Équipe
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full mx-auto" />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-[#111827]/80 border border-[#3B82F6]/30 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Image Block */}
              <div className="relative w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={500}
                  className="w-full h-auto object-contain 
                     sm:max-h-[22rem] md:max-h-[26rem] lg:max-h-[26rem] xl:max-h-[26rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/30 to-transparent pointer-events-none" />
              </div>

              {/* Info Block */}
              <div className="p-6">
                <h3 className="zalama-font text-xl sm:text-2xl font-semibold text-white">
                  {member.name}
                </h3>
                <p className="zalama-font text-[#3B82F6] text-lg mt-1">
                  {member.role}
                </p>
                <p className="zalama-font text-gray-300 mt-3 text-base">
                  {member.description}
                </p>
                <motion.div
                  className="mt-4 flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="flex items-center gap-2 text-gray-300">
                    <LucideIcons.Phone className="h-5 w-5 text-[#3B82F6]" />
                    {member.phone}
                  </span>
                  <div className="flex gap-4 mt-2">
                    {member.socials.map((social, socialIndex) => {
                      const IconComponent = LucideIcons[social.icon] as React.ElementType;
                      return (
                        <motion.a
                          key={`${social.name}-${socialIndex}`}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          title={social.name}
                          aria-label={`${social.name} de ${member.name}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
