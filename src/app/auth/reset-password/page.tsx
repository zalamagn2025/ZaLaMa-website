"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Key, Eye, EyeClosed } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import PinInput from "@/components/common/PinInput";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      autoComplete="off"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États pour le formulaire
  const [email, setEmail] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [hasUserInteractedWithNew, setHasUserInteractedWithNew] = useState(false);
  const [hasUserInteractedWithConfirm, setHasUserInteractedWithConfirm] = useState(false);
  const [isFirstPinComplete, setIsFirstPinComplete] = useState(false);
  
  // États pour le flux
  const [currentStep, setCurrentStep] = useState<'email' | 'pin' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Vérifier si on a un token de réinitialisation
  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (token && emailParam) {
      setEmail(emailParam);
      setCurrentStep('pin');
    }
  }, [searchParams]);

  // Fonctions pour gérer la saisie du nouveau PIN
  const handleNewPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const limitedValue = numericValue.slice(0, 6);
    setNewPin(limitedValue);
    setHasUserInteractedWithNew(true);
    setIsFirstPinComplete(limitedValue.length === 6);
    
    // Effacer la confirmation si le nouveau PIN change
    if (confirmPin) {
      setConfirmPin('');
      setHasUserInteractedWithConfirm(false);
    }
  };

  const handleNewPinFocus = () => {
    setHasUserInteractedWithNew(true);
  };

  const handleNewPinBlur = () => {
    // Blur géré par le composant PinInput
  };

  const toggleNewPinVisibility = () => {
    setShowNewPin(!showNewPin);
  };

  // Fonctions pour gérer la saisie de confirmation du PIN
  const handleConfirmPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const limitedValue = numericValue.slice(0, 6);
    setConfirmPin(limitedValue);
    setHasUserInteractedWithConfirm(true);
  };

  const handleConfirmPinFocus = () => {
    setHasUserInteractedWithConfirm(true);
  };

  const handleConfirmPinBlur = () => {
    // Blur géré par le composant PinInput
  };

  const toggleConfirmPinVisibility = () => {
    setShowConfirmPin(!showConfirmPin);
  };

  // Validation des PINs
  const isNewPinValid = newPin.length === 6 && /^\d{6}$/.test(newPin);
  const isConfirmPinValid = confirmPin.length === 6 && /^\d{6}$/.test(confirmPin);
  const isPinMatching = newPin === confirmPin && newPin.length === 6;

  // Fonction pour envoyer l'email de réinitialisation
  const handleSendResetEmail = async (e: React.FormEvent) => {
    console.log('handleSendResetEmail appelé!', e);
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-reset-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.');
        
        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login?message=reset_email_sent');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser le PIN
  const handleResetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    // Validation
    if (!isNewPinValid || !isConfirmPinValid || !isPinMatching) {
      setStatus('error');
      setMessage('Veuillez vérifier vos codes PIN');
      setIsLoading(false);
      return;
    }

    try {
      const token = searchParams.get('token');
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword: newPin,
          confirmPassword: confirmPin
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Code PIN réinitialisé avec succès ! Redirection vers la connexion...');
        setCurrentStep('success');
        
        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login?message=password_reset_success');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-dismiss des toasts
  useEffect(() => {
    if (status === 'error' || status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center bg-gray-950 z-[9999]">
      {/* Toasts */}
      <AnimatePresence>
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
                  <p className="text-green-100 font-medium text-sm">Succès</p>
                  <p className="text-green-200 text-xs mt-1">{message}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton Retour */}
      <button
        type="button"
        onClick={() => router.push("/login")}
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
        className="w-full max-w-md relative z-10"
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
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden z-10">
              {/* Subtle card inner patterns */}
              <div className="absolute inset-0 opacity-[0.03]" 
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Logo and header */}
              <div className="text-center space-y-1 mb-6">
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
                  {currentStep === 'email' ? 'Code PIN oublié' : 'Nouveau code PIN'}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  {currentStep === 'email' 
                    ? 'Saisissez votre email pour recevoir un lien de réinitialisation'
                    : 'Définissez votre nouveau code PIN à 6 chiffres'
                  }
                </motion.p>
              </div>

              {/* Formulaire d'email */}
              {currentStep === 'email' && (
                <form onSubmit={handleSendResetEmail} className="space-y-4 relative z-20" autoComplete="off">
                  <div className="relative">
                    <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10 focus-within:border-white/20 focus-within:bg-white/10 transition-all duration-300">
                      <Mail className="absolute left-3 w-4 h-4 text-white/40" />
                      
                      <Input
                        type="email"
                        placeholder="Votre adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-transparent border-transparent text-white placeholder:text-white/30 h-10 pl-10 pr-4 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF671E] hover:bg-[#FF671E]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center mt-6 relative z-50 cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2" />
                        Envoi...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Envoyer le lien de réinitialisation
                      </div>
                    )}
                  </button>
                </form>
              )}

              {/* Formulaire de nouveau PIN */}
              {currentStep === 'pin' && (
                <form onSubmit={handleResetPin} className="space-y-6" autoComplete="off">
                  <div className="space-y-6">
                    {/* Nouveau PIN */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
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

                    {/* Confirmation PIN */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <PinInput
                        value={confirmPin}
                        onChange={handleConfirmPinChange}
                        onFocus={handleConfirmPinFocus}
                        onBlur={handleConfirmPinBlur}
                        placeholder="Confirmation du code PIN"
                        showValue={showConfirmPin}
                        onToggleShow={toggleConfirmPinVisibility}
                        hasUserInteracted={hasUserInteractedWithConfirm}
                        isConfirmField={true}
                        label="Confirmation du code PIN"
                        disabled={isLoading || !isFirstPinComplete}
                      />
                      
                      {/* Indicateur de correspondance */}
                      {confirmPin && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-center justify-center"
                        >
                          {isPinMatching ? (
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>Codes PIN identiques</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                              <AlertCircle className="w-4 h-4" />
                              <span>Codes PIN différents</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !isNewPinValid || !isConfirmPinValid || !isPinMatching}
                    className="w-full bg-[#FF671E] hover:bg-[#FF671E]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center mt-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2" />
                        Réinitialisation...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Réinitialiser le code PIN
                      </div>
                    )}
                  </button>
                </form>
              )}

              {/* Message de succès */}
              {currentStep === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Code PIN réinitialisé !
                    </h3>
                    <p className="text-white/60 text-sm">
                      Votre nouveau code PIN a été défini avec succès. Vous allez être redirigé vers la page de connexion.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Conseils de sécurité */}
              {currentStep === 'pin' && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Conseils de sécurité
                  </h3>
                  <ul className="text-xs text-white/60 space-y-1">
                    <li>• Choisissez un code PIN facile à retenir</li>
                    <li>• Évitez les codes évidents (123456, 000000)</li>
                    <li>• Ne partagez jamais votre code PIN</li>
                    <li>• Changez-le régulièrement</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}