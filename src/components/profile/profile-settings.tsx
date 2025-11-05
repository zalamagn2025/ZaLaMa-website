"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEmployeeAuth } from "../../contexts/EmployeeAuthContext";
import { employeeAuthService } from "@/lib/apiEmployeeAuth";
import { 
  IconSettings, 
  IconX, 
  IconLock, 
  IconBell, 
  IconMoon, 
  IconLanguage, 
  IconDeviceMobile,
  IconMail,
  IconShieldCheck,
  IconRefreshAlert,
  IconCheck,
  IconEdit,
  IconLogout,
  IconUser,
  IconCamera
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useProfileImageUpload } from "@/hooks/useProfileImageUpload";

// Interface pour les données utilisateur
interface UserData {
  uid?: string;
  id?: string;
  user_id?: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  nom?: string;
  prenom?: string;
  nomComplet?: string;
  poste?: string;
  telephone?: string | null;
  adresse?: string | null;
  dateEmbauche?: string;
  date_embauche?: string;
  role?: string | null;
  genre?: string;
  type_contrat?: string;
  salaire_net?: number;
  actif?: boolean;
  partner_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Types pour les paramètres de notification
type NotificationChannel = 'email' | 'push' | 'sms';
type SecurityAlertType = 'login' | 'password' | 'device';

interface NotificationPreference {
  channel: NotificationChannel;
  enabled: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface SecurityAlertPreference {
  type: SecurityAlertType;
  enabled: boolean;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export function ProfileSettings({ onClose, userData }: { onClose: () => void; userData?: UserData }) {
  const router = useRouter();
  const pathname = usePathname();

  const { logout, employee, refreshProfile } = useEmployeeAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const { theme, setTheme } = useTheme();
  const [initialSettings, setInitialSettings] = useState({
    language: 'fr',
    darkMode: theme === 'dark',
  });

  // Précharger la page de changement de mot de passe pour réduire la latence de navigation
  useEffect(() => {
    try {
      router.prefetch('/auth/change-password');
    } catch {}
  }, [router]);

  // États pour la modification de l'image de profil
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  // ✅ Nouvel état pour la modal de modification du profil
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  
  // ✅ Utiliser les données du contexte en priorité, sinon les props
  const currentUserData = employee || userData;
  const initialPhotoURL = (currentUserData as any)?.photo_url || (currentUserData as any)?.photoURL || undefined;
  
  // ✅ Passer les données utilisateur au hook
  const {
    avatarFile,
    avatarPreview,
    imageError,
    isUploading,
    handleAvatarChange,
    handleImageUpload,
    resetUpload
  } = useProfileImageUpload(initialPhotoURL, currentUserData);

  const [settings, setSettings] = useState({
    darkMode: theme === 'dark',
    language: 'fr',
    currency: 'XOF',
    notifications: true,
  });

  // ✅ Initialiser les données du profil avec les données actuelles
  const [profileData, setProfileData] = useState({
    nom: currentUserData?.nom || '',
    prenom: currentUserData?.prenom || '',
    telephone: currentUserData?.telephone || '',
    adresse: currentUserData?.adresse || '',
  });

  // ✅ Mettre à jour les données du profil quand les données utilisateur changent
  useEffect(() => {
    if (currentUserData) {
      setProfileData({
        nom: currentUserData.nom || '',
        prenom: currentUserData.prenom || '',
        telephone: currentUserData.telephone || '',
        adresse: currentUserData.adresse || '',
      });
    }
  }, [currentUserData]);

  // ✅ Fonction pour ouvrir la modal de modification du profil
  const handleOpenProfileEdit = () => {
    setShowProfileEditModal(true);
  };

  // ✅ Fonction pour fermer la modal de modification du profil
  const handleCloseProfileEdit = () => {
    setShowProfileEditModal(false);
    // Réinitialiser les données du formulaire avec les données actuelles
    if (currentUserData) {
      setProfileData({
        nom: currentUserData.nom || '',
        prenom: currentUserData.prenom || '',
        telephone: currentUserData.telephone || '',
        adresse: currentUserData.adresse || '',
      });
    }
  };

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    {
      channel: 'email',
      enabled: true,
      label: 'Email',
      description: 'Recevoir les notifications par email',
      icon: <IconMail className="w-5 h-5 text-blue-400" />
    },
    {
      channel: 'push',
      enabled: true,
      label: 'Notifications push',
      description: 'Recevoir des notifications sur votre appareil',
      icon: <IconBell className="w-5 h-5 text-green-400" />
    },
    {
      channel: 'sms',
      enabled: false,
      label: 'SMS',
      description: 'Recevoir des notifications par SMS',
      icon: <IconDeviceMobile className="w-5 h-5 text-purple-400" />
    }
  ]);

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlertPreference[]>([
    {
      type: 'login',
      enabled: true,
      label: 'Nouvelles connexions',
      description: 'Être alerté des nouvelles connexions',
      icon: <IconRefreshAlert className="w-5 h-5 text-yellow-400" />
    },
    {
      type: 'password',
      enabled: true,
      label: 'Changements de mot de passe',
      description: 'Recevoir une alerte en cas de changement de mot de passe',
      icon: <IconLock className="w-5 h-5 text-red-400" />
    },
    {
      type: 'device',
      enabled: true,
      label: 'Nouveaux appareils',
      description: 'Être notifié lors de la connexion depuis un nouvel appareil',
      icon: <IconShieldCheck className="w-5 h-5 text-blue-400" />
    }
  ]);

