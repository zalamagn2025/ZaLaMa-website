"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconEye, IconEyeOff, IconLock, IconX, IconShieldCheck } from '@tabler/icons-react';
import { Button } from './button';
import { Input } from './input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface PasswordVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  message?: string;
  onVerifyPassword?: (password: string) => Promise<boolean>;
}

export function PasswordVerificationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  title = "Vérification requise",
  message = "Entrez votre mot de passe pour afficher les informations sensibles",
  onVerifyPassword
}: PasswordVerificationModalProps) {
  console.log('🔐 Modal - isOpen:', isOpen);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 Début du handleSubmit dans le modal');
    
    if (!password.trim()) {
      toast.error('Veuillez entrer votre mot de passe');
      return;
    }

    console.log('🔐 Mot de passe saisi:', password ? '***' : 'vide');
    setIsLoading(true);

    try {
      let success = false;
      
      if (onVerifyPassword) {
        console.log('🔐 Appel de onVerifyPassword...');
        // Utiliser la fonction de vérification fournie
        success = await onVerifyPassword(password);
        console.log('🔐 Résultat de onVerifyPassword:', success);
      } else {
        console.log('🔐 Utilisation de la vérification par défaut...');
        // Vérification par défaut avec Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user?.email) {
          throw new Error('Session utilisateur non trouvée');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: session.user.email,
          password: password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Mot de passe incorrect');
          } else {
            throw new Error('Erreur de vérification');
          }
        }
        
        success = true;
      }

      console.log('🔐 Success final:', success);
      if (success) {
        console.log('✅ Vérification réussie dans le modal');
        toast.success('Vérification réussie');
        onSuccess();
        console.log('🚪 Fermeture du modal...');
        handleClose();
      } else {
        console.log('❌ Vérification échouée dans le modal');
      }
      
    } catch (error) {
      console.log('❌ Erreur dans handleSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur de vérification';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-[#010D3E] rounded-2xl shadow-2xl border border-[#1A3A8F] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100/10 transition-colors text-gray-400 hover:text-white"
            >
              <IconX className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#FF671E] to-[#FF8E53] rounded-full flex items-center justify-center mb-4">
                <IconShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
              <p className="text-sm text-gray-300">{message}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full bg-[#1A3A8F]/20 border-[#1A3A8F] text-white placeholder:text-gray-400 focus:border-[#FF671E] focus:ring-[#FF671E]"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100/10 transition-colors text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <IconEyeOff className="w-4 h-4" />
                    ) : (
                      <IconEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-transparent border-[#1A3A8F] text-gray-300 hover:bg-[#1A3A8F]/20 hover:text-white"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                                 <Button
                   type="submit"
                   className="flex-1 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF671E]/90 hover:to-[#FF8E53]/90 text-white"
                   disabled={isLoading}
                   onClick={() => {
                     console.log('🔐 Clic sur le bouton Vérifier');
                   }}
                 >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Vérification...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <IconLock className="w-4 h-4" />
                      Vérifier
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Security note */}
            <div className="mt-4 p-3 bg-[#1A3A8F]/20 rounded-lg border border-[#1A3A8F]/50">
              <p className="text-xs text-gray-400 text-center">
                🔒 Vos informations sont protégées. Cette vérification garantit que seul vous pouvez accéder à vos données sensibles.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 