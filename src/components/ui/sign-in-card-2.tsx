'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Lock, Eye, EyeClosed, ArrowRight, Mail, CheckCircle, AlertCircle, User } from 'lucide-react';

import { cn } from "@/lib/utils"
import Image from 'next/image';
import { Button } from './button';


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

export function Component() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
    setIsLoading(true);
    setLoginStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setLoginStatus('success');
        
        // Stocker l'email si "Se souvenir de moi" est coché
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirection après succès
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        setLoginStatus('error');
        setErrorMessage(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setLoginStatus('error');
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'email mémorisé au montage du composant
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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
      {/* Background gradient effect - matches the purple OnlyPipe style */}
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
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Card glow effect - reduced intensity */}
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

              {/* Traveling light beam effect - reduced opacity */}
              <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                {/* Top light beam - enhanced glow */}
                <motion.div 
                  className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{ 
                    left: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{ 
                    left: {
                      duration: 2.5, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                      repeatDelay: 1
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror"
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror"
                    }
                  }}
                />
                
                {/* Right light beam - enhanced glow */}
                <motion.div 
                  className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{ 
                    top: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{ 
                    top: {
                      duration: 2.5, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: 0.6
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.6
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 0.6
                    }
                  }}
                />
                
                {/* Bottom light beam - enhanced glow */}
                <motion.div 
                  className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{ 
                    right: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{ 
                    right: {
                      duration: 2.5, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: 1.2
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.2
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.2
                    }
                  }}
                />
                
                {/* Left light beam - enhanced glow */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                  initial={{ filter: "blur(2px)" }}
                  animate={{ 
                    bottom: ["-50%", "100%"],
                    opacity: [0.3, 0.7, 0.3],
                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                  }}
                  transition={{ 
                    bottom: {
                      duration: 2.5, 
                      ease: "easeInOut", 
                      repeat: Infinity,
                      repeatDelay: 1,
                      delay: 1.8
                    },
                    opacity: {
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.8
                    },
                    filter: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1.8
                    }
                  }}
                />
                
                {/* Subtle corner glow spots - reduced opacity */}
                <motion.div 
                  className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                <motion.div 
                  className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    duration: 2.4, 
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.5
                  }}
                />
                <motion.div 
                  className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1
                  }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2] 
                  }}
                  transition={{ 
                    duration: 2.3, 
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.5
                  }}
                />
              </div>

              {/* Card border glow - reduced opacity */}
              <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              
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
                    {/* Logo placeholder - would be an SVG in practice */}
                    {/* <!-- SVG_LOGO --> */}
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

                  {loginStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                      <p className="text-red-200 text-sm">{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login form */}
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
                        className="rounded border-white/20 bg-white/5 text-[#FF671E] focus:ring-[#FF671E] focus:ring-offset-0"
                      />
                      <span className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                        Se souvenir de moi
                      </span>
                    </label>
                    
                    <Button 
                      onClick={() => router.push('/auth/forgot-password')}
                      asChild
                      className="text-white/60 hover:text-white transition-colors duration-300 bg-transparent border-none"
                    >
                      <Link href="/auth/forgot-password">Mot de passe oublié ?</Link>
                    </Button>
                  </div>

                  {/* Sign in button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || loginStatus === 'success'}
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
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

