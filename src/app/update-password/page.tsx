'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isValidSession, setIsValidSession] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('🔄 Initialisation de la session Supabase...');
        
        // Vérifier s'il y a un token dans l'URL (hash)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          console.log('🔑 Token détecté dans l\'URL, initialisation...');
          
          // Laisser Supabase traiter automatiquement le token
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Erreur lors de l\'initialisation de la session:', error);
            setMessage('Erreur lors de l\'initialisation de la session. Veuillez réessayer.');
            setMessageType('error');
            setIsValidSession(false);
          } else if (session) {
            console.log('✅ Session valide détectée après traitement du token');
            setIsValidSession(true);
            setMessage('Veuillez entrer votre nouveau mot de passe.');
            setMessageType('info');
          } else {
            console.log('❌ Aucune session valide trouvée après traitement du token');
            setMessage('Lien de réinitialisation invalide ou expiré.');
            setMessageType('error');
            setIsValidSession(false);
          }
        } else {
          console.log('❌ Aucun token trouvé dans l\'URL');
          setMessage('Lien de réinitialisation invalide ou expiré.');
          setMessageType('error');
          setIsValidSession(false);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        setMessage('Une erreur est survenue lors de l\'initialisation.');
        setMessageType('error');
        setIsValidSession(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      console.log('🔄 Mise à jour du mot de passe...');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
        setMessage('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
        setMessageType('error');
      } else {
        console.log('✅ Mot de passe mis à jour avec succès');
        setMessage('Mot de passe réinitialisé avec succès ! Redirection vers la page de connexion...');
        setMessageType('success');
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          router.push('/login?message=password_updated');
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setMessage('Une erreur est survenue. Veuillez réessayer.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
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

  // Affichage pendant l'initialisation
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6">
            <span className="text-white text-2xl font-bold">ZL</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Initialisation en cours...</span>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-white mb-2">Mise à jour du mot de passe</h1>
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

          {isValidSession ? (
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
                    required
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

              {/* Bouton de soumission */}
              <motion.button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mise à jour en cours...
                  </div>
                ) : (
                  'Mettre à jour le mot de passe'
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