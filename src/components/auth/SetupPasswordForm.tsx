"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Key, ArrowRight, CheckCircle, AlertCircle, ArrowLeft, Shield, Eye, EyeClosed } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

// Fonction pour formater le PIN (masquer les chiffres)
const formatPin = (value: string, show: boolean) => {
  if (show) return value;
  return value.replace(/\d/g, '•');
};

// Composant Input PIN style OTP
function PinInput({ 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  placeholder, 
  showValue, 
  onToggleShow,
  className,
  ref,
  disabled = false,
  hasUserInteracted = false,
  hasUserInteractedWithConfirm = false,
  isConfirmField = false,
  label = "Nouveau Code PIN",
  ...props 
}: {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  showValue: boolean;
  onToggleShow: () => void;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  hasUserInteracted?: boolean;
  hasUserInteractedWithConfirm?: boolean;
  isConfirmField?: boolean;
  label?: string;
}) {
  const digits = value.split('').concat(Array(6 - value.length).fill(''));
  
  return (
    <div className="relative">
      {/* Header avec icônes */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-white/40" />
          <span className="text-sm text-white/60 font-medium">{label}</span>
        </div>
        
        {/* Bouton toggle visibility */}
        <div 
          onClick={onToggleShow} 
          className="cursor-pointer p-1 rounded hover:bg-white/10 transition-colors duration-300"
        >
          {showValue ? (
            <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
          ) : (
            <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
          )}
        </div>
      </div>
      
      {/* Zone de saisie avec input invisible */}
      <div className="relative">
        {/* Input invisible pour la saisie */}
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          className={`absolute inset-0 w-full h-12 opacity-0 z-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          maxLength={6}
          {...props}
        />
        
        {/* Affichage OTP */}
        <div className="flex gap-3 justify-center">
          {digits.map((digit, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-mono transition-all duration-300 relative",
                disabled 
                  ? "border-white/10 bg-white/5 text-white/20 cursor-not-allowed"
                  : digit 
                    ? "border-[#FF671E] bg-[#FF671E]/10 text-white" 
                    : "border-white/20 bg-white/5 text-white/30",
                !disabled && index === value.length && "border-[#FF671E] bg-[#FF671E]/5 shadow-lg shadow-[#FF671E]/20"
              )}
              animate={{
                scale: !disabled && (isConfirmField ? hasUserInteractedWithConfirm : hasUserInteracted) && index === value.length ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                repeat: !disabled && (isConfirmField ? hasUserInteractedWithConfirm : hasUserInteracted) && index === value.length ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {digit ? (showValue ? digit : '•') : ''}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
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

export default function SetupPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isFirstPinComplete, setIsFirstPinComplete] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [hasUserInteractedWithConfirm, setHasUserInteractedWithConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [employeeInfo, setEmployeeInfo] = useState<{ nom: string; prenom: string } | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  
  // Refs pour les inputs PIN
  const pinInputRef = useRef<HTMLInputElement>(null);
  const confirmPinInputRef = useRef<HTMLInputElement>(null);

  // Récupérer le token depuis l'URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    } else {
      // Afficher un toast d'erreur au lieu de bloquer le formulaire
      setStatus('error');
      setMessage('Token d\'activation manquant. Veuillez utiliser le lien fourni dans votre email/SMS.');
      
      // Redirection automatique vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/login?error=missing_token');
      }, 3000);
    }
  }, [searchParams, router]);

  // Valider le token
  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch(`/api/employees/setup-password?token=${tokenToValidate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTokenValid(true);
        setEmployeeInfo(data.employee);
        setStatus('idle');
      } else {
        setTokenValid(false);
        setStatus('error');
        setMessage(data.error || 'Token invalide ou expiré');
      }
    } catch (error) {
      console.error('Erreur de validation du token:', error);
      setTokenValid(false);
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  // Validation du code PIN
  const isPinValid = pin.length === 6 && /^\d{6}$/.test(pin);
  const isConfirmPinValid = confirmPin === pin && pin.length === 6 && confirmPin.length === 6;
  const isFormValid = isPinValid && isConfirmPinValid && tokenValid;


  // Fonction pour gérer la saisie du PIN
  const handlePinChange = (value: string, setter: (value: string) => void) => {
    // Marquer que l'utilisateur a interagi
    setHasUserInteracted(true);
    
    // Ne garder que les chiffres et limiter à 6 caractères
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setter(numericValue);
    
    // Si c'est le premier PIN, vérifier s'il est complet
    if (setter === setPin) {
      setIsFirstPinComplete(numericValue.length === 6);
      // Si le premier PIN n'est plus complet, vider le PIN de confirmation
      if (numericValue.length < 6) {
        setConfirmPin("");
      }
    }
  };

  // Fonction pour gérer le focus sur le premier PIN
  const handleFirstPinFocus = () => {
    setFocusedInput("pin");
    setHasUserInteracted(true);
  };

  // Fonction pour gérer le focus sur le PIN de confirmation
  const handleConfirmPinFocus = () => {
    if (isFirstPinComplete) {
      setFocusedInput("confirmPin");
      setHasUserInteractedWithConfirm(true);
    }
  };

  // Fonction pour gérer le clic sur le champ de confirmation (même s'il est désactivé)
  const handleConfirmPinClick = () => {
    if (isFirstPinComplete) {
      setFocusedInput("confirmPin");
      setHasUserInteractedWithConfirm(true);
      confirmPinInputRef.current?.focus();
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !token) {
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/employees/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          pin: pin
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Code PIN défini avec succès ! Redirection vers la page de connexion...');
        
        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login?message=pin_setup_success');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur lors de la définition du code PIN');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  // Si le token n'est pas encore validé, afficher un loader
  if (tokenValid === null && token) {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#FF671E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Vérification de votre lien...</p>
        </div>
      </div>
    );
  }

  // Si le token est invalide, afficher un toast d'erreur mais continuer à afficher le formulaire
  if (tokenValid === false) {
    // Le toast sera affiché dans le JSX principal
  }

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* Toast d'erreur pour token manquant */}
      {status === 'error' && !token && (
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
                <p className="text-red-100 font-medium text-sm">Token d'activation manquant</p>
                <p className="text-red-200 text-xs mt-1">Redirection vers la page de connexion...</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toast d'erreur pour token invalide */}
      {tokenValid === false && (
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
                <p className="text-red-100 font-medium text-sm">Lien invalide ou expiré</p>
                <p className="text-red-200 text-xs mt-1">Veuillez utiliser un lien valide</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toast d'erreur pour les erreurs de soumission */}
      {status === 'error' && token && (
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
                <p className="text-red-100 font-medium text-sm">Erreur lors de la définition</p>
                <p className="text-red-200 text-xs mt-1">{message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bouton Retour */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white/90 text-[#FF671E] font-semibold rounded shadow transition-all z-20"
        style={{backdropFilter: 'blur(6px)'}}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
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
                  Définir votre code PIN
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  {employeeInfo 
                    ? `Bonjour ${employeeInfo.prenom} ${employeeInfo.nom}, définissez votre code PIN à 6 chiffres pour activer votre compte`
                    : 'Définissez votre code PIN à 6 chiffres pour activer votre compte'
                  }
                </motion.p>
              </div>

               {/* Messages de statut - seulement pour le succès */}
               <AnimatePresence>
                 {status === 'success' && (
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-center"
                   >
                     <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                     <p className="text-green-200 text-sm">{message}</p>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Formulaire de définition de code PIN */}
               <form onSubmit={handleSubmit} className="space-y-6">
                 <motion.div className="space-y-6">
                   {/* Code PIN */}
                   <motion.div 
                     className={`relative p-4 rounded-xl bg-white/5 border border-white/10 ${focusedInput === "pin" ? 'border-[#FF671E]/30 bg-[#FF671E]/5' : ''}`}
                     whileFocus={{ scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     onClick={() => {
                       setFocusedInput("pin");
                       setHasUserInteracted(true);
                       pinInputRef.current?.focus();
                     }}
                   >
                     <PinInput
                       ref={pinInputRef}
                       value={pin}
                       onChange={(value) => handlePinChange(value, setPin)}
                       onFocus={handleFirstPinFocus}
                       onBlur={() => setFocusedInput(null)}
                       placeholder="Code PIN (6 chiffres)"
                       showValue={showPin}
                       onToggleShow={() => setShowPin(!showPin)}
                       disabled={false}
                       hasUserInteracted={hasUserInteracted}
                     />
                     
                     {/* Indicateur de progression du PIN */}
                     {pin && (
                       <motion.div
                         initial={{ opacity: 0, y: -5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-4 text-xs"
                       >
                         <div className="flex items-center gap-2">
                           <div className="flex-1 bg-white/10 rounded-full h-1">
                             <div 
                               className={`h-1 rounded-full transition-all duration-300 ${
                                 pin.length === 6 ? 'bg-green-400' : 'bg-orange-400'
                               }`}
                               style={{ width: `${(pin.length / 6) * 100}%` }}
                             />
                           </div>
                           <span className={`text-xs ${
                             pin.length === 6 ? 'text-green-400' : 'text-orange-400'
                           }`}>
                             {pin.length === 6 ? '✓' : `${6 - pin.length} chiffres restants`}
                           </span>
                         </div>
                       </motion.div>
                     )}
                   </motion.div>

                   {/* Confirmation du code PIN */}
                   <motion.div 
                     className={`relative p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 ${
                       !isFirstPinComplete 
                         ? 'opacity-50 cursor-not-allowed' 
                         : focusedInput === "confirmPin" 
                           ? 'border-[#FF671E]/30 bg-[#FF671E]/5' 
                           : ''
                     }`}
                     whileFocus={isFirstPinComplete ? { scale: 1.01 } : {}}
                     whileTap={isFirstPinComplete ? { scale: 0.99 } : {}}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     onClick={handleConfirmPinClick}
                   >
                     <PinInput
                       ref={confirmPinInputRef}
                       value={confirmPin}
                       onChange={(value) => handlePinChange(value, setConfirmPin)}
                       onFocus={handleConfirmPinFocus}
                       onBlur={() => setFocusedInput(null)}
                       placeholder="Confirmer le code PIN"
                       showValue={showConfirmPin}
                       onToggleShow={() => isFirstPinComplete && setShowConfirmPin(!showConfirmPin)}
                       disabled={!isFirstPinComplete}
                       hasUserInteracted={hasUserInteracted}
                       hasUserInteractedWithConfirm={hasUserInteractedWithConfirm}
                       isConfirmField={true}
                       label="Confirmation du code PIN"
                     />
                     
                     {/* Message d'aide ou indicateur de correspondance */}
                     {!isFirstPinComplete ? (
                       <motion.div
                         initial={{ opacity: 0, y: -5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-4 text-xs text-white/40 text-center"
                       >
                         Complétez d'abord le code PIN ci-dessus
                       </motion.div>
                     ) : confirmPin ? (
                       <motion.div
                         initial={{ opacity: 0, y: -5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-4 text-xs"
                       >
                         <div className="flex items-center gap-2">
                           <span className={`text-xs ${
                             isConfirmPinValid ? 'text-green-400' : 'text-red-400'
                           }`}>
                             {isConfirmPinValid ? '✓ Codes PIN identiques' : '✗ Codes PIN différents'}
                           </span>
                         </div>
                       </motion.div>
                     ) : (
                       <motion.div
                         initial={{ opacity: 0, y: -5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-4 text-xs text-white/60 text-center"
                       >
                         Maintenant, confirmez votre code PIN
                       </motion.div>
                     )}
                   </motion.div>
                 </motion.div>


                {/* Bouton de soumission */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isFormValid || status === 'loading' || status === 'success' || !tokenValid}
                  className="w-full relative group/button mt-6"
                >
                  <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                  
                  <div className={`relative overflow-hidden text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    isFormValid && status !== 'loading' && status !== 'success' 
                      ? 'bg-[#FF671E]' 
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
                          <span className="text-sm font-medium">Code PIN défini !</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          Définir le code PIN
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Informations de sécurité */}
                <motion.div 
                  className="text-center text-xs text-white/60 mt-4 p-3 bg-white/5 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Shield className="w-4 h-4 mx-auto mb-2 text-white/40" />
                  <p>Votre code PIN doit contenir exactement 6 chiffres</p>
                  <p className="mt-1">Ce lien ne peut être utilisé qu'une seule fois</p>
                </motion.div>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
