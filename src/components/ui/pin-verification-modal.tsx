"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconShieldCheck, IconKey } from '@tabler/icons-react';
import { Button } from './button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import PinInput from '@/components/common/PinInput';

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onVerifyPin: (pin: string) => Promise<boolean>;
  title?: string;
  message?: string;
}

export function PinVerificationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  title = "Vérification requise",
  message = "Entrez votre code PIN pour afficher les informations sensibles",
  onVerifyPin
}: PinVerificationModalProps) {
  /*console.log('🔐 Modal PIN - isOpen:', isOpen)*/
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /*console.log('🔐 Début du handleSubmit dans le modal PIN')*/
    
    if (!pin.trim() || pin.length !== 6) {
      setError('Veuillez entrer un code PIN à 6 chiffres');
      return;
    }

    /*console.log('🔐 PIN saisi:', pin ? '***' : 'vide')*/
    setIsLoading(true);
    setError(''); // Réinitialiser l'erreur

    try {
      const success = await onVerifyPin(pin);
      
      if (success) {
        /*console.log('🔐 Vérification PIN réussie')*/
        toast.success('Code PIN correct !');
        onSuccess();
        onClose();
        setPin(''); // Réinitialiser le PIN
        setShowPin(false);
        setHasUserInteracted(false);
      } else {
        /*console.log('🔐 Vérification PIN échouée')*/
        setError('Code PIN incorrect. Veuillez réessayer.');
        toast.error('Code PIN incorrect');
      }
    } catch (err) {
      console.error('❌ Erreur lors de la vérification PIN:', err);
      setError('Erreur de vérification. Veuillez réessayer.');
      toast.error('Erreur de vérification');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (value: string) => {
    // Filtrer pour ne garder que les chiffres
    const numericValue = value.replace(/\D/g, '');
    // Limiter à 6 chiffres
    const limitedValue = numericValue.slice(0, 6);
    setPin(limitedValue);
    setHasUserInteracted(true);
    setError(''); // Effacer l'erreur quand l'utilisateur tape
  };

  const handlePinFocus = () => {
    setHasUserInteracted(true);
  };

  const handlePinBlur = () => {
    // Blur géré par le composant PinInput
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  const handleClose = () => {
    setPin('');
    setShowPin(false);
    setError('');
    setHasUserInteracted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-[#010D3E]/95 backdrop-blur-xl border border-[#1A3A8F] rounded-2xl p-6 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF671E]/20 rounded-lg">
                <IconShieldCheck className="h-6 w-6 text-[#FF671E]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-white/60">Sécurité renforcée</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <IconX className="h-5 w-5" />
            </Button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-white/80 text-sm leading-relaxed">{message}</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input PIN */}
            <div className="space-y-4">
              <PinInput
                value={pin}
                onChange={handlePinChange}
                onFocus={handlePinFocus}
                onBlur={handlePinBlur}
                placeholder="Code PIN (6 chiffres)"
                showValue={showPin}
                onToggleShow={togglePinVisibility}
                hasUserInteracted={hasUserInteracted}
                label="Code PIN de sécurité"
                disabled={isLoading}
              />

              {/* Message d'erreur */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <p className="text-red-200 text-sm">{error}</p>
                </motion.div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={pin.length !== 6 || isLoading}
                className="flex-1 bg-[#FF671E] hover:bg-[#FF671E]/90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                    Vérification...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <IconKey className="h-4 w-4" />
                    Vérifier
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-start gap-2">
              <IconShieldCheck className="h-4 w-4 text-[#FF671E] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-white/60">
                <p className="font-medium mb-1">Sécurité</p>
                <p>Votre code PIN est chiffré et sécurisé. Il ne sera pas stocké en clair.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
