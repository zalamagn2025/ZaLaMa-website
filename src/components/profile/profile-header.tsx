"use client";

import { IconSettings } from "@tabler/icons-react";
import { useEmployeeAuth } from "../../contexts/EmployeeAuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSettings } from "./profile-settings";
import { AdCarousel } from "./AdCarousel";
import { NotificationDropdown } from "../notifications/NotificationDropdown";
import { UserWithEmployeData } from "@/types/employe";
import { Partenaire } from "@/types/partenaire";
import { User, Mail, Phone, MapPin, Briefcase, Building, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  user: UserWithEmployeData;
  entreprise?: Partenaire;
}

export function ProfileHeader({ user, entreprise }: ProfileHeaderProps) {
  const { employee } = useEmployeeAuth(); // ✅ Utiliser employee du nouveau contexte
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  // ✅ Utiliser les données du contexte EmployeeAuthContext en priorité, sinon fallback sur les props
  const displayUser = (employee || user) as any;
  
  // Construire le nom complet
  const getDisplayName = () => {
    if (!displayUser) return "Utilisateur";
  
    // Priorité : nomComplet > (prenom + nom) > nom > prenom > "Utilisateur"
    if ('nomComplet' in displayUser && displayUser.nomComplet) {
      return displayUser.nomComplet;
    }
  
    if (displayUser.prenom && displayUser.nom) {
      return `${displayUser.prenom} ${displayUser.nom}`;
    }
  
    if (displayUser.nom) {
      return displayUser.nom;
    }
  
    if (displayUser.prenom) {
      return displayUser.prenom;
    }
  
    return "Utilisateur";
  };
  

  const displayName = getDisplayName();
  const displayEmail = displayUser?.email || 'Email non disponible';
  // ✅ Utiliser photo_url avec priorité : contexte AuthContext > user props
  const [displayPhotoURL, setDisplayPhotoURL] = useState<string | undefined>(employee?.photo_url || displayUser?.photo_url || (user && 'photoURL' in user ? user.photoURL : undefined));
  const displayInitial = displayName.charAt(0).toUpperCase();
  
  // Function to format the matricule
  const formatMatricule = (matricule: string | null | undefined) => {
    if (!matricule) return ''; // Return empty string if no matricule
    // If the matricule already contains "Matricule:" or "Mat:", return it as is
    if (matricule.includes('Matricule:') || matricule.includes('Mat:')) {
      return matricule;
    }
    // Otherwise, add the "Matricule:" prefix
    return `Matricule: ${matricule}`;
  };

  const displayMatricule = formatMatricule(displayUser?.matricule);

  // ✅ Mettre à jour l'URL de la photo quand les données changent
  useEffect(() => {
    if (displayUser?.photo_url) {
      setDisplayPhotoURL(displayUser.photo_url);
    }
  }, [displayUser?.photo_url]);

  const handleHomeNavigation = () => {
    router.push("/");
  };

  // Format date safely
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Non défini";
    const date = new Date(dateStr);
    return date.toString() !== "Invalid Date" ? date.toLocaleDateString("fr-FR") : "Date invalide";
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      {/* Nouveau header ultra-transparent avec espace pour publicité */}
      <div className="h-[28rem] md:h-[32rem] relative bg-transparent overflow-hidden">
        {/* Carrousel d'images publicitaires */}
        <AdCarousel />

        {/* Contenu superposé */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Entête avec logo blanc et titre */}
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHomeNavigation}
                aria-label="Retour à l'accueil"
              >
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <Image
                    src="/images/zalama-logo.svg"
                    width={100}
                    height={0}
                    alt="Logo de ZaLaMa"
                    className="h-auto w-24"
                    priority
                  />
                </div>
              </motion.button>
              
            </div>

            {/* Boutons Paramètres et Retour à l'accueil */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 14px rgba(255, 103, 30, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHomeNavigation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-[#FFFFFF] shadow-lg hover:shadow-[#FF671E]/30 transition-all text-sm"
                aria-label="Retour à l'accueil"
              >
                <Home size={20} />
                <span className="sr-only md:not-sr-only">Accueil</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                aria-label="Ouvrir les paramètres"
              >
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <IconSettings className="w-5 h-5 text-[#FFFFFF]" />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Texte publicitaire centré */}
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
              
              
            </motion.div>
          </div>
        </div>

        {/* Effet de vague animé */}
        <motion.div
          className="absolute bottom-0 w-full h-12"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Carte de profil avec fond bleu foncé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#010D3E]/80 dark:bg-gray-800/90 backdrop-blur-sm px-6 pb-6 -mt-12"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Section gauche - Avatar + Infos */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <motion.div className="relative group" whileHover={{ scale: 1.03 }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>

              {displayPhotoURL ? (
                <Image
                  key={`${displayPhotoURL}-${Date.now()}`} // ✅ Key avec timestamp pour forcer le re-render
                  width={96}
                  height={96}
                  src={displayPhotoURL}
                  alt={`Avatar de ${displayName}`}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover relative z-10 shadow-lg"
                  priority={true} // ✅ Priority pour l'image de profil (au-dessus de la ligne de flottaison)
                  quality={85} // ✅ Qualité optimisée
                  placeholder="blur" // ✅ Placeholder pour améliorer l'UX
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  unoptimized={displayPhotoURL?.includes('?t=') || displayPhotoURL?.includes('supabase.co')} // ✅ Désactiver l'optimisation pour les URLs avec cache buster ou Supabase
                  onError={(e) => {
                    console.warn('⚠️ Erreur chargement image:', displayPhotoURL);
                    // Fallback vers l'avatar par défaut en cas d'erreur
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    // Forcer le re-render pour afficher l'avatar par défaut
                    setDisplayPhotoURL(undefined);
                  }}
                  onLoad={(e) => {
                    // Vérifier que l'image s'est bien chargée
                    const target = e.target as HTMLImageElement;
                    if (target.naturalWidth === 0 || target.naturalHeight === 0) {
                      console.warn('⚠️ Image invalide détectée:', displayPhotoURL);
                      target.style.display = 'none';
                      setDisplayPhotoURL(undefined);
                    }
                  }}
                />
              ) : (
                <div
                  key={`avatar-${displayName}`} // ✅ Key unique pour éviter les conflits
                  className="h-24 w-24 rounded-full border-4 border-white bg-gradient-to-br from-[#FF671E] to-[#FF8E53] flex items-center justify-center text-3xl font-bold text-[#FFFFFF] relative z-10 shadow-lg"
                >
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </motion.div>

            {/* Informations utilisateur */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#FFFFFF]">
                {
                  displayName
                }
                </h1>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Actif
                  </motion.div>
                  {displayMatricule && (
                  <motion.div
                    key={displayUser?.matricule}
                    className="z-20 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-[#FFFFFF] text-xs font-bold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1"
                    whileHover={{ scale: 1.1 }}
                  >
                      <span>{displayMatricule}</span>
                  </motion.div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                {displayUser?.partner_info?.company_name && (
                  <div className="flex items-center text-white font-medium bg-white/10 px-3 py-1 rounded-lg">
                    <Building className="mr-2 text-[#FF671E]" />
                    <span>{displayUser.partner_info.company_name}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-300">
                  <Briefcase className="mr-2 text-[#FF671E]" />
                  <span>{displayUser?.poste || ''}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="mr-2 text-[#FF671E]" />
                  <span>{displayUser?.telephone || ''}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="mr-2 text-[#FF671E]" />
                  <span>{displayUser?.adresse || ''}</span>
                </div>
              </div>

              {/* <div className="flex flex-wrap gap-2 pt-1">
                
                <motion.a
                  key={user.email}
                  href={`mailto:${user.email}`}
                  whileHover={{ y: -2 }}
                  className="flex items-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                >
                  <Mail className="mr-1.5 text-[#FF671E]" />
                  <span>{user.email}</span>
                </motion.a>
              </div> */}
            </div>
          </div>

          {/* Section droite - Boutons */}
          <motion.div
            className="flex gap-2 self-start md:self-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <NotificationDropdown />
          </motion.div>
        </div>
      </motion.div>

      {/* Panneau des paramètres */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <ProfileSettings onClose={() => setShowSettings(false)} userData={displayUser} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}