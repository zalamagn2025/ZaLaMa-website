import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, FileText, Building2, Calculator, Award, FileSignature, Wallet } from 'lucide-react';

const documents = [
  {
    name: "RCCM (Registre de Commerce)",
    description: "Document officiel d'enregistrement de l'entreprise",
    icon: Building2,
    required: true
  },
  {
    name: "NIF (Numéro d'Identification Fiscale)",
    description: "Identifiant fiscal unique de l'entreprise",
    icon: Calculator,
    required: true
  },
  {
    name: "Attestation de non-redevance",
    description: "Attestation de bonne conduite fiscale",
    icon: Award,
    required: false
  },
  {
    name: "Lettre d'engagement",
    description: "Engagement à coopérer avec ZaLaMa",
    icon: FileSignature,
    required: true
  },
  {
    name: "Preuve de capacité de remboursement",
    description: "Relevé bancaire, fiche de paie globale ou attestation comptable",
    icon: Wallet,
    required: true
  }
];

const note = `Tous les documents doivent être fournis en format numérique. Les documents marqués comme "Requis" sont obligatoires pour le traitement de votre dossier.`;

export default function RequiredDocuments() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center mb-12">
          <h2 className="section-title text-center">Dossier de Candidature</h2>
          <div className="mt-2 flex justify-center items-center">
            <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
          </div>
          <p className="mt-4 text-center text-gray-600 max-w-2xl">
            Documents requis pour compléter votre dossier de candidature
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid gap-6">
              {documents.map((doc, index) => {
                const IconComponent = doc.icon;
                
                return (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-[#10059F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-[#10059F]" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doc.name}
                        </h3>
                        {doc.required && (
                          <span className="px-2 py-1 text-xs font-medium text-[#10059F] bg-[#10059F]/10 rounded-full">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-gray-600">
                        {doc.description}
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className={`w-5 h-5 ${doc.required ? 'text-[#10059F]' : 'text-gray-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-[#10059F]/5 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileText className="w-6 h-6 text-[#10059F] mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Note importante</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    {note}
                  </p>
              </div>
            </div>
      </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}