"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function AdCarousel() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Déclaré comme constante pour éviter les recréations
  const ADS = [
    { src: "/images/banner.jpg", alt: "Publicité Zalama" },
    { src: "/images/ad4.jpg", alt: "Promotion spéciale" },
    { src: "/images/ad1.jpg", alt: "Nouveaux produits" }
  ];

  // Vérification du montage côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNextAd = useCallback(() => {
    setCurrentAdIndex((prev) => (prev + 1) % ADS.length);
  }, [ADS.length]);

  useEffect(() => {
    // Ne s'exécute que côté client
    if (isMounted) {
      const interval = setInterval(handleNextAd, 5000);
      return () => clearInterval(interval);
    }
  }, [handleNextAd, isMounted]);

  // Pendant le SSR ou avant le montage
  if (!isMounted) {
    return (
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-gray-800/50">
        {/* Placeholder pendant le chargement */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-700 w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
      {ADS.map((ad, index) => (
        <motion.div
          key={`${ad.src}-${index}`} // Clé plus unique
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentAdIndex ? 1 : 0,
            transition: { duration: 1 }
          }}
        >
          <Image
            src={ad.src}
            alt={ad.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true} // ✅ Priority pour toutes les images du carrousel
            quality={85} // ✅ Qualité optimisée
            placeholder="blur" // ✅ Placeholder pour améliorer l'UX
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onError={(e) => {
              console.error(`Erreur de chargement: ${ad.src}`);
              e.currentTarget.style.display = 'none';
            }}
            onLoadingComplete={() => console.log(`Image ${ad.src} chargée`)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
        </motion.div>
      ))}
    </div>
  );
}