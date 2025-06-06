'use client'
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Eye, EyeClosed, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [oobCode, setOobCode] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
      // Vérifier la validité du code
      verifyResetCode(code);
    } else {
      setStatus('error');
      setMessage('Lien de réinitialisation invalide');
    }
  }, [searchParams]);

  const verifyResetCode = async (code: string) => {
    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oobCode: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || 'Lien de réinitialisation invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      setStatus('error');
      setMessage('Erreur lors de la vérification du lien');
    }
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Au moins 8 caractères');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Une minuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Un chiffre');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      setStatus('error');
      setMessage('Code de réinitialisation manquant');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setStatus('error');
      setMessage(`Mot de passe invalide. Requis : ${passwordErrors.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oobCode,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Mot de passe réinitialisé avec succès');
        // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login');
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

  const passwordErrors = validatePassword(password);
  const isPasswordValid = password.length > 0 && passwordErrors.length === 0;

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* Bouton Retour */}
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white/90 text-[#FF671E] font-semibold rounded shadow transition-all z-20"
        style={{backdropFilter: 'blur(6px)'}}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la connexion
      </Link>

      {/* Background effects - same as other pages */}
      <div className="absolute inset-0" />
      
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

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

      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
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
                className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden"
              >
                <Image 
                  src="/images/zalamaLoginLogo.png" 
                  alt="ZaLaMa Logo" 
                  width={48}
                  height={48}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
              >
                Nouveau mot de passe
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm px-2"
              >
                Choisissez un nouveau mot de passe sécurisé
              </motion.p>
            </div>

            {status !== 'success' ? (
              <>
                {/* Messages de statut */}
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                      <p className="text-red-200 text-sm">{message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    </div>
                  </motion.div>

                  {/* Password validation */}
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs space-y-1"
                    >
                      {passwordErrors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-red-400">
                          <div className="w-1 h-1 bg-red-400 rounded-full" />
                          {error}
                        </div>
                      ))}
                      {isPasswordValid && (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Mot de passe valide
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Confirm Password input */}
                  <motion.div 
                    className={`relative ${focusedInput === "confirmPassword" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
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
                    </div>
                  </motion.div>

                  {/* Password match validation */}
                  {confirmPassword.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs"
                    >
                      {password === confirmPassword ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Les mots de passe correspondent
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <div className="w-1 h-1 bg-red-400 rounded-full" />
                          Les mots de passe ne correspondent pas
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !isPasswordValid || password !== confirmPassword || !oobCode}
                    className="w-full relative group/button mt-6"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                    
                    <div className="relative overflow-hidden bg-[#FF671E] disabled:bg-gray-600 disabled:opacity-50 text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
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
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1 text-sm font-medium"
                          >
                            Réinitialiser le mot de passe
                            <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </form>
              </>
            ) : (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-green-900/20 border border-green-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Succès !</h3>
                  <p className="text-white/60 text-sm px-2">
                    {message}
                  </p>
                  <p className="text-white/40 text-xs px-2 mt-3">
                    Redirection vers la connexion...
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4"
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Aller à la connexion
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 