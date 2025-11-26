'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState('');
const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
const [recaptchaKey, setRecaptchaKey] = useState(0);
const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Récupérer le token depuis l'URL (query params OU hash)
    let accessToken = searchParams.get('access_token');
    let refreshToken = searchParams.get('refresh_token');
    let type = searchParams.get('type');

    // Si pas dans les query params, vérifier le hash (# dans l'URL)
    if (!accessToken && typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1); // Enlever le #
      const hashParams = new URLSearchParams(hash);
      accessToken = hashParams.get('access_token');
      refreshToken = hashParams.get('refresh_token');
      type = hashParams.get('type');

      // Mettre à jour la session Supabase avec le token du hash
      if (accessToken && type === 'recovery') {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        }).then(({ data, error }) => {
          if (error) {
            console.error('Erreur lors de la configuration de la session:', error);
          } else {
            console.log('✅ Session configurée avec succès');
          }
        });
      }
    }

    if (accessToken && type === 'recovery') {
      setToken(accessToken);
      setIsValidToken(true);
      setMessage('Veuillez entrer votre nouveau mot de passe.');
      setMessageType('info');
    } else {
      setMessage('Lien de réinitialisation invalide ou expiré.');
      setMessageType('error');
      setIsValidToken(false);
    }
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      setMessageType('error');
      return;
    }

    if (password.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères.');
      setMessageType('error');
      return;
    }

    if (!recaptchaToken) {
      setMessage('Veuillez confirmer que vous n\'êtes pas un robot.');
      setMessageType('error');
      setRecaptchaError('Veuillez confirmer que vous n\'êtes pas un robot.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const captchaResponse = await fetch('/api/security/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      if (!captchaResponse.ok) {
        const captchaData = await captchaResponse.json();
        throw new Error(captchaData.error || 'Validation reCAPTCHA échouée.');
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Erreur réinitialisation:', error);
        setMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
        setMessageType('error');
      } else {
        setMessage('Mot de passe réinitialisé avec succès ! Vous allez être redirigé vers la page de connexion.');
        setMessageType('success');
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Une erreur est survenue. Veuillez réessayer.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setRecaptchaToken(null);
      setRecaptchaKey(prev => prev + 1);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Lock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo ZaLaMa */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">ZL</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Réinitialisation du mot de passe</h1>
          <p className="text-gray-400">ZaLaMa - Votre partenaire financier de confiance</p>
        </div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
        >
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border ${getMessageColor()} flex items-center gap-3`}
            >
              {getMessageIcon()}
              <span className="text-sm font-medium">{message}</span>
            </motion.div>
          )}

          {isValidToken ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nouveau mot de passe */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Entrez votre nouveau mot de passe"
                    disabled={isLoading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Le mot de passe doit contenir au moins 8 caractères
                </p>
              </div>

              {/* Confirmation du mot de passe */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirmez votre nouveau mot de passe"
                    disabled={isLoading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <ReCaptchaCheckbox
                  key={recaptchaKey}
                  onChange={(token) => {
                    setRecaptchaToken(token);
                    setRecaptchaError(null);
                  }}
                />
                {recaptchaError && (
                  <p className="text-xs text-red-400 text-center mt-2">
                    {recaptchaError}
                  </p>
                )}
              </div>

              {/* Bouton de soumission */}
              <motion.button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Réinitialisation en cours...
                  </div>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-white mb-6">
                Ce lien de réinitialisation est invalide ou a expiré.
              </p>
              <motion.button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Retour à la connexion
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Besoin d'aide ? Contactez notre équipe support
          </p>
        </div>
      </motion.div>
    </div>
  );
} 