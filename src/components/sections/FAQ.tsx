import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Comment fonctionne Zalama ?",
    answer: "Zalama est une plateforme qui permet aux entreprises de gérer facilement leurs avances sur salaire. Notre processus est simple : inscription, vérification et activation de votre compte pour commencer à utiliser nos services."
  },
  {
    question: "Quels sont les critères d'éligibilité ?",
    answer: "Pour être éligible, votre entreprise doit être légalement enregistrée, avoir une activité d'au moins 6 mois, et respecter nos conditions générales d'utilisation."
  },
  {
    question: "Combien coûtent les services de Zalama ?",
    answer: "Nos tarifs sont transparents et compétitifs. Le coût exact dépend du montant de l'avance et de la durée. Contactez-nous pour obtenir un devis personnalisé."
  },
  {
    question: "Quel est le délai de traitement d'une demande ?",
    answer: "Le traitement d'une demande d'avance sur salaire est généralement effectué en moins de 24 heures après la validation de tous les documents requis."
  },
  {
    question: "Comment est assurée la sécurité des données ?",
    answer: "Nous utilisons des protocoles de sécurité avancés pour protéger vos données. Toutes les informations sont cryptées et stockées de manière sécurisée conformément aux normes en vigueur."
  }
];

export default function FAQ() {
  return (
    <section className="bg-gradient-to-b form-white to-[#D2DCFF] py-30 overflow-x-clip">
      <div className="container px-6 py-16 mx-auto lg:px-28">
        <div className="flex flex-col justify-center items-center mb-12">
          <h2 className="section-title text-center">Questions Fréquentes</h2>
          <div className="mt-2 flex justify-center items-center">
            <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
          </div>
          <p className="mt-4 text-center text-gray-600 max-w-2xl">
            Trouvez rapidement des réponses à vos questions sur nos services d'avance sur salaire
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Vous ne trouvez pas la réponse que vous cherchez ?
          </p>
          <a 
            href="/contact" 
            className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#10059F] hover:bg-[#0d0480] transition-colors duration-200"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
}