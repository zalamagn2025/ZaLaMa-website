"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { employeeAuthService } from '@/lib/apiEmployeeAuth';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import PinInput from '@/components/common/PinInput';
import { toast } from 'sonner';
import Image from 'next/image';


export default function ChangePasswordPage() {
  const router = useRouter();
  const { employee, isAuthenticated, loading } = useEmployeeAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [hasUserInteractedWithNew, setHasUserInteractedWithNew] = useState(false);
  const [hasUserInteractedWithConfirm, setHasUserInteractedWithConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Diagnostic: log on mount to confirm page is displayed
  useEffect(() => {
    console.log('🔓 ChangePasswordPage mounted', { loading, isAuthenticated, hasEmployee: !!employee });
  }, []);

  // Auto-dismiss toasts
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Attendre la fin du chargement du contexte avant de décider
  useEffect(() => {
    if (!loading && (!employee || !isAuthenticated)) {
      router.push('/login');
    }
  }, [loading, employee, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white/80">
          <div className="w-6 h-6 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!employee || !isAuthenticated) {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white text-center">
          <div className="w-6 h-6 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
          <p>Vous devez être connecté pour accéder à cette page.</p>
          <p>Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Fonctions de gestion du PIN
  const handleCurrentPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setCurrentPin(numericValue);
    setHasUserInteracted(true);
  };

  const handleNewPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setNewPin(numericValue);
    setHasUserInteractedWithNew(true);
  };

  const handleConfirmPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setConfirmPin(numericValue);
    setHasUserInteractedWithConfirm(true);
  };

  const handleCurrentPinFocus = () => setHasUserInteracted(true);
  const handleNewPinFocus = () => setHasUserInteractedWithNew(true);
  const handleConfirmPinFocus = () => setHasUserInteractedWithConfirm(true);

  const handleCurrentPinBlur = () => {};
  const handleNewPinBlur = () => {};
  const handleConfirmPinBlur = () => {};

  const toggleCurrentPinVisibility = () => setShowCurrentPin(!showCurrentPin);
  const toggleNewPinVisibility = () => setShowNewPin(!showNewPin);
  const toggleConfirmPinVisibility = () => setShowConfirmPin(!showConfirmPin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!currentPin || !newPin || !confirmPin) {
      setStatus('error');
      setMessage('Veuillez remplir tous les champs');
      return;
    }

    if (currentPin.length !== 6) {
      setStatus('error');
      setMessage('Le code PIN actuel doit contenir 6 chiffres');
      return;
    }

    if (newPin.length !== 6) {
      setStatus('error');
      setMessage('Le nouveau code PIN doit contenir 6 chiffres');
      return;
    }

    if (newPin !== confirmPin) {
      setStatus('error');
      setMessage('Les nouveaux codes PIN ne correspondent pas');
      return;
    }

    if (currentPin === newPin) {
      setStatus('error');
      setMessage('Le nouveau code PIN doit être différent de l\'actuel');
      return;
    }

    // Vérifier que l'utilisateur est toujours authentifié
    if (!employeeAuthService.isAuthenticated()) {
      setStatus('error');
      setMessage('Votre session a expiré. Veuillez vous reconnecter.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      // Appeler l'API de changement de mot de passe (en envoyant les PINs comme "passwords")
      const response = await employeeAuthService.changePassword(currentPin, newPin, confirmPin);
      
      if (response.success) {
        setStatus('success');
        setMessage('Code PIN modifié avec succès ! Vous allez être redirigé...');
        
        // Redirection après 2 secondes pour laisser le temps de voir le message
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(response.error || 'Erreur lors du changement de code PIN');
      }
    } catch (error) {
      console.error('Erreur changement code PIN:', error);
      setStatus('error');
      setMessage('Erreur lors du changement de code PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center bg-gray-950 z-[9999]">
      {/* Toasts */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30"
          >
            <div className="bg-green-900/90 backdrop-blur-xl border border-green-700 rounded-xl px-6 py-4 shadow-2xl max-w-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-100 font-medium text-sm">Code PIN modifié</p>
                  <p className="text-green-200 text-xs mt-1">{message}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30"
          >
            <div className="bg-red-900/90 backdrop-blur-xl border border-red-700 rounded-xl px-6 py-4 shadow-2xl max-w-md">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-100 font-medium text-sm">Erreur</p>
                  <p className="text-red-200 text-xs mt-1">{message}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton Retour */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white/90 text-[#FF671E] font-semibold rounded shadow transition-all z-20"
        style={{backdropFilter: 'blur(6px)'}}
      >
        <ArrowLeft className="h-5 w-5" />
        Retour
      </button>
      
      {/* Background gradient effect */}
      <div className="absolute inset-0" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#FF671E]/20 blur-[80px]" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#FF671E]/20 blur-[60px]"
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#FF671E]/20 blur-[60px]"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1
        }}
      />

      {/* Animated glow spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div className="relative">
          <div className="relative group">
            {/* Card glow effect */}
            <motion.div 
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(255, 103, 30, 0.03)",
                  "0 0 15px 5px rgba(255, 103, 30, 0.05)",
                  "0 0 10px 2px rgba(255, 103, 30, 0.03)"
                ],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut", 
                repeatType: "mirror" 
              }}
            />

            {/* Glass card background */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
              {/* Subtle card inner patterns */}
              <div className="absolute inset-0 opacity-[0.03]" 
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Logo and header */}
              <div className="text-center space-y-1 mb-5">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                    <Image 
                      src="/images/zalamaLoginLogo.png" 
                      alt="ZaLaMa Logo" 
                      width={40}
                      height={40}
                    />
                  </span>
                  
                  {/* Inner lighting effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                >
                  Changement de code PIN
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  Sécurisez votre compte en modifiant votre code PIN à 6 chiffres
                </motion.p>
              </div>


              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div className="space-y-6">
                  {/* Code PIN actuel */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <PinInput
                      value={currentPin}
                      onChange={handleCurrentPinChange}
                      onFocus={handleCurrentPinFocus}
                      onBlur={handleCurrentPinBlur}
                      placeholder="Code PIN actuel"
                      showValue={showCurrentPin}
                      onToggleShow={toggleCurrentPinVisibility}
                      hasUserInteracted={hasUserInteracted}
                      label="Code PIN actuel"
                      disabled={isLoading}
                    />
                  </motion.div>

                  {/* Nouveau code PIN */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <PinInput
                      value={newPin}
                      onChange={handleNewPinChange}
                      onFocus={handleNewPinFocus}
                      onBlur={handleNewPinBlur}
                      placeholder="Nouveau code PIN"
                      showValue={showNewPin}
                      onToggleShow={toggleNewPinVisibility}
                      hasUserInteracted={hasUserInteractedWithNew}
                      label="Nouveau code PIN"
                      disabled={isLoading}
                    />
                  </motion.div>

                  {/* Confirmation du nouveau code PIN */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <PinInput
                      value={confirmPin}
                      onChange={handleConfirmPinChange}
                      onFocus={handleConfirmPinFocus}
                      onBlur={handleConfirmPinBlur}
                      placeholder="Confirmer le nouveau code PIN"
                      showValue={showConfirmPin}
                      onToggleShow={toggleConfirmPinVisibility}
                      hasUserInteracted={hasUserInteractedWithConfirm}
                      label="Confirmation du code PIN"
                      disabled={isLoading}
                    />
                    
                    {/* Indicateur de correspondance */}
                    {confirmPin && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-2 text-xs"
                      >
                        {newPin === confirmPin ? (
                          <>
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            <span className="text-green-400">Les codes PIN correspondent</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            <span className="text-red-400">Les codes PIN ne correspondent pas</span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Bouton de soumission */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || status === 'success' || !currentPin || !newPin || !confirmPin || newPin !== confirmPin || currentPin.length !== 6 || newPin.length !== 6 || confirmPin.length !== 6}
                  className="w-full relative group/button mt-5"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                  
                  <div className="relative overflow-hidden bg-[#FF671E] text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
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
                          <span className="text-sm font-medium">Modifié !</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          Modifier le code PIN
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Informations de sécurité */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-white/90 text-xs font-medium mb-2">Conseils de sécurité</h3>
                  <ul className="text-white/60 text-xs space-y-1">
                    <li>• Utilisez un code PIN unique et mémorable</li>
                    <li>• Évitez les séquences simples (123456, 000000)</li>
                    <li>• Ne partagez jamais votre code PIN</li>
                    <li>• Changez régulièrement votre code PIN</li>
                    <li>• N'utilisez pas des informations personnelles (date de naissance, téléphone)</li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