  // Utiliser les données du contexte AuthContext en priorité, sinon fallback sur les props
  const employeeData = (employee || userData) as any;
  
  // Construire le nom complet de l'employé connecté (même logique que ProfileHeader)
  const getDisplayName = () => {
    if (employeeData?.nom || employeeData?.nomComplet || employeeData?.displayName) {
      return employeeData.nom || employeeData.nomComplet || `${employeeData.prenom} ${employeeData.nom}` || employeeData.displayName || "Utilisateur";
    }
    return 'Employé ZaLaMa';
  };
  
  const displayName = getDisplayName();
  const displayEmail = employeeData?.email || 'Email non disponible';
  const displayInitial = displayName.charAt(0).toUpperCase();

  // Debug: Afficher les données de l'employé connecté
  useEffect(() => {
  }, [userData, employee, employeeData, displayName, displayEmail]);

  // Mettre à jour l'aperçu quand les données du contexte changent
  useEffect(() => {
    const newPhotoURL = employee?.photo_url || userData?.photoURL;
    if (newPhotoURL && newPhotoURL !== avatarPreview) {
      // resetUpload(); // This will reset the file input, which is not ideal for preview
    }
  }, [employee?.photo_url, userData?.photoURL, avatarPreview]);

  // Nettoyer l'URL de l'aperçu lors du démontage du composant
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Charger les préférences utilisateur
  useEffect(() => {
    // Simuler un chargement des préférences utilisateur
    const loadUserPreferences = async () => {
      try {
        // Ici, vous pourriez faire un appel API pour charger les préférences
        const userSettings = {
          language: 'fr',
          darkMode: theme === 'dark',
          currency: 'XOF',
          notifications: true,
        };
        
        setSettings(userSettings);
        setInitialSettings(userSettings);
      } catch (error) {
        console.error('Erreur lors du chargement des préférences:', error);
      }
    };

    loadUserPreferences();
  }, [theme]); // Ajout de theme comme dépendance

  const handleSettingChange = (name: string, value: boolean | string) => {
    if (name === 'darkMode') {
      setTheme(value ? 'dark' : 'light');
    }
    setSettings(prev => {
      const newSettings = { ...prev, [name]: value };
      
      // Vérifier si les paramètres ont changé
      const hasChanges = Object.entries(newSettings).some(
        ([key, val]) => initialSettings[key as keyof typeof initialSettings] !== val
      );
      
      setShowSaveButton(hasChanges);
      return newSettings;
    });
  };

  const toggleNotification = (channel: NotificationChannel) => {
    setNotificationPreferences(prev => 
      prev.map(pref => 
        pref.channel === channel 
          ? { ...pref, enabled: !pref.enabled } 
          : pref
      )
    );
    setShowSaveButton(true);
  };

