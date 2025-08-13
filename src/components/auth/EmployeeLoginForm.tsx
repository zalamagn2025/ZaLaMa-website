"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Lock, Eye, EyeClosed, ArrowRight, Mail, CheckCircle, AlertCircle, User, ArrowLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { useEmployeeAuth } from "@/contexts/EmployeeAuthContext";

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
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // États pour le mot de passe oublié
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  // Utiliser le contexte d'authentification employé
  const { login, loading, error } = useEmployeeAuth();

  // Vérifier si l'utilisateur arrive après un changement de mot de passe
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'password_changed') {
      setShowSuccessMessage(true);
      // Masquer le message après 5 secondes
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [searchParams]);

  // For 3D card effect - increased rotation range for more pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]); // Increased from 5/-5 to 10/-10
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]); // Increased from -5/5 to -10/10

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('idle');
    setErrorMessage('');

    if (!email || !password) {
      return;
    }

    try {
      await login(email, password);
      
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

  // Fonction pour gérer la demande de mot de passe oublié
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsForgotPasswordLoading(true);
    setForgotPasswordStatus('idle');
    setForgotPasswordMessage('');

    try {
      const response = await fetch('/api/auth/send-reset-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setForgotPasswordStatus('success');
        setForgotPasswordMessage('Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.');
      } else {
        setForgotPasswordStatus('error');
        setForgotPasswordMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setForgotPasswordStatus('error');
      setForgotPasswordMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  // Fonction pour basculer vers le mode mot de passe oublié
  const switchToForgotPassword = () => {
    console.log('switchToForgotPassword called');
    console.log('Current email:', email);
    setForgotPasswordEmail(email); // Pré-remplir avec l'email actuel
    setIsForgotPasswordMode(true);
    setForgotPasswordStatus('idle');
    setForgotPasswordMessage('');
    console.log('State updated, isForgotPasswordMode should be true');
  };

  // Fonction pour revenir au mode connexion
  const switchToLogin = () => {
    setIsForgotPasswordMode(false);
    setForgotPasswordStatus('idle');
    setForgotPasswordMessage('');
  };

  // Charger l'email mémorisé au montage du composant
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Debug: Surveiller les changements d'état
  useEffect(() => {
    console.log('isForgotPasswordMode changed:', isForgotPasswordMode);
  }, [isForgotPasswordMode]);

  // Fonction pour obtenir l'icône appropriée
  const getIdentifierIcon = () => {
    if (email) return Mail;
    return User;
  };

  const IdentifierIcon = getIdentifierIcon();

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
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
                  {isForgotPasswordMode ? 'Mot de passe oublié' : 'Connexion Employé'}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  {isForgotPasswordMode 
                    ? 'Saisissez votre email pour recevoir un lien de réinitialisation'
                    : 'Accédez à votre espace personnel'
                  }
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
                    <p className="text-green-200 text-sm">Votre mot de passe a été mis à jour avec succès. Veuillez vous reconnecter.</p>
                  </motion.div>
                )}

                {loginStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <p className="text-green-200 text-sm">Connexion réussie ! Redirection...</p>
                  </motion.div>
                )}

                {(loginStatus === 'error' || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                    <p className="text-red-200 text-sm">{errorMessage || error}</p>
                  </motion.div>
                )}

                {/* Messages pour le mot de passe oublié */}
                {isForgotPasswordMode && forgotPasswordStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-lg flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <p className="text-green-200 text-sm">{forgotPasswordMessage}</p>
                  </motion.div>
                )}

                {isForgotPasswordMode && forgotPasswordStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                    <p className="text-red-200 text-sm">{forgotPasswordMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire de connexion */}
              {!isForgotPasswordMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div className="space-y-3">
                    {/* Email input */}
                    <motion.div 
                      className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <IdentifierIcon className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "email" ? 'text-white' : 'text-white/40'
                        }`} />
                        
                        <Input
                          type="email"
                          placeholder="Email professionnel"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput("email")}
                          onBlur={() => setFocusedInput(null)}
                          required
                          className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 focus:bg-white/10"
                        />
                        
                        {focusedInput === "email" && (
                          <motion.div 
                            layoutId="input-highlight"
                            className="absolute inset-0 bg-white/5 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Password input */}
                    <motion.div 
                      className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "password" ? 'text-white' : 'text-white/40'
                        }`} />
                        
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedInput("password")}
                          onBlur={() => setFocusedInput(null)}
                          required
                          className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                        />
                        
                        <div 
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-3 cursor-pointer"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                          ) : (
                            <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                          )}
                        </div>
                        
                        {focusedInput === "password" && (
                          <motion.div 
                            layoutId="input-highlight"
                            className="absolute inset-0 bg-white/5 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  </motion.div>

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
                        console.log('Button clicked!');
                        switchToForgotPassword();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          console.log('Button pressed with keyboard!');
                          switchToForgotPassword();
                        }
                      }}
                      className="text-white/60 hover:text-white transition-colors duration-300 bg-transparent border-none text-sm cursor-pointer px-2 py-1 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 relative z-50"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Mot de passe oublié ?
                    </div>
                  </div>

                  {/* Sign in button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || loginStatus === 'success'}
                    className="w-full relative group/button mt-5"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                    
                    <div className="relative overflow-hidden bg-[#FF671E] text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        ) : loginStatus === 'success' ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Connecté !</span>
                          </motion.div>
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1 text-sm font-medium"
                          >
                            Se connecter
                            <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

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
                  <motion.p 
                    className="text-center text-xs text-white/60 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Vous n&apos;avez pas de compte ? Contactez votre RH
                  </motion.p>
                </form>
              ) : (
                /* Formulaire de mot de passe oublié */
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <motion.div 
                    className={`relative ${focusedInput === 'forgot-email' ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === 'forgot-email' ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder="Votre adresse email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        onFocus={() => setFocusedInput('forgot-email')}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-4 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isForgotPasswordLoading}
                    className="w-full relative group/button mt-6"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                    
                    <div className="relative overflow-hidden bg-[#FF671E] disabled:bg-gray-600 disabled:opacity-50 text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {isForgotPasswordLoading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1 text-sm font-medium"
                          >
                            Envoyer le lien de réinitialisation
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  {/* Bouton retour */}
                  <motion.button
                    type="button"
                    onClick={switchToLogin}
                    className="w-full text-white/60 hover:text-white transition-colors text-sm mt-4 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la connexion
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
