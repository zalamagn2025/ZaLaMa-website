"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeClosed, ArrowRight, Mail, CheckCircle, AlertCircle, User, ArrowLeft, Users, Plus, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { useEmployeeAuth } from "@/contexts/EmployeeAuthContext";
import { useAccountAuth } from "@/contexts/AccountAuthContext";
import { AccountSession } from "@/types/account-session";
import PinInput from "@/components/common/PinInput";
import AccountSelectorCard from "./AccountSelectorCard";
import QuickPinVerificationCard from "./QuickPinVerificationCard";

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

export default function EmployeeLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPin, setShowPin] = useState(false);
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // États pour la gestion multi-comptes
  const [currentStep, setCurrentStep] = useState<'account-select' | 'pin-verification' | 'full-login'>('account-select');
  const [selectedAccount, setSelectedAccount] = useState<AccountSession | null>(null);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  // Utiliser les contextes d'authentification
  const { loading, error } = useEmployeeAuth();
  const {
    accounts,
    lastUsedAccount,
    accountsLoading,
    accountsError,
    removeAccount,
    verifyPin,
    quickLogin,
    login // Utiliser la fonction login du AccountAuthContext
  } = useAccountAuth();

  // Fonction pour gérer la saisie du PIN
  const handlePinChange = (value: string) => {
    // Filtrer pour ne garder que les chiffres
    const numericValue = value.replace(/\D/g, '');
    // Limiter à 6 chiffres
    const limitedValue = numericValue.slice(0, 6);
    setPin(limitedValue);
    setHasUserInteracted(true);
  };

  // Fonction pour gérer le focus du PIN
  const handlePinFocus = () => {
    setHasUserInteracted(true);
  };

  // Fonction pour gérer le blur du PIN
  const handlePinBlur = () => {
    // Blur géré par le composant PinInput
  };

  // Fonction pour basculer la visibilité du PIN
  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  // Fonctions pour la gestion multi-comptes
  const handleAccountSelect = (account: AccountSession) => {
    setSelectedAccount(account);
    setEmail(account.email);
    setCurrentStep('pin-verification');
  };

  const handleQuickLogin = async (account: AccountSession, pin: string) => {
    // console.log('🚀 handleQuickLogin appelé !', {
    //   account: account.email,
    //   pin: pin,
    //   pinLength: pin.length
    // });
    
    setQuickLoginLoading(true);
    setErrorMessage('');
    setLoginStatus('idle');
    
    try {
      // console.log('🔄 Appel de quickLogin...');
      await quickLogin(account, pin);
      // console.log('✅ quickLogin réussi');
      setLoginStatus('success');
      
      // Redirection immédiate vers /profile
      // console.log('🔄 Redirection immédiate vers /profile');
      router.push('/profile');
    } catch (error) {
      // console.log('❌ Erreur dans quickLogin:', error);
      setErrorMessage('Connexion échouée. Vérifiez votre PIN.');
      setLoginStatus('error');
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const handleNewAccount = () => {
    // console.log('🆕 handleNewAccount appelé !');
    setCurrentStep('full-login');
    setEmail('');
    setPin('');
    setSelectedAccount(null);
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      await removeAccount(accountId);
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression du compte.');
      setLoginStatus('error');
    }
  };

  const handleBackToAccountSelect = () => {
    setCurrentStep('account-select');
    setSelectedAccount(null);
    setEmail('');
    setPin('');
  };

  // Vérifier si l'utilisateur arrive après un changement de mot de passe
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'password_changed') {
      setShowSuccessMessage(true);
      // Masquer le message après 5 secondes
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } else if (message === 'password_setup_success') {
      setShowSuccessMessage(true);
      setErrorMessage('');
      // Masquer le message après 5 secondes
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [searchParams]);

  // Initialiser l'état en fonction des comptes disponibles
  useEffect(() => {
    if (!accountsLoading && accounts.length > 0) {
      setCurrentStep('account-select');
    } else if (!accountsLoading && accounts.length === 0) {
      setCurrentStep('full-login');
    }
  }, [accountsLoading, accounts.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('idle');
    setErrorMessage('');

    if (!email || !pin) {
      return;
    }

    // Validation du PIN (6 chiffres)
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setErrorMessage('Le code PIN doit contenir exactement 6 chiffres');
      setLoginStatus('error');
      return;
    }

    try {
      // Connexion complète
      await login(email, pin);
      
      // Stocker l'email si "Se souvenir de moi" est coché
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      setLoginStatus('success');
      
      // Redirection après succès
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      setLoginStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erreur de connexion');
      console.error('Erreur de connexion:', err);
    }
  };


  // Fonction pour basculer vers le mode mot de passe oublié
  const switchToForgotPassword = () => {
    /*console.log('switchToForgotPassword called')*/
    /*console.log('Current email:', email)*/
    // Rediriger vers la page de réinitialisation avec l'email pré-rempli
    const emailParam = email ? `?email=${encodeURIComponent(email)}` : '';
    router.push(`/auth/reset-password${emailParam}`);
  };


  // Charger l'email mémorisé au montage du composant
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);


  // Auto-dismiss des toasts d'erreur et de succès après 5 secondes
  useEffect(() => {
    if (loginStatus === 'error') {
      const timer = setTimeout(() => {
        setLoginStatus('idle');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginStatus]);

  useEffect(() => {
    if (loginStatus === 'success') {
      const timer = setTimeout(() => {
        setLoginStatus('idle');
      }, 3000); // Plus court pour le succès car il y a redirection
      return () => clearTimeout(timer);
    }
  }, [loginStatus]);


  const IdentifierIcon = email ? Mail : User;

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* Toast d'erreur pour les erreurs de connexion */}
      {(loginStatus === 'error' || error) && (
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
                <p className="text-red-100 font-medium text-sm">Erreur de connexion</p>
                <p className="text-red-200 text-xs mt-1">{errorMessage || error}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}


      {/* Toast de succès pour la connexion */}
      {loginStatus === 'success' && (
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
                <p className="text-green-100 font-medium text-sm">Connexion réussie</p>
                <p className="text-green-200 text-xs mt-1">Redirection vers votre profil...</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}


      {/* Bouton Retour */}
      <button
        type="button"
        onClick={() => router && router.push ? router.push("/") : window.location.assign("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white/90 text-[#FF671E] font-semibold rounded shadow transition-all z-20"
        style={{backdropFilter: 'blur(6px)'}}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Retour
      </button>
      
      {/* Background gradient effect */}
      <div className="absolute inset-0 pointer-events-none" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#FF671E]/20 blur-[80px] pointer-events-none" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#FF671E]/20 blur-[60px] pointer-events-none"
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
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#FF671E]/20 blur-[60px] pointer-events-none"
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
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40 pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          // Temporairement désactiver les effets 3D pour tester
          // style={{ rotateX, rotateY }}
          // onMouseMove={handleMouseMove}
          // onMouseLeave={handleMouseLeave}
          // whileHover={{ z: 10 }}
        >
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
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
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
                  Connexion Employé
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  Accédez à votre espace personnel
                </motion.p>
              </div>

              {/* Messages de statut */}
              <AnimatePresence>
                {showSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <p className="text-green-200 text-sm">
                      {searchParams.get('message') === 'password_setup_success' 
                        ? 'Votre compte a été activé avec succès ! Vous pouvez maintenant vous connecter.'
                        : 'Votre code PIN a été mis à jour avec succès. Veuillez vous reconnecter.'
                      }
                    </p>
                  </motion.div>
                )}



              </AnimatePresence>

              {/* Contenu conditionnel selon l'étape */}
              <AnimatePresence mode="wait">
                {currentStep === 'account-select' && (
                  <motion.div
                    key="account-select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <AccountSelectorCard
                      accounts={accounts}
                      lastUsedAccount={lastUsedAccount}
                      loading={accountsLoading}
                      onAccountSelect={handleAccountSelect}
                      onNewAccount={handleNewAccount}
                      onRemoveAccount={handleRemoveAccount}
                    />
                  </motion.div>
                )}

                {currentStep === 'pin-verification' && selectedAccount && (
                  <motion.div
                    key="pin-verification"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuickPinVerificationCard
                      account={selectedAccount}
                      onSuccess={(pin) => handleQuickLogin(selectedAccount, pin)}
                      onCancel={handleBackToAccountSelect}
                      onError={setErrorMessage}
                      onRemoveAccount={handleRemoveAccount}
                      loading={quickLoginLoading}
                    />
                  </motion.div>
                )}

                {currentStep === 'full-login' && (
                  <motion.div
                    key="full-login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    {/* Email input */}
                    <div className="relative">
                      <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10 focus-within:border-white/20 focus-within:bg-white/10 transition-all duration-300">
                        <IdentifierIcon className="absolute left-3 w-4 h-4 text-white/40" />
                        
                        <Input
                          type="email"
                          placeholder="Email professionnel"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => {}}
                          onBlur={() => {}}
                          required
                          className="w-full bg-transparent border-transparent text-white placeholder:text-white/30 h-10 pl-10 pr-4 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* PIN input */}
                    <div className="relative">
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
                  </div>

                  {/* Remember me and forgot password */}
                  <div className="flex items-center justify-between text-sm mt-3">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF671E] focus:ring-[#FF671E] focus:ring-offset-0 cursor-pointer appearance-none checked:bg-[#FF671E] checked:border-[#FF671E] relative"
                        style={{
                          backgroundImage: rememberMe ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")' : 'none',
                          backgroundSize: '12px 12px',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      <span className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                        Se souvenir de moi
                      </span>
                    </label>
                    
                    <div 
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        /*console.log('Button clicked!')*/
                        switchToForgotPassword();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          /*console.log('Button pressed with keyboard!')*/
                          switchToForgotPassword();
                        }
                      }}
                      className="text-white/60 hover:text-white transition-colors duration-300 bg-transparent border-none text-sm cursor-pointer px-2 py-1 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 relative z-50"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Code PIN oublié ?
                    </div>
                  </div>

                  {/* Sign in button */}
                  <button
                    type="submit"
                    disabled={loading || loginStatus === 'success'}
                    className="w-full bg-[#FF671E] hover:bg-[#FF671E]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center mt-5 relative z-50 cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2" />
                        Connexion...
                      </div>
                    ) : loginStatus === 'success' ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Connecté !
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Se connecter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    )}
                  </button>

                  {/* Bouton retour vers sélection des comptes */}
                  {accounts.length > 0 && (
                    <motion.button
                      type="button"
                      onClick={handleBackToAccountSelect}
                      className="w-full p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <ArrowLeft className="w-4 h-4 text-white/60" />
                        <span className="text-white/60 text-sm">Retour aux comptes</span>
                      </div>
                    </motion.button>
                  )}

                  {/* Minimal Divider */}
                  <div className="relative mt-2 mb-5 flex items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <motion.span 
                      className="mx-3 text-xs text-white/40"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: [0.7, 0.9, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ou
                    </motion.span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                                     {/* Sign up link */}
                   <motion.div 
                     className="text-center text-xs text-white/60 mt-4"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 0.5 }}
                   >
                     <p>Vous n&apos;avez pas de compte ? 
                       <button
                         type="button"
                         onClick={() => router.push('/register')}
                         className="inline-flex items-center gap-1 text-[#FF671E] hover:text-[#FF8533] transition-colors font-medium cursor-pointer px-2 py-1 rounded hover:bg-white/5 underline underline-offset-2 relative z-50"
                         style={{ pointerEvents: 'auto' }}
                       >
                         S&apos;inscrire
                         <ArrowRight className="w-3 h-3" />
                       </button>
                     </p>
                   </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
