'use client'
import React from 'react'
import { Header } from '../../layout/Header'
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
            <Header />
            <main className="overflow-x-hidden">
                <section>
                    <Herodemo
                        title="Le bien-être financier de vos employés, un leviers de performance !"
                        subtitle={
                          <ul className="space-y-1.5 text-sm sm:text-base text-left">
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Réduisez le stress et les soucis financiers de vos employés</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Réduisez les inégalités d&apos;accès au financement en soutenant leurs projets</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Améliorez leur bien-être financier et la gestion de leurs dépenses</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-xs">•</span>
                              <span>Réduisez les risques de surendettement</span>
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
                        imageSrc="https://i.ibb.co.com/gbG9BjTV/1-removebg-preview.png" // Example image
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