  const toggleSecurityAlert = (type: SecurityAlertType) => {
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.type === type 
          ? { ...alert, enabled: !alert.enabled } 
          : alert
      )
    );
    setShowSaveButton(true);
  };

  // ✅ Fonction pour mettre à jour le profil employé via l'API route
  const handleUpdateProfile = async (profileData: any) => {
    try {
      const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
      if (!accessToken) {
        toast.error('Token d\'authentification manquant');
        return false;
      }


      const result = await employeeAuthService.updateProfile(accessToken, profileData);
      
      
      if (result.success) {
        toast.success('Profil mis à jour avec succès');
        return true;
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour du profil');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return false;
    }
  };

  // ✅ Fonction pour uploader une photo de profil via l'API route
  const handleUploadPhoto = async (photoFile: File) => {
    try {
      const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
      if (!accessToken) {
        toast.error('Token d\'authentification manquant');
        return false;
      }


      const result = await employeeAuthService.uploadPhoto(accessToken, photoFile);
      
      
      if (result.success) {
        toast.success('Photo uploadée avec succès');
        return true;
      } else {
        toast.error(result.error || 'Erreur lors de l\'upload de la photo');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      toast.error('Erreur lors de l\'upload de la photo');
      return false;
    }
  };

  // ✅ Fonction pour sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      // Filtrer les champs vides et créer l'objet de mise à jour
      const dataToUpdate: any = {};
      
      if (profileData.nom && profileData.nom.trim() !== '') {
        dataToUpdate.nom = profileData.nom.trim();
      }
      if (profileData.prenom && profileData.prenom.trim() !== '') {
        dataToUpdate.prenom = profileData.prenom.trim();
      }
      if (profileData.telephone && profileData.telephone.trim() !== '') {
        dataToUpdate.telephone = profileData.telephone.trim();
      }
      if (profileData.adresse && profileData.adresse.trim() !== '') {
        dataToUpdate.adresse = profileData.adresse.trim();
      }

      let success = true;

      // ✅ Upload de photo si une nouvelle photo a été sélectionnée
      if (avatarFile) {
        const photoSuccess = await handleUploadPhoto(avatarFile);
        if (!photoSuccess) {
          success = false;
        }
      }

      // ✅ Mise à jour des données du profil si des modifications ont été apportées
      if (Object.keys(dataToUpdate).length > 0) {
        const profileSuccess = await handleUpdateProfile(dataToUpdate);
        if (!profileSuccess) {
          success = false;
        }
      } else if (!avatarFile) {
        toast.error('Aucune modification à sauvegarder');
        return;
      }
      
      if (success) {
        toast.success('Profil mis à jour avec succès');
        
        // ✅ Rafraîchir le profil dans le contexte au lieu de recharger la page
        if (refreshProfile) {
          await refreshProfile();
        }
        
        // Réinitialiser les données du formulaire avec les nouvelles données
        if (currentUserData) {
        setProfileData({
            nom: currentUserData.nom || '',
            prenom: currentUserData.prenom || '',
            telephone: currentUserData.telephone || '',
            adresse: currentUserData.adresse || '',
          });
        }

        // ✅ Réinitialiser l'upload de photo
        resetUpload();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Ici, vous pourriez faire un appel API pour sauvegarder les préférences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInitialSettings(settings);
      setShowSaveButton(false);
      
      // Appliquer les changements (comme le thème sombre)
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      toast.success('Préférences enregistrées avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
      toast.error('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = () => {
    // Ne pas fermer la modale ici pour laisser visible le spinner
    setIsChangingPassword(true);
    // Délayer légèrement la navigation pour laisser le temps au spinner d'apparaître
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.assign('/auth/change-password');
      } else {
        router.push('/auth/change-password');
      }
    }, 100);
    // Mécanisme de secours: fermer la modale au bout de 2.5s au cas où
    setTimeout(() => {
      setIsChangingPassword(false);
      onClose();
    }, 2500);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // ✅ Fonction pour gérer l'upload de photo avec fermeture de la modal
  const handleImageUploadWithClose = async () => {
    if (avatarFile) {
      const success = await handleUploadPhoto(avatarFile);
      if (success) {
        setShowImageUpload(false);
        resetUpload();
        
        // ✅ Mise à jour immédiate de l'aperçu
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
          URL.revokeObjectURL(avatarPreview);
        }
        
        // ✅ Rafraîchir le profil dans le contexte au lieu de recharger la page
        if (refreshProfile) {
          await refreshProfile();
        }
      }
    } else {
      toast.error('Veuillez sélectionner une photo');
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Empêcher la propagation uniquement si on clique sur le contenu de la modale
    e.stopPropagation();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Pendant la redirection, empêcher la fermeture
    if (isChangingPassword) return;
    // Fermer uniquement si on clique sur le fond
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Fermer automatiquement la modale quand la route a changé vers la page de changement de mot de passe
  useEffect(() => {
    if (isChangingPassword && pathname === '/auth/change-password') {
      onClose();
      // Sécurité: réinitialiser l'état
      setIsChangingPassword(false);
    }
  }, [pathname, isChangingPassword, onClose]);

  // Mettre à jour l'état local quand le thème change
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme, setSettings]);

  // Initialiser le thème
  useEffect(() => {
    setTheme('dark'); // Thème sombre par défaut
  }, [setTheme]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        
        <motion.div
          layout
          onClick={handleModalClick}
          className={`relative w-full max-w-lg bg-background rounded-2xl shadow-xl overflow-hidden border ${theme === 'dark' ? 'border-[#1A2B6B]' : 'border-gray-200'}`}
        >
          {/* En-tête */}
          {/* Header */}
          <div className={`bg-gradient-to-r ${theme === 'dark' ? 'from-[#0A1A5A] to-[#1A2B6B]' : 'from-blue-600 to-blue-700'} p-5 border-b ${theme === 'dark' ? 'border-[#1A2B6B]' : 'border-blue-100'}`}>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                >
                  <IconSettings className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Paramètres</h2>
                  {displayName && displayName !== 'Utilisateur' && (
                    <p className="text-sm text-blue-200 mt-1">
                      Connecté en tant que <span className="font-medium text-white">{displayName}</span>
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => { if (!isChangingPassword) onClose(); }}
                disabled={isChangingPassword}
                className={`p-1 rounded-full transition-colors ${isChangingPassword ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                aria-label="Fermer"
              >
                <IconX className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Section Compte */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Mon compte</h3>
              
              <div className="bg-[#0A1A5A]/50 p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#0A1A5A] rounded-lg">
                  <div className="relative group">
                    {avatarPreview ? (
                      <Image
                        key={avatarPreview}
                        width={40}
                        height={40}
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#FF671E]/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF671E] to-[#FF8E53] flex items-center justify-center text-white font-bold">
                        {displayInitial}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconEdit className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{displayName}</p>
                    <p className="text-xs text-gray-400">{displayEmail}</p>
                    {employeeData?.poste && (
                      <p className="text-xs text-[#FF671E] mt-1 font-medium">
                        {employeeData.poste}
                      </p>
                    )}
                    {employeeData?.role && (
                      <p className="text-xs text-blue-300 mt-1">
                        Rôle: {employeeData.role}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenProfileEdit}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-lg text-xs font-medium text-white hover:shadow-[#FF671E]/40 transition-all"
                  >
                    Modifier
                  </motion.button>
                </div>
                
                {/* Informations supplémentaires de l'employé connecté */}
                {employeeData && (
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {employeeData.telephone && (
                      <div className="flex items-center gap-2 p-2 bg-[#0A1A5A] rounded-lg">
                        <span className="text-gray-400">📞</span>
                        <span className="text-white">{employeeData.telephone}</span>
                      </div>
                    )}
                    {employeeData.adresse && (
                      <div className="flex items-center gap-2 p-2 bg-[#0A1A5A] rounded-lg">
                        <span className="text-gray-400">📍</span>
                        <span className="text-white">{employeeData.adresse}</span>
                      </div>
                    )}
                    {employeeData.date_embauche && (
                      <div className="flex items-center gap-2 p-2 bg-[#0A1A5A] rounded-lg">
                        <span className="text-gray-400">📅</span>
                        <span className="text-white">Embauché le {new Date(employeeData.date_embauche).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                )}


              </div>
            </div>

            {/* Section Notifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              
              <div className="bg-[#0A1A5A]/50 p-4 rounded-lg space-y-4">
                {notificationPreferences.map((pref) => (
                  <div 
                    key={pref.channel} 
                    className="flex items-center justify-between p-3 bg-[#0A1A5A] rounded-lg"

                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1A2B6B]' : 'bg-blue-100'}`}>
                        {pref.icon}
                      </div>
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>{pref.label}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{pref.description}</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={pref.enabled}
                        onChange={() => toggleNotification(pref.channel)}
                        className="sr-only"
                        id={`switch-${pref.channel}`}
                      />
                      <label
                        htmlFor={`switch-${pref.channel}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${pref.enabled ? 'bg-[#FF671E]' : 'bg-gray-600'}`}
                      >
                        <span 
                          className={`block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md transform transition-transform ${pref.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Apparence */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Apparence</h3>
              
              <div className="bg-[#0A1A5A]/50 p-4 rounded-lg space-y-4">
                <div 
                  className="flex items-center justify-between p-3 bg-[#0A1A5A] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1A2B6B]' : 'bg-blue-100'} text-[#FF8E53]`}>
                      <IconMoon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Thème</p>
                      <p className="text-xs text-gray-400">Choisir entre mode clair, sombre ou système</p>
                    </div>
                  </div>
                  <ThemeToggle variant="switch" size="sm" />
                </div>
                
                <div className={`p-3 ${theme === 'dark' ? 'bg-[#0A1A5A]' : 'bg-white shadow-sm'} rounded-lg`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1A2B6B]' : 'bg-blue-100'} text-blue-500`}>
                      <IconLanguage className="w-5 h-5" />
                    </div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Langue</p>
                  </div>
                  <Select 
                    value={settings.language} 
                    onValueChange={(val) => handleSettingChange('language', val)}
                  >
                    <SelectTrigger className={`w-full mt-2 ${theme === 'dark' ? 'bg-[#1A2B6B] border-[#1A2B6B] text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent className={`${theme === 'dark' ? 'bg-[#0A1A5A] border-[#1A2B6B] text-white' : 'bg-white border-gray-200 text-gray-900'}`}>

                      <SelectItem value="fr" className="hover:bg-[#1A2B6B] cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span>🇫🇷</span>
                          <span>Français</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="en" className="hover:bg-[#1A2B6B] cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span>🇬🇧</span>
                          <span>English</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="es" className="hover:bg-[#1A2B6B] cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span>🇪🇸</span>
                          <span>Español</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section Sécurité */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Sécurité</h3>
              
              <div className="bg-[#0A1A5A]/50 p-4 rounded-lg space-y-4">
                {securityAlerts.map((alert) => (
                  <div key={alert.type} className={`flex items-center justify-between p-4 ${theme === 'dark' ? 'bg-[#0A1A5A]' : 'bg-white shadow-sm'} rounded-lg`}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 p-2.5 rounded-lg bg-[#1A2B6B]">
                        {alert.icon}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>{alert.label}</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{alert.description}</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={alert.enabled}
                        onChange={() => toggleSecurityAlert(alert.type)}
                        className="sr-only"
                        id={`security-${alert.type}`}
                      />
                      <label
                        htmlFor={`security-${alert.type}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${alert.enabled ? 'bg-[#FF671E]' : 'bg-gray-600'}`}
                      >
                        <span 
                          className={`block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md transform transition-transform ${alert.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </label>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className={`w-full ${theme === 'dark' ? 'border-[#1A2B6B] text-white hover:bg-[#1A2B6B]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} mt-4 relative`}
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <div className="flex items-center justify-center w-full">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      <span>Redirection en cours...</span>
                    </div>
                  ) : (
                    <>
                      <IconLock className="w-4 h-4 mr-2" />
                      Changer le mot de passe
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  className={`w-full ${theme === 'dark' ? 'border-red-500 text-red-400 hover:bg-red-500/10' : 'border-red-300 text-red-600 hover:bg-red-50'} mt-2`}
                  onClick={handleLogout}
                >
                  <IconLogout className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            </div>

            {/* Actions */}
            <AnimatePresence>
              {showSaveButton && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="sticky bottom-0 bg-[#010D3E] pt-4 pb-2 -mx-6 px-6 border-t border-[#1A2B6B]"
                >
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={onClose}
                      className={`hover:bg-[#1A2B6B] text-gray-300 border-gray-600`}
                      disabled={isSaving}
                    >
                      Annuler
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63]"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <IconCheck className="w-4 h-4 mr-2" />
                          Enregistrer les modifications
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Modal de modification de l'image de profil - Optimisée */}
        <AnimatePresence>
          {showImageUpload && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowImageUpload(false)} />
              <div className="relative bg-[#010D3E]/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-[#FF671E] to-[#FF8E53] bg-clip-text text-transparent">
                    Photo de profil
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowImageUpload(false)}
                    className="text-gray-300 hover:text-[#FFFFFF]"
                    aria-label="Fermer le formulaire"
                  >
                    <IconX size={24} />
                  </motion.button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Photo de profil</label>
                    <div className="flex flex-col items-center gap-6 py-4">
                      <motion.div 
                        initial={{ scale: 1 }} 
                        whileHover={{ scale: 1.02 }}
                        className="relative group"
                      >
                        {avatarPreview ? (
                          <Image
                            key={avatarPreview}
                            width={128}
                            height={128}
                            src={avatarPreview}
                            alt="Aperçu de l'avatar"
                            className="h-32 w-32 rounded-full object-cover border-4 border-[#FF671E]/30 shadow-lg"
                          />
                        ) : (
                          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#FF671E] to-[#FF8E53] flex items-center justify-center text-4xl font-bold text-[#FFFFFF] border-4 border-[#FF671E]/30 shadow-lg">
                            {displayInitial}
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconEdit className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                      
                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-lg text-sm font-medium text-white cursor-pointer shadow-lg hover:shadow-[#FF671E]/40 transition-all"
                      >
                        {avatarPreview ? "Changer la photo" : "Ajouter une photo"}
                        <input 
                          type="file" 
                          accept="image/png,image/jpeg,image/jpg,image/webp" 
                          onChange={handleAvatarChange} 
                          className="hidden" 
                        />
                      </motion.label>
                      
                      {imageError && (
                        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-400 text-sm text-center">{imageError}</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400 text-center mt-2">
                        Formats acceptés : JPG, PNG, WebP (max. 5MB)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center pt-6">
                    <motion.button
                      type="button"
                      onClick={() => setShowImageUpload(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={isUploading}
                      className="px-8 py-3 rounded-lg bg-white/10 border border-white/20 text-[#FFFFFF] hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleImageUploadWithClose}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={isUploading || !avatarFile}
                      className={`px-8 py-3 rounded-lg text-white shadow-lg transition-all ${
                        isUploading || !avatarFile 
                          ? 'bg-gray-500/50 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:shadow-[#FF671E]/40'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Enregistrement...</span>
                        </div>
                      ) : (
                        'Enregistrer la photo'
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de modification du profil */}
        <AnimatePresence>
          {showProfileEditModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="absolute inset-0 bg-black/50" onClick={handleCloseProfileEdit} />
                             <div className="relative bg-[#010D3E]/95 backdrop-blur-sm rounded-2xl p-3 w-full max-w-md shadow-2xl">
                 <div className="flex justify-between items-center mb-3">
                   <h2 className="text-base font-semibold bg-gradient-to-r from-[#FF671E] to-[#FF8E53] bg-clip-text text-transparent">
                     Modifier le profil
                   </h2>
                   <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     onClick={handleCloseProfileEdit}
                     className="text-gray-300 hover:text-[#FFFFFF]"
                     aria-label="Fermer le formulaire"
                   >
                     <IconX size={18} />
                   </motion.button>
                 </div>
                 
                 <div className="space-y-3">
                                     {/* Nom et Prénom */}
                   <div>
                     <label className="block text-xs font-medium text-gray-200 mb-1">Nom et prénom</label>
                     <div className="grid grid-cols-2 gap-2">
                       <input
                         type="text"
                         placeholder="Nom"
                         value={profileData.nom}
                         className="px-2 py-1 bg-[#1A2B6B] border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:border-[#FF671E]"
                         onChange={(e) => setProfileData(prev => ({ ...prev, nom: e.target.value }))}
                       />
                       <input
                         type="text"
                         placeholder="Prénom"
                         value={profileData.prenom}
                         className="px-2 py-1 bg-[#1A2B6B] border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:border-[#FF671E]"
                         onChange={(e) => setProfileData(prev => ({ ...prev, prenom: e.target.value }))}
                       />
                     </div>
                   </div>

                   {/* Téléphone */}
                   <div>
                     <label className="block text-xs font-medium text-gray-200 mb-1">Téléphone</label>
                     <input
                       type="tel"
                       placeholder="+224XXXXXXXXX"
                       value={profileData.telephone}
                       className="w-full px-2 py-1 bg-[#1A2B6B] border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:border-[#FF671E]"
                       onChange={(e) => setProfileData(prev => ({ ...prev, telephone: e.target.value }))}
                     />
                   </div>

                   {/* Adresse */}
                   <div>
                     <label className="block text-xs font-medium text-gray-200 mb-1">Adresse</label>
                     <textarea
                       placeholder="Votre adresse complète"
                       value={profileData.adresse}
                       rows={2}
                       className="w-full px-2 py-1 bg-[#1A2B6B] border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:border-[#FF671E] resize-none"
                       onChange={(e) => setProfileData(prev => ({ ...prev, adresse: e.target.value }))}
                     />
                   </div>

                  {/* Photo de profil */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Photo de profil</label>
                    <div className="flex flex-col items-center gap-3 py-2">
                      <motion.div 
                        initial={{ scale: 1 }} 
                        whileHover={{ scale: 1.02 }}
                        className="relative group"
                      >
                        {avatarPreview ? (
                          <Image
                            key={avatarPreview}
                            width={60}
                            height={60}
                            src={avatarPreview}
                            alt="Aperçu de l'avatar"
                            className="h-15 w-15 rounded-full object-cover border-2 border-[#FF671E]/30 shadow-lg"
                          />
                        ) : (
                          <div className="h-15 w-15 rounded-full bg-gradient-to-br from-[#FF671E] to-[#FF8E53] flex items-center justify-center text-xl font-bold text-[#FFFFFF] border-2 border-[#FF671E]/30 shadow-lg">
                            {displayInitial}
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconEdit className="w-5 h-5 text-white" />
                        </div>
                      </motion.div>
                      
                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-lg text-xs font-medium text-white cursor-pointer shadow-lg hover:shadow-[#FF671E]/40 transition-all"
                      >
                        {avatarPreview ? "Changer la photo" : "Ajouter une photo"}
                        <input 
                          type="file" 
                          accept="image/png,image/jpeg,image/jpg,image/webp" 
                          onChange={handleAvatarChange} 
                          className="hidden" 
                        />
                      </motion.label>
                      
                      {imageError && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <p className="text-red-400 text-xs text-center">{imageError}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                                     <div className="flex gap-2 justify-center pt-3">
                     <motion.button
                       type="button"
                       onClick={handleCloseProfileEdit}
                       whileHover={{ scale: 1.03 }}
                       whileTap={{ scale: 0.97 }}
                       disabled={isSaving}
                       className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-[#FFFFFF] text-xs hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Annuler
                     </motion.button>
                     <motion.button
                       type="button"
                       onClick={async () => {
                         await handleSaveProfile();
                         handleCloseProfileEdit();
                       }}
                       whileHover={{ scale: 1.03 }}
                       whileTap={{ scale: 0.97 }}
                       disabled={isSaving}
                       className={`px-4 py-2 rounded-lg text-white text-xs shadow-lg transition-all ${
                         isSaving 
                           ? 'bg-gray-500/50 cursor-not-allowed' 
                           : 'bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:shadow-[#FF671E]/40'
                       }`}
                     >
                       {isSaving ? (
                         <div className="flex items-center gap-1">
                           <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                           <span>Enregistrement...</span>
                         </div>
                       ) : (
                         'Enregistrer'
                       )}
                     </motion.button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}