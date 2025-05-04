"use client";
import { TracingBeam } from "@/components/common/tracing-beam";
import React from "react";

import { twMerge } from "tailwind-merge";

export function TracingBeamDemo() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className="mb-10">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>

            <p className={twMerge("text-xl mb-4")}>
              {item.title}
            </p>

            <div className="text-sm  prose prose-sm dark:prose-invert">
              {item?.image && (
                <img
                  src={item.image}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-10 object-cover"
                />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const dummyContent = [
  {
    title: "Présentation de ZALAMA",
    description: (
      <>
        <p>
            ZaLaMa est une FinTech guinéenne innovante à fort impact social. Elle propose aux salariés,
            pensionnés et étudiants les services d&apos;avance sur salaire, de prêt P2P, de paiement de salaire et
            de conseil financier via une intelligence artificielle locale et sur mesure. 
        </p>
        <p>
            ZaLaMa répond aux besoins de trésorerie immédiate, facilite le paiement des non-bancarisés et
            l'accès aux crédits spéciaux, tout en favorisant une meilleure gestion des finances personnelles.
        </p>
      </>
    ),
    badge: "Intro",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=3540&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Notre mission sociale",
    description: (
      <>
        <p>
            ZaLaMa vise à renforcer l'inclusion financière et l'autonomie économique en Guinée, en
            offrant aux étudiants, salariés et pensionnaires un accès simple, rapide et sécurisé à des
            services financiers adaptés à leurs besoins. ZaLaMa lutte contre le surendettement, encourage
            la gestion responsable des revenus et soutient l’éducation financière. Notre mission est de
            permettre à chacun de mieux vivre le quotidien et de construire un avenir financier plus stable
            et digne.
        </p>
      </>
    ),
    badge: "Mission",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=3506&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
