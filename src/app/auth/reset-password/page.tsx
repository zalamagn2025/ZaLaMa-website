// reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BackgroundEffects } from '@/components/ui/background-effects';

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`
        file:text-foreground placeholder:text-muted-foreground 
        selection:bg-primary selection:text-primary-foreground 
        dark:bg-input/30 border-input flex h-10 w-full min-w-0 
        rounded-md border bg-white/5 px-3 py-1 text-base shadow-xs 
        transition-[color,box-shadow] outline-none 
        file:inline-flex file:h-7 file:border-0 file:bg-transparent 
        file:text-sm file:font-medium disabled:pointer-events-none 
        disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
        focus-visible:border-ring focus-visible:ring-ring/50 
        focus-visible:ring-[3px] text-white
        aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
        aria-invalid:border-destructive
        ${className}
      `}
      {...props}
    />
  );
}

async function determineUserType(supabase: any, email: string): Promise<'employee' | 'manager' | 'rh'> {
  try {
    // Vérifier d'abord dans la table users (responsables/RH)
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!usersError && usersData) {
      if (usersData.role === 'responsable') {
        return 'manager';
      } else if (usersData.role === 'rh') {
        return 'rh';
      }
    }
    
    // Si pas trouvé dans users, vérifier dans employees
    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();
    
    if (!employeesError && employeesData) {
      return 'employee';
    }
    
    return 'employee';
  } catch (error) {
    console.error('Erreur lors de la détermination du type utilisateur:', error);
    return 'employee';
  }
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [status, setStatus] = useState<'verifying' | 'ready' | 'success' | 'error' | 'loading'>('verifying');
  const [message, setMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PRIVATE_SUPABASE_URL!,
    process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY!
  );

  // Détecter si c'est un changement de mot de passe depuis les paramètres
  const isChangePasswordMode = !oobCode;

  useEffect(() => {
    if (isChangePasswordMode) {
      // Mode changement de mot de passe depuis les paramètres
      setStatus('ready');
      return;
    }

    // Mode réinitialisation par lien (logique existante)
    const verifyCodeAndGetEmail = async () => {
      if (!oobCode) {
        setStatus('error');
        setMessage('Lien de réinitialisation invalide');
        return;
      }

      try {
        // Pour Supabase, on utilise directement le code de réinitialisation
        // Le code contient généralement l'email
        setEmail('user@example.com'); // Placeholder - à adapter selon votre logique
        setStatus('ready');
      } catch (error) {
        console.error('Erreur:', error);
        setStatus('error');
        setMessage('Le lien de réinitialisation est invalide ou a expiré');
      }
    };

    verifyCodeAndGetEmail();
  }, [oobCode, isChangePasswordMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isChangePasswordMode) {
      // Mode changement de mot de passe
      if (!currentPassword || !password || !confirmPassword) {
        setStatus('error');
        setMessage('Veuillez remplir tous les champs');
        return;
      }

      if (password !== confirmPassword) {
        setStatus('error');
        setMessage('Les mots de passe ne correspondent pas');
        return;
      }

      setStatus('loading');
      setMessage('');

      try {
        const response = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword: password
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setMessage(data.error || 'Erreur lors du changement de mot de passe');
          return;
        }

        setStatus('success');
        setMessage('Mot de passe changé avec succès');

        // Déconnexion et redirection après 1 seconde (au lieu de 2)
        setTimeout(async () => {
          try {
            await supabase.auth.signOut();
            // Redirection immédiate
            window.location.href = '/login?message=password_changed';
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // Redirection même en cas d'erreur
            window.location.href = '/login?message=password_changed';
          }
        }, 1000);

      } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        setStatus('error');
        setMessage('Erreur lors du changement de mot de passe');
      }
      return;
    }

    // Mode réinitialisation par lien (logique existante)
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

    setStatus('loading');
    setMessage('');

    try {
      // Pour Supabase, utilisez la méthode de réinitialisation appropriée
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setStatus('success');
      setMessage('Mot de passe réinitialisé avec succès');
      
      // Déterminer le type d'utilisateur et rediriger
      const userType = await determineUserType(supabase, email);
      const redirectUrl = userType === 'employee' 
        ? 'https://zalamasas.com/login'
        : 'https://partner.zalamasas.com/login';
        
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setStatus('error');
      setMessage('Une erreur est survenue lors de la réinitialisation');
    }
  };

  // Afficher un indicateur de chargement pendant la vérification
  if (status === 'verifying') {
    return (
      <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center bg-black">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#FF671E]/20 blur-[80px]" />
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/60">Vérification du lien de réinitialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <BackgroundEffects />
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center ">
      {/* Background effects */}
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

      {/* Card */}
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
                {isChangePasswordMode ? 'Changer le mot de passe' : 'Réinitialiser le mot de passe'}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-sm px-2"
              >
                {isChangePasswordMode ? 'Entrez votre ancien et nouveau mot de passe' : 'Entrez votre nouveau mot de passe'}
              </motion.p>
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center"
                >
                  <XCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                  <p className="text-red-200 text-sm">{message}</p>
                </motion.div>
              )}

              {status === 'success' ? (
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
                      {isChangePasswordMode ? 'Mot de passe changé avec succès' : 'Mot de passe réinitialisé avec succès'}
                    </p>
                    <p className="text-white/40 text-xs px-2 mt-3">
                      {isChangePasswordMode ? 'Déconnexion et redirection vers la page de connexion...' : 'Redirection en cours...'}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Ancien mot de passe (uniquement en mode changement) */}
                  {isChangePasswordMode && (
                    <motion.div 
                      className={`relative ${focusedInput === "currentPassword" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "currentPassword" ? 'text-white' : 'text-white/40'
                        }`} />
                        
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Mot de passe actuel"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          onFocus={() => setFocusedInput("currentPassword")}
                          onBlur={() => setFocusedInput(null)}
                          required
                          className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                        />
                        
                        <button 
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                          className="absolute right-3 text-white/40 hover:text-white transition-colors duration-300"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

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
                        placeholder={isChangePasswordMode ? "Nouveau mot de passe" : "Nouveau mot de passe"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                      />
                      
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 text-white/40 hover:text-white transition-colors duration-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

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
                        placeholder="Confirmation du nouveau mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedInput("confirmPassword")}
                        onBlur={() => setFocusedInput(null)}
                        required
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                      />
                      
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute right-3 text-white/40 hover:text-white transition-colors duration-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status === 'loading' || 
                      (isChangePasswordMode ? (!currentPassword || !password || !confirmPassword) : (!password || !confirmPassword))}
                    className="w-full relative group/button mt-6"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                    
                    <div className="relative overflow-hidden bg-[#FF671E] disabled:bg-gray-600 disabled:opacity-50 text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
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
                        ) : (
                          <motion.span
                            key="button-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-1 text-sm font-medium"
                          >
                            {isChangePasswordMode ? 'Changer le mot de passe' : 'Réinitialiser le mot de passe'}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>

                  {/* Bouton Annuler (uniquement en mode changement de mot de passe) */}
                  {isChangePasswordMode && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => router.push('/profile')}
                      disabled={status === 'loading'}
                      className="w-full relative group/button mt-3"
                    >
                      <div className="absolute inset-0 bg-white/5 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                      
                      <div className="relative overflow-hidden bg-white/10 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center border border-white/20">
                        <motion.span
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          Annuler
                        </motion.span>
                      </div>
                    </motion.button>
                  )}
                </form>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4 text-center"
            >
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
}