'use client'
import React from 'react'
import { Herodemo } from '../../common/wavey-hero-header'

export function HeroSection() {
    
  const handlePrimaryButtonClick = () => {
    alert("Start Building clicked!");
  };

  const handleSecondaryButtonClick = () => {
    alert("Request a demo clicked!");
  };
    return (
        <>
            <main className="overflow-x-hidden">
                <section>
                    <Herodemo
                        title="Le bien-être financier de vos employés est un levier de performance"
                        subtitle={
                          <ul className="space-y-1.5 text-sm sm:text-base text-left">
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Réduisez leur stress et leur souci financier</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Augmentez leur pouvoir d&apos;achat</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Améliorez leur gestion budgetaire</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Réduisez leur risque de surendettement</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Augmentez leur productivité et fidélisez vos talents</span>
                            </li>
                          </ul>
                        }
                        primaryButtonText="Commencer maintenant"
                        primaryButtonAction={handlePrimaryButtonClick}
                        secondaryButtonText="Nous contacter"
                        secondaryButtonAction={handleSecondaryButtonClick}
                        imageSrc="/images/ZaLaMawebappMockup.png" // Example image
                        waveColor1="rgba(255, 103, 30, 0.30)"
                        waveColor2="rgba(255, 103, 30, 0.50)"
                        waveAmplitude={30}
                        waveSpeedMultiplier={0.005}
                    />
                </section>
            </main>
        </>
    )
}

