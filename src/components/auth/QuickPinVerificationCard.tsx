"use client";

import { useState, useRef } from "react";
import { motion } from 'framer-motion';
import { ArrowLeft, User, Eye, EyeOff, Trash2 } from 'lucide-react';
import { AccountSession } from "@/types/account-session";
import Image from 'next/image';
import PinInput from "@/components/common/PinInput";

interface QuickPinVerificationCardProps {
  account: AccountSession;
  onSuccess: (pin: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
  onRemoveAccount?: (accountId: string) => void;
  loading?: boolean;
}

export default function QuickPinVerificationCard({
  account,
  onSuccess,
  onCancel,
  onError,
  onRemoveAccount,
  loading = false
}: QuickPinVerificationCardProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const limitedValue = numericValue.slice(0, 6);
    setPin(limitedValue);
    setHasUserInteracted(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // console.log('🔘 Bouton cliqué !', {
    //   pin: pin,
    //   pinLength: pin.length,
    //   loading: loading,
    //   disabled: loading || pin.length !== 6
    // });
    
    if (!pin || pin.length !== 6) {
      // console.log('❌ PIN invalide:', pin);
      onError('Veuillez entrer un code PIN valide (6 chiffres)');
      return;
    }

    // console.log('✅ PIN valide, appel de onSuccess');
    try {
      onSuccess(pin);
    } catch (error) {
      // console.log('❌ Erreur dans onSuccess:', error);
      onError('Erreur lors de la vérification du PIN');
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations du compte */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-left">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ${
              account.profile_image ? 'bg-transparent' : 'bg-gradient-to-br from-[#FF671E] to-[#FF8A4C]'
            }`}>
              {account.profile_image ? (
                <Image
                  src={account.profile_image}
                  alt={`${account.prenom} ${account.nom}`}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-lg truncate">
                {account.prenom} {account.nom}
              </p>
              <p className="text-white/60 text-sm truncate">
                {account.email}
              </p>
              {account.poste && (
                <p className="text-white/40 text-xs truncate">
                  {account.poste} • {account.entreprise}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Formulaire PIN */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">
            Entrez votre code PIN
          </label>
          <PinInput
            value={pin}
            onChange={handlePinChange}
            onFocus={handlePinFocus}
            onBlur={handlePinBlur}
            placeholder="Code PIN"
            showValue={showPin}
            onToggleShow={togglePinVisibility}
            ref={pinInputRef}
            hasUserInteracted={hasUserInteracted}
            label="Code PIN"
          />
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <motion.button
            type="submit"
            disabled={loading || pin.length !== 6}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8A4C] text-white font-medium hover:from-[#FF671E]/90 hover:to-[#FF8A4C]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sélectionner un autre compte</span>
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
