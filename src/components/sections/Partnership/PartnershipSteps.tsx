"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  PhoneCall,
  FileText,
  CheckCircle2,
  PenLine,
  Users,
  Power,
  LineChart,
  Building2,
  Calculator,
  Award,
  FileSignature,
  Wallet,
} from 'lucide-react';

const partnershipSteps = [
  {
    number: 1,
    title: "Prise de contact",
    icon: PhoneCall,
    description: [
      "L'entreprise manifeste son intérêt via le site, appel ou rencontre physique.",
      "ZaLaMa présente la solution, ses avantages et son impact social."
    ]
  },
  {
    number: 2,
    title: "Dossier de candidature",
    icon: FileText,
    description: ["L'entreprise soumet un dossier incluant :"],
    documents: [
      {
        name: "RCCM (Registre de Commerce)",
        icon: Building2
      },
      {
        name: "NIF (Numéro d'Identification Fiscale)",
        icon: Calculator
      },
      {
        name: "Attestation de non-redevance ou de bonne conduite fiscale",
        icon: Award,
        optional: true
      },
      {
        name: "Lettre d'engagement à coopérer avec ZaLaMa",
        icon: FileSignature
      },
      {
        name: "Preuve de capacité à rembourser les avances",
        icon: Wallet,
        details: "(relevé bancaire, fiche de paie globale ou attestation comptable)"
      }
    ]
  },
  {
    number: 3,
    title: "Analyse et validation",
    icon: CheckCircle2,
    description: [
      "ZaLaMa étudie la viabilité et la fiabilité de l&apos;entreprise.",
      "En cas de validation, un contrat de partenariat est proposé."
    ]
  },
  {
    number: 4,
    title: "Signature du contrat et paiement",
    icon: PenLine,
    description: [
      "Signature de la convention de partenariat",
      "Paiement des frais d'adhésion de 1 000 000 GNF"
    ]
  },
  {
    number: 5,
    title: "Intégration et formation",
    icon: Users,
    description: [
      "L'entreprise transmet la liste des bénéficiaires.",
      "Création de comptes utilisateurs.",
      "Formation des RH et accompagnement à la prise en main de l'outil."
    ]
  },
  {
    number: 6,
    title: "Activation des services",
    icon: Power,
    description: [
      "Les employés peuvent demander des avances, prêts P2P ou bénéficier de conseils via l'app ZaLaMa.",
      "L'entreprise valide ou suit les opérations via son tableau de bord sécurisé."
    ]
  },
  {
    number: 7,
    title: "Suivi et évaluation continue",
    icon: LineChart,
    description: [
      "ZaLaMa assure un suivi mensuel des opérations.",
      "Support permanent et réajustement selon les besoins de l'entreprise."
    ]
  }
];

export default function PartnershipSteps() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center mb-12">
          <h2 className="section-title text-center">Processus d&apos;adhésion</h2>
          <div className="mt-2 flex justify-center items-center">
            <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
          </div>
          <p className="mt-4 text-center text-gray-600 max-w-2xl">
            Découvrez les étapes pour devenir client de ZaLaMa
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {partnershipSteps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <Card 
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#10059F]/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-[#10059F]" />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-[#10059F] font-semibold">
                          Étape {step.number}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {step.description.map((desc, idx) => (
                          <p key={idx} className="text-gray-600">
                            {desc}
                          </p>
                        ))}

                        {step.documents && (
                          <div className="mt-4 space-y-3">
                            {step.documents.map((doc, idx) => {
                              const DocIcon = doc.icon;
                              return (
                                <div key={idx} className="flex items-center space-x-3">
                                  <DocIcon className="w-5 h-5 text-gray-500" />
                                  <span className="text-gray-700">
                                    {doc.name}
                                    {doc.optional && (
                                      <span className="text-gray-500 text-sm ml-2">
                                        (si disponible)
                                      </span>
                                    )}
                                    {doc.details && (
                                      <span className="text-gray-500 text-sm ml-2">
                                        {doc.details}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Prêt à commencer votre parcours avec ZaLaMa ?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#10059F] hover:bg-[#0d0480] transition-colors duration-200"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
}