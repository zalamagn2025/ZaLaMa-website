"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IconSettings, IconX, IconLock, IconBell, IconMoon, IconLanguage } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface pour le type User
interface User {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

// Interface pour le contexte d'authentification
interface AuthContextType {
  currentUser: User | null;
  // Ajoutez ici les autres méthodes de votre contexte si nécessaire
}

export function ProfileSettings({ onClose }: { onClose: () => void }) {
  // Utilisation du contexte avec typage fort
  const {} = useAuth() as AuthContextType;

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'fr',
    securityAlerts: true
  });

  const handleSettingChange = (name: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div
        layout
        className="relative w-full max-w-md bg-[#010D3E] rounded-2xl shadow-xl overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="bg-[#0A1A5A] p-5 border-b border-[#1A2B6B]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              >
                <IconSettings className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-white">Paramètres</h2>
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
          {/* Section Préférences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-[#1A2B6B] pb-2">Préférences</h3>
            
            <div className="bg-[#0A1A5A] p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconBell className="h-5 w-5 text-[#FF8E53]" />
                  <Label className="text-gray-300">Notifications</Label>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(val) => handleSettingChange('notifications', val)}
                  className="data-[state=checked]:bg-[#FF671E]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconMoon className="h-5 w-5 text-[#FF8E53]" />
                  <Label className="text-gray-300">Mode sombre</Label>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(val) => handleSettingChange('darkMode', val)}
                  className="data-[state=checked]:bg-[#FF671E]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconLanguage className="h-5 w-5 text-[#FF8E53]" />
                  <Label className="text-gray-300">Langue</Label>
                </div>
                <Select 
                  value={settings.language} 
                  onValueChange={(val) => handleSettingChange('language', val)}
                >
                  <SelectTrigger className="w-[120px] bg-[#010D3E] border-[#1A2B6B] text-white">
                    <SelectValue placeholder="Langue" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#010D3E] border-[#1A2B6B] text-white">
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section Sécurité */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-[#1A2B6B] pb-2">Sécurité</h3>
            
            <div className="bg-[#0A1A5A] p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconLock className="h-5 w-5 text-[#FF8E53]" />
                  <Label className="text-gray-300">Alertes de sécurité</Label>
                </div>
                <Switch
                  checked={settings.securityAlerts}
                  onCheckedChange={(val) => handleSettingChange('securityAlerts', val)}
                  className="data-[state=checked]:bg-[#FF671E]"
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-[#1A2B6B] text-white hover:bg-[#0A1A5A]"
              >
                Changer le mot de passe
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-[#0A1A5A] text-gray-300 border-gray-600"
            >
              Annuler
            </Button>
            <Button className="bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63]">
              Enregistrer
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}