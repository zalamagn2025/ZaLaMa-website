"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { IconHeart, IconShare, IconMessage, IconPhone, IconShoppingCart, IconX, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
// Plus besoin de Vibrant, on utilise l'image directement

// Interface pour les données de campagne marketing
interface MarketingCampaign {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  phone?: string;
  price?: string;
  category: string;
  employeeName: string;
  employeeAvatar?: string;
  likes: number;
  views: number;
  isLiked?: boolean;
}

export function AdCarousel() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState('');
  
  // Données de campagnes marketing (en attendant l'API)
  const MARKETING_CAMPAIGNS: MarketingCampaign[] = [
    {
      id: "1",
      title: "Services de Coiffure Premium",
      description: "Coiffure moderne, coupe, coloration et soins capillaires. Rendez-vous disponibles tous les jours.",
      image: "/images/pub1.jpg",
      phone: "+225 07 12 34 56 78",
      price: "À partir de 5,000 FCFA",
      category: "Beauté",
      employeeName: "Fatou Diallo",
      employeeAvatar: "/images/avatar1.jpg",
      likes: 24,
      views: 156,
      isLiked: false
    },
    {
      id: "2", 
      title: "Restaurant Le Délicieux",
      description: "Cuisine locale authentique, plats traditionnels et modernes. Livraison à domicile disponible.",
      image: "/images/pub3.jpg",
      phone: "+225 05 98 76 54 32",
      price: "Menu à partir de 3,500 FCFA",
      category: "Restauration",
      employeeName: "Moussa Traoré",
      employeeAvatar: "/images/avatar2.jpg",
      likes: 42,
      views: 289,
      isLiked: true
    },
    {
      id: "3",
      title: "Cours de Guitare à Domicile",
      description: "Apprenez la guitare avec un professeur expérimenté. Cours particuliers pour tous niveaux.",
      image: "/images/pub2.jpg",
      phone: "+225 01 23 45 67 89",
      price: "10,000 FCFA/heure",
      category: "Éducation",
      employeeName: "Aïcha Koné",
      employeeAvatar: "/images/avatar3.jpg",
      likes: 18,
      views: 98,
      isLiked: false
    }
  ];

  // Vérification du montage côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNextAd = useCallback(() => {
    setCurrentAdIndex((prev) => (prev + 1) % MARKETING_CAMPAIGNS.length);
  }, [MARKETING_CAMPAIGNS.length]);

  useEffect(() => {
    // Ne s'exécute que côté client
    if (isMounted) {
      const interval = setInterval(handleNextAd, 5000);
      return () => clearInterval(interval);
    }
  }, [handleNextAd, isMounted]);

  // Défilement automatique dans le modal Stories avec barre de progression
  useEffect(() => {
    if (isModalOpen) {
      // Réinitialiser la progression quand on change de story
      setProgress(0);
      
      // Animation de la barre de progression
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Passer à la story suivante en ordre
            setCurrentStoryIndex((current) => {
              const nextIndex = current + 1;
              return nextIndex >= MARKETING_CAMPAIGNS.length ? 0 : nextIndex;
            });
            return 0;
          }
          return prev + 100 / 80; // 80 updates pour 8 secondes (8000ms / 100ms)
        });
      }, 100); // Mise à jour toutes les 100ms pour une animation fluide

      return () => clearInterval(progressInterval);
    }
  }, [isModalOpen, currentStoryIndex, MARKETING_CAMPAIGNS.length]);

  // Gestion de l'ouverture du modal
  const handleCarouselClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 AdCarousel clicked!');
    setCurrentStoryIndex(currentAdIndex);
    setIsModalOpen(true);
  };

  // Gestion des gestes pour le modal
  const handlePan = (event: any, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold) {
      // Swipe droite - story précédente
      setCurrentStoryIndex((prev) => 
        prev > 0 ? prev - 1 : MARKETING_CAMPAIGNS.length - 1
      );
    } else if (info.offset.x < -threshold) {
      // Swipe gauche - story suivante
      setCurrentStoryIndex((prev) => 
        prev < MARKETING_CAMPAIGNS.length - 1 ? prev + 1 : 0
      );
    }
  };

  // Actions sur les campagnes
  const handleLike = (campaignId: string) => {
    // Logique de like - à connecter avec l'API
    console.log(`Liked campaign ${campaignId}`);
  };

  const handleShare = (campaign: MarketingCampaign) => {
    // Logique de partage
    console.log(`Sharing campaign ${campaign.id}`);
  };

  const handleContact = (phone: string) => {
    // Ouvrir WhatsApp ou appeler
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
  };

  // Mettre à jour l'image de fond quand l'image change
  useEffect(() => {
    if (isModalOpen && MARKETING_CAMPAIGNS[currentStoryIndex]) {
      setCurrentBackgroundImage(MARKETING_CAMPAIGNS[currentStoryIndex].image);
    }
  }, [isModalOpen, currentStoryIndex]);

  // Pendant le SSR ou avant le montage
  if (!isMounted) {
    return (
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-gray-800/50">
        {/* Placeholder pendant le chargement */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-48 md:h-64 rounded-lg shadow-lg overflow-hidden" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Carousel Principal */}
      <div 
        className="absolute inset-0 z-[15] w-full h-full overflow-hidden cursor-pointer"
        onClick={handleCarouselClick}
      >
        {MARKETING_CAMPAIGNS.map((campaign, index) => (
          <motion.div
            key={`${campaign.id}-${index}`}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentAdIndex ? 1 : 0,
              transition: { duration: 1 }
            }}
          >
            {/* Fond flouté */}
            <Image
              src={campaign.image}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="object-cover scale-110 filter blur-2xl brightness-75"
              quality={50}
            />
            {/* Image principale */}
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              sizes="50vw"
              className="object-contain"
              priority={true}
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              onError={(e) => {
                console.error(`Erreur de chargement: ${campaign.image}`);
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Overlay avec informations */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </motion.div>
        ))}
      </div>

      {/* Modal Stories */}
      <AnimatePresence>
        {isModalOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[9999] overflow-hidden bg-black"
             onClick={() => setIsModalOpen(false)}
           >
             {/* Fond avec image floutée style Spotify */}
             <div className="absolute inset-0">
               {currentBackgroundImage ? (
                 <Image
                   src={currentBackgroundImage}
                   alt="Background"
                   fill
                   className="object-cover scale-110"
                   style={{
                     filter: 'blur(40px) brightness(0.4) saturate(1.2)',
                     transform: 'scale(1.1)'
                   }}
                   priority
                 />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
               )}
               {/* Overlay sombre pour améliorer la lisibilité */}
               <div className="absolute inset-0 bg-black/40" />
             </div>
             <motion.div
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="relative w-full h-full"
               onClick={(e) => e.stopPropagation()}
             >
              {MARKETING_CAMPAIGNS[currentStoryIndex] && (
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onPan={handlePan}
                  className="relative w-full h-full"
                >
                   {/* Image de fond */}
                   <Image
                     src={MARKETING_CAMPAIGNS[currentStoryIndex].image}
                     alt={MARKETING_CAMPAIGNS[currentStoryIndex].title}
                     fill
                     className="object-contain"
                     priority
                   />
                  
                   {/* Overlay subtil pour améliorer la lisibilité */}
                   <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                  
                  {/* Header avec profil */}
                  <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                          <Image
                            src={MARKETING_CAMPAIGNS[currentStoryIndex].employeeAvatar || "/images/default-avatar.jpg"}
                            alt={MARKETING_CAMPAIGNS[currentStoryIndex].employeeName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-sm">
                            {MARKETING_CAMPAIGNS[currentStoryIndex].employeeName}
                          </h3>
                          <p className="text-white/70 text-xs">
                            {MARKETING_CAMPAIGNS[currentStoryIndex].category}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <IconX className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                   {/* Navigation */}
                   <button
                     onClick={() => {
                       setCurrentStoryIndex(prev => {
                         const prevIndex = prev - 1;
                         return prevIndex < 0 ? MARKETING_CAMPAIGNS.length - 1 : prevIndex;
                       });
                       setProgress(0); // Réinitialiser la progression
                     }}
                     className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10"
                   >
                     <IconChevronLeft className="w-6 h-6 text-white" />
                   </button>
                   
                   <button
                     onClick={() => {
                       setCurrentStoryIndex(prev => {
                         const nextIndex = prev + 1;
                         return nextIndex >= MARKETING_CAMPAIGNS.length ? 0 : nextIndex;
                       });
                       setProgress(0); // Réinitialiser la progression
                     }}
                     className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10"
                   >
                     <IconChevronRight className="w-6 h-6 text-white" />
                   </button>

                  {/* Contenu principal */}
                  <div className="absolute bottom-20 left-4 right-4 z-10">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                      <h2 className="text-white text-xl font-bold mb-2">
                        {MARKETING_CAMPAIGNS[currentStoryIndex].title}
                      </h2>
                      <p className="text-white/90 text-sm mb-3 leading-relaxed">
                        {MARKETING_CAMPAIGNS[currentStoryIndex].description}
                      </p>
                      {MARKETING_CAMPAIGNS[currentStoryIndex].price && (
                        <p className="text-[#FF671E] font-semibold text-sm mb-3">
                          {MARKETING_CAMPAIGNS[currentStoryIndex].price}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLike(MARKETING_CAMPAIGNS[currentStoryIndex].id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all ${
                          MARKETING_CAMPAIGNS[currentStoryIndex].isLiked 
                            ? 'bg-red-500/80 text-white' 
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        <IconHeart 
                          className={`w-5 h-5 ${
                            MARKETING_CAMPAIGNS[currentStoryIndex].isLiked ? 'fill-current' : ''
                          }`} 
                        />
                        <span className="text-sm font-medium">
                          {MARKETING_CAMPAIGNS[currentStoryIndex].likes}
                        </span>
                      </button>

                      <button
                        onClick={() => handleShare(MARKETING_CAMPAIGNS[currentStoryIndex])}
                        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white"
                      >
                        <IconShare className="w-5 h-5" />
                        <span className="text-sm font-medium">Partager</span>
                      </button>

                      {MARKETING_CAMPAIGNS[currentStoryIndex].phone && (
                        <button
                          onClick={() => handleContact(MARKETING_CAMPAIGNS[currentStoryIndex].phone!)}
                          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#FF671E]/80 backdrop-blur-sm text-white flex-1 justify-center"
                        >
                          <IconPhone className="w-5 h-5" />
                          <span className="text-sm font-medium">Contacter</span>
                        </button>
                      )}
                    </div>
                  </div>

                   {/* Indicateur de progression animé */}
                   <div className="absolute top-16 left-4 right-4 flex space-x-2">
                     {MARKETING_CAMPAIGNS.map((_, index) => (
                       <div
                         key={index}
                         className="h-1 rounded-full bg-white/30 overflow-hidden"
                         style={{ width: `${100 / MARKETING_CAMPAIGNS.length}%` }}
                       >
                         {index === currentStoryIndex && (
                           <motion.div
                             className="h-full bg-white rounded-full"
                             initial={{ width: "0%" }}
                             animate={{ width: `${progress}%` }}
                             transition={{ duration: 0.1, ease: "linear" }}
                           />
                         )}
                         {index < currentStoryIndex && (
                           <div className="h-full bg-white rounded-full" />
                         )}
                       </div>
                     ))}
                   </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}