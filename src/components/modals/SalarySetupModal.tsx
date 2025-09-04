"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, Briefcase, FileText, CheckCircle, AlertCircle, X, User, Building } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SalarySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userInfo: {
    id: string;
    role: string;
    email: string;
    display_name: string;
    currentSalary: number;
    partner: {
      id: string;
      company_name: string;
    };
  } | null;
}

interface SalaryFormData {
  salaire_net: number;
  type_contrat: string;
  date_embauche: string;
  poste: string;
}

const CONTRACT_TYPES = [
  { value: "CDI", label: "CDI" },
  { value: "CDD", label: "CDD" },
  { value: "Consultant", label: "Consultant" },
  { value: "Stage", label: "Stage" },
  { value: "Autre", label: "Autre" }
];

export default function SalarySetupModal({ isOpen, onClose, onSuccess, userInfo }: SalarySetupModalProps) {
  const [formData, setFormData] = useState<SalaryFormData>({
    salaire_net: 0,
    type_contrat: "CDI",
    date_embauche: "",
    poste: ""
  });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Réinitialiser le formulaire quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        salaire_net: 0,
        type_contrat: "CDI",
        date_embauche: "",
        poste: ""
      });
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof SalaryFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (formData.salaire_net <= 0 || formData.salaire_net > 10000000) {
      setErrorMessage('Le salaire doit être entre 1 et 10 000 000 FG');
      return false;
    }
    if (!formData.date_embauche) {
      setErrorMessage('La date d\'embauche est requise');
      return false;
    }
    if (new Date(formData.date_embauche) > new Date()) {
      setErrorMessage('La date d\'embauche ne peut pas être dans le futur');
      return false;
    }
    if (formData.poste.length < 2) {
      setErrorMessage('Le poste doit contenir au moins 2 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Récupérer le token depuis localStorage
      const accessToken = localStorage.getItem('employee_access_token');
      
      if (!accessToken) {
        setStatus('error');
        setErrorMessage('Token d\'accès non disponible');
        return;
      }

      console.log('🔧 Configuration du salaire via Edge Function...', formData);
      const response = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup/configure', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('📊 Réponse Edge Function /configure:', data);

      if (response.ok && data.success) {
        setStatus('success');
        setTimeout(() => {
          onSuccess();
          onClose();
          // Recharger la page pour mettre à jour les données
          window.location.reload();
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Erreur lors de la configuration du salaire');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatus('error');
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const formatSalary = (value: number): string => {
    return value.toLocaleString('fr-FR');
  };

  const parseSalary = (value: string): number => {
    return parseInt(value.replace(/\s/g, '')) || 0;
  };

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'rh': return 'Ressources Humaines';
      case 'responsable': return 'Responsable';
      default: return role;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm"
        >
          {/* Style exact des cards de statistiques ZaLaMa */}
          <div className="relative bg-[#010D3E]/90 backdrop-blur-sm rounded-xl border border-[#1A3A8F] shadow-lg overflow-hidden">
            {/* Animation de fond */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#1A3A8F] opacity-0"
              animate={{
                opacity: 0.03,
                transition: { duration: 0.6 }
              }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header avec informations utilisateur */}
            <div className="p-4">
              <div className="text-center space-y-2 mb-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1A3A8F] flex items-center justify-center relative overflow-hidden border border-[#1A3A8F]"
                >
                  <DollarSign className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-bold text-white"
                >
                  Configuration du salaire
                </motion.h2>
                
                {/* Informations utilisateur */}
                {userInfo && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-center gap-2 text-[#3b82f6]">
                      <div className="px-2 py-1 bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-full">
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {getRoleDisplayName(userInfo.role)}
                        </span>
                      </div>
                    </div>
                    
                    {userInfo.partner?.company_name && (
                      <div className="flex items-center justify-center gap-1 text-white/60">
                        <Building className="w-3 h-3" />
                        <span className="text-xs">{userInfo.partner.company_name}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Messages de statut */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-3 p-2 bg-green-900/20 border border-green-700 rounded-lg flex items-center"
                  >
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    <p className="text-green-200 text-xs">Salaire configuré avec succès !</p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-3 p-2 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                  >
                    <AlertCircle className="w-3 h-3 text-red-400 mr-2" />
                    <p className="text-red-200 text-xs">{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Salaire net */}
                <motion.div 
                  className={`relative ${focusedInput === "salaire_net" ? 'z-10' : ''}`}
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Salaire net mensuel
                  </label>
                  <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10">
                    <DollarSign className={`absolute left-2 w-3 h-3 transition-all duration-300 ${
                      focusedInput === "salaire_net" ? 'text-[#3b82f6]' : 'text-white/40'
                    }`} />
                    
                    <input
                      type="text"
                      placeholder="0"
                      value={formatSalary(formData.salaire_net)}
                      onChange={(e) => handleInputChange('salaire_net', parseSalary(e.target.value))}
                      onFocus={() => setFocusedInput("salaire_net")}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className="w-full bg-transparent border-transparent focus:border-[#3b82f6]/50 text-white placeholder:text-white/30 h-8 text-sm transition-all duration-300 pl-7 pr-8 focus:bg-white/5"
                    />
                    <span className="absolute right-2 text-white/40 text-xs">FG</span>
                  </div>
                </motion.div>

                {/* Type de contrat */}
                <motion.div 
                  className={`relative ${focusedInput === "type_contrat" ? 'z-10' : ''}`}
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Type de contrat
                  </label>
                  <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10">
                    <FileText className={`absolute left-2 w-3 h-3 transition-all duration-300 ${
                      focusedInput === "type_contrat" ? 'text-[#3b82f6]' : 'text-white/40'
                    }`} />
                    
                    <select
                      value={formData.type_contrat}
                      onChange={(e) => handleInputChange('type_contrat', e.target.value)}
                      onFocus={() => setFocusedInput("type_contrat")}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className="w-full bg-transparent border-transparent focus:border-[#3b82f6]/50 text-white h-8 text-sm transition-all duration-300 pl-7 pr-4 focus:bg-white/5 appearance-none cursor-pointer"
                    >
                      {CONTRACT_TYPES.map(type => (
                        <option key={type.value} value={type.value} className="bg-[#010D3E] text-white">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {/* Date d'embauche */}
                <motion.div 
                  className={`relative ${focusedInput === "date_embauche" ? 'z-10' : ''}`}
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Date d'embauche
                  </label>
                  <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10">
                    <Calendar className={`absolute left-2 w-3 h-3 transition-all duration-300 ${
                      focusedInput === "date_embauche" ? 'text-[#3b82f6]' : 'text-white/40'
                    }`} />
                    
                    <input
                      type="date"
                      value={formData.date_embauche}
                      onChange={(e) => handleInputChange('date_embauche', e.target.value)}
                      onFocus={() => setFocusedInput("date_embauche")}
                      onBlur={() => setFocusedInput(null)}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full bg-transparent border-transparent focus:border-[#3b82f6]/50 text-white h-8 text-sm transition-all duration-300 pl-7 pr-4 focus:bg-white/5"
                    />
                  </div>
                </motion.div>

                {/* Poste */}
                <motion.div 
                  className={`relative ${focusedInput === "poste" ? 'z-10' : ''}`}
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <label className="block text-xs font-medium text-white/80 mb-1">
                    Poste occupé
                  </label>
                  <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10">
                    <Briefcase className={`absolute left-2 w-3 h-3 transition-all duration-300 ${
                      focusedInput === "poste" ? 'text-[#3b82f6]' : 'text-white/40'
                    }`} />
                    
                    <input
                      type="text"
                      placeholder="Ex: Responsable RH..."
                      value={formData.poste}
                      onChange={(e) => handleInputChange('poste', e.target.value)}
                      onFocus={() => setFocusedInput("poste")}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className="w-full bg-transparent border-transparent focus:border-[#3b82f6]/50 text-white placeholder:text-white/30 h-8 text-sm transition-all duration-300 pl-7 pr-4 focus:bg-white/5"
                    />
                  </div>
                </motion.div>

                {/* Bouton de soumission */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full relative group/button mt-4"
                >
                  <div className={`relative overflow-hidden text-white font-medium h-9 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    status !== 'loading' && status !== 'success' 
                      ? 'bg-gradient-to-r from-[#3b82f6] to-[#1A3A8F] hover:from-[#60a5fa] hover:to-[#3b82f6]' 
                      : 'bg-gray-600 opacity-50'
                  }`}>
                    <AnimatePresence mode="wait">
                      {status === 'loading' ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : status === 'success' ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Succès !</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-xs font-medium"
                        >
                          <DollarSign className="w-3 h-3" />
                          Configurer le salaire
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
