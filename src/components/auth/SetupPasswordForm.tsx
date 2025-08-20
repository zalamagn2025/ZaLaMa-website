"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeClosed, ArrowRight, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [employeeInfo, setEmployeeInfo] = useState<{ nom: string; prenom: string } | null>(null);

  // Récupérer le token depuis l'URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    } else {
      setStatus('error');
      setMessage('Token d\'activation manquant. Veuillez utiliser le lien fourni dans votre email/SMS.');
    }
  }, [searchParams]);

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

  // Validation du mot de passe
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = confirmPassword === password && password.length > 0;
  const isFormValid = isPasswordValid && isConfirmPasswordValid && tokenValid;

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
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Mot de passe défini avec succès ! Redirection vers la page de connexion...');
        
        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login?message=password_setup_success');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur lors de la définition du mot de passe');
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

  // Si le token est invalide, afficher un message d'erreur
  if (tokenValid === false) {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-sm relative z-10">
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              <h1 className="text-xl font-bold text-white">Lien invalide</h1>
              <p className="text-white/60 text-sm">{message}</p>
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-[#FF671E] text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
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
                  Définir votre mot de passe
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  {employeeInfo 
                    ? `Bonjour ${employeeInfo.prenom} ${employeeInfo.nom}, définissez votre mot de passe pour activer votre compte`
                    : 'Définissez votre mot de passe pour activer votre compte'
                  }
                </motion.p>
              </div>

              {/* Messages de statut */}
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

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                    <p className="text-red-200 text-sm">{message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire de définition de mot de passe */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div className="space-y-3">
                  {/* Mot de passe */}
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
                        placeholder="Nouveau mot de passe"
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
                    
                    {/* Indicateur de force du mot de passe */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${
                                password.length >= 6 ? 'bg-green-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${Math.min((password.length / 6) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs ${
                            password.length >= 6 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {password.length >= 6 ? '✓' : `${6 - password.length} caractères restants`}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Confirmation du mot de passe */}
                  <motion.div 
                    className={`relative ${focusedInput === "confirmPassword" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Shield className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "confirmPassword" ? 'text-white' : 'text-white/40'
                      }`} />
                      
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedInput("confirmPassword")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                      />
                      
                      <div 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute right-3 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        ) : (
                          <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        )}
                      </div>
                      
                      {focusedInput === "confirmPassword" && (
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
                    
                    {/* Indicateur de correspondance */}
                    {confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${
                            isConfirmPasswordValid ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {isConfirmPasswordValid ? '✓ Mots de passe identiques' : '✗ Mots de passe différents'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Bouton de soumission */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isFormValid || status === 'loading' || status === 'success'}
                  className="w-full relative group/button mt-5"
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
                          <span className="text-sm font-medium">Mot de passe défini !</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          Définir le mot de passe
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
                  <p>Votre mot de passe doit contenir au moins 6 caractères</p>
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
