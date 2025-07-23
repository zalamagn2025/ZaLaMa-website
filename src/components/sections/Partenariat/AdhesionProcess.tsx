"use client";

import React from "react";
import {
  UserPlus,
  FileText,
  ShieldCheck,
  Signature,
  Users,
  Rocket,
  BarChart2,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    color: "primary",
    icon: <UserPlus className="w-6 h-6 text-primary" />,
    title: "Étape 1 : Prise de contact",
    content: (
      <ul className="list-disc list-inside">
        <li>L&apos;entreprise manifeste son intérêt via le site web, un appel ou une rencontre physique</li>
        <li>L&apos;entreprise remplit le formulaire de demande de partenariat via le site.</li>
      </ul>
    ),
  },
  // {
  //   color: "success",
  //   icon: <FileText className="w-6 h-6 text-success" />,
  //   title: "Étape 2 : Dossier de candidature",
  //   content: (
  //     <ul className="list-disc list-inside">
  //       <li>RCCM (Registre de Commerce)</li>
  //       <li>NIF (Numéro d&apos;identification fiscale)</li>
  //       <li>Attestation de non-redevance (si disponible)</li>
  //       <li>Lettre d&apos;engagement à coopérer</li>
  //       <li>Information sur les employés (Nombre, masse salariale, nombre de contrat CDI & CDD)</li>
  //     </ul>
  //   ),
  // },
  {
    color: "warning",
    icon: <ShieldCheck className="w-6 h-6 text-warning" />,
    title: "Étape 2 : Analyse et validation",
    content: <p>ZaLaMa analyse la viabilité de l&apos;entreprise. En cas de validation, un contrat est proposé.</p>,
  },
  {
    color: "destructive",
    icon: <Signature className="w-6 h-6 text-destructive" />,
    title: "Étape 3 : Partenariat",
    content: (
      <ul className="list-disc list-inside">
        <li>Signature du contrat</li>
        <li>Paiement des frais d&apos;adhésion : 1 000 000 GNF</li>
      </ul>
    ),
  },
  {
    color: "blue",
    icon: <Users className="w-6 h-6 text-blue" />,
    title: "Étape 4 : Intégration et formation",
    content: (
      <ul className="list-disc list-inside">
        <li>Transmission des informations des bénéficiaires</li>
        <li>Création de comptes utilisateurs</li>
        <li>Formation RH et accompagnement</li>
      </ul>
    ),
  },
  {
    color: "primary",
    icon: <Rocket className="w-6 h-6 text-primary" />,
    title: "Étape 6 : Activation des services",
    content: (
      <ul className="list-disc list-inside">
        <li>Demandes via l&apos;application ou site web ZaLaMa</li>
        <li>Gestion via le tableau de bord</li>
      </ul>
    ),
  },
  {
    color: "success",
    icon: <BarChart2 className="w-6 h-6 text-success" />,
    title: "Étape 7 : Suivi et évaluation continue",
    content: (
      <ul className="list-disc list-inside">
        <li>Suivi mensuel</li>
        <li>Support et ajustements</li>
      </ul>
    ),
  },
];


const AdhesionProcess = () => {
  return (
    <section className="relative py-0 overflow-x-clip">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-14 mx-auto max-w-3xl text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-block">
            Processus d&apos;adhésion
          </h2>
          <p className="text-base sm:text-lg text-zalama-text-secondary max-w-[700px] mx-auto">
            Découvrez comment devenir partenaire de ZaLaMa
          </p>
        </div>
        <div className="relative">
          {/* Timeline verticale centrale */}
          <div className="hidden md:block absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-[var(--zalama-primary)]/20 via-[var(--zalama-blue)]/10 to-[var(--zalama-success)]/20 -translate-x-1/2 z-0" />
          <ol className="space-y-16 relative z-10">
            {steps.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: [0.39, 0.575, 0.565, 1], delay: i * 0.08 }}
                className={`group flex flex-col md:flex-row items-center md:items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Icone étape */}
                <div className="flex flex-col items-center w-full md:w-1/2">
                  <div className="rounded-full bg-[var(--zalama-bg-light)] dark:bg-[var(--zalama-bg-dark)] shadow-lg p-4 border-4 border-[var(--zalama-primary)] dark:border-[var(--zalama-blue)] relative z-10 transition-all duration-300 group-hover:scale-105">
                    {step.icon}
                  </div>
                </div>
                {/* Card étape */}
                <div className="flex flex-col h-full p-6 rounded-2xl bg-[var(--zalama-card)] border border-[var(--zalama-border)] shadow-md hover:shadow-xl transition-shadow duration-300 w-full md:w-1/2">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 text-[var(--zalama-primary)] dark:text-[var(--zalama-blue)]">
                    {step.title}
                  </h3>
                  <div className="text-base text-[var(--zalama-text)] dark:text-[var(--zalama-gray)]">
                    {step.content}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default AdhesionProcess;