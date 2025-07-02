"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "../../contexts/AuthContext";
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
  IconCheck
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Interface pour les données utilisateur
interface UserData {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  nom?: string;
  prenom?: string;
  nomComplet?: string;
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  currentUser: UserData | null;
  // Ajoutez ici les autres méthodes de votre contexte si nécessaire
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
  const { currentUser } = useAuth() as AuthContextType;
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const { theme, setTheme } = useTheme();
  const [initialSettings, setInitialSettings] = useState({
    language: 'fr',
    darkMode: theme === 'dark',
  });

  const [settings, setSettings] = useState({
    darkMode: theme === 'dark',
    language: 'fr',
    currency: 'XOF',
    notifications: true,
  });

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

  // Utiliser userData si disponible, sinon fallback sur currentUser
  const displayUser = userData || currentUser;
  const displayName = userData?.nomComplet || userData?.displayName || currentUser?.displayName || 'Utilisateur';
  const displayEmail = userData?.email || currentUser?.email;
  const displayInitial = displayName.charAt(0).toUpperCase();

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

  const handlePasswordChange = () => {
    onClose();
    router.push('/auth/reset-password');
  };

  // const handleCardClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  // };

  const handleModalClick = (e: React.MouseEvent) => {
    // Empêcher la propagation uniquement si on clique sur le contenu de la modale
    e.stopPropagation();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Fermer uniquement si on clique sur le fond
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
                  {displayName && (
                    <p className="text-sm text-blue-200 mt-1">
                      Connecté en tant que <span className="font-medium text-white">{displayName}</span>
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF671E] to-[#FF8E53] flex items-center justify-center text-white font-bold">
                    {displayInitial}
                  </div>
                  <div>
                    <p className="font-medium text-white">{displayName}</p>
                    <p className="text-xs text-gray-400">{displayEmail}</p>
                  </div>
                </div>
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
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mode sombre</p>
                      <p className="text-xs text-gray-400">Activer/désactiver le mode sombre</p>
                    </div>
                  </div>
                  <div className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={() => handleSettingChange('darkMode', !settings.darkMode)}
                      className="sr-only"
                      id="dark-mode-switch"
                    />
                    <label
                      htmlFor="dark-mode-switch"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${settings.darkMode ? 'bg-[#FF671E]' : 'bg-gray-600'}`}
                    >
                      <span 
                        className={`block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md transform transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </label>
                  </div>
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
                  className={`w-full ${theme === 'dark' ? 'border-[#1A2B6B] text-white hover:bg-[#1A2B6B]' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} mt-4`}
                  onClick={handlePasswordChange}
                >
                  <IconLock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
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
      </motion.div>
    </AnimatePresence>
  );
}