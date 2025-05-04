import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PhoneCall, Globe, Users, Presentation } from 'lucide-react';

const steps = [
  {
    title: "Prise de contact",
    description: "L'entreprise manifeste son intérêt via le site, appel ou rencontre physique.",
    icon: PhoneCall,
    channels: [
      { name: "Site web", icon: Globe },
      { name: "Appel téléphonique", icon: PhoneCall },
      { name: "Rencontre physique", icon: Users }
    ]
  },
  {
    title: "Présentation de la solution",
    description: "ZaLaMa présente la solution, ses avantages et son impact social.",
    icon: Presentation,
    highlights: [
      "Solution innovante",
      "Avantages compétitifs",
      "Impact social"
    ]
  }
];

export default function ContactSteps() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center mb-12">
          <h2 className="section-title text-center">Processus de Partenariat</h2>
          <div className="mt-2 flex justify-center items-center">
            <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
          </div>
          <p className="mt-4 text-center text-gray-600 max-w-2xl">
            Découvrez les premières étapes pour devenir partenaire de ZaLaMa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-[#10059F]/10 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-[#10059F]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Étape {index + 1}</h3>
                      <p className="text-[#10059F] font-medium">{step.title}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{step.description}</p>

                  {step.channels && (
                    <div className="space-y-3">
                      <p className="font-medium text-gray-900">Canaux de contact :</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {step.channels.map((channel, idx) => {
                          const ChannelIcon = channel.icon;
                          return (
                            <div key={idx} className="flex items-center space-x-2 text-gray-600">
                              <ChannelIcon className="w-5 h-5" />
                              <span>{channel.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step.highlights && (
                    <div className="space-y-3">
                      <p className="font-medium text-gray-900">Points clés :</p>
                      <ul className="list-disc list-inside space-y-2">
                        {step.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-gray-600">{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}