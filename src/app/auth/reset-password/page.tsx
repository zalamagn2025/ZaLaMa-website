'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Récupérer les paramètres de l'URL
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  
  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'verifying' | 'ready' | 'success' | 'error' | 'loading'>('verifying');
  const [message, setMessage] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Vérifier le token au chargement de la page
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('Lien de réinitialisation invalide. Veuillez demander un nouveau lien.');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-reset-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();

        if (response.ok && data.valid) {
          setStatus('ready');
          setMessage('');
        } else {
          setStatus('error');
          setMessage(data.error || 'Lien de réinitialisation invalide ou expiré.');
        }
      } catch (error) {
        console.error('Erreur de vérification:', error);
        setStatus('error');
        setMessage('Erreur de connexion. Veuillez réessayer.');
      }
    };

    verifyToken();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (password.length < 8) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Mot de passe réinitialisé avec succès !');
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login?message=password_changed');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Erreur lors de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleResendEmail = async () => {
    setStatus('loading');
    setMessage('Envoi d\'un nouveau lien...');

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
        setMessage('Nouveau lien de réinitialisation envoyé ! Vérifiez votre email.');
      } else {
        setMessage(data.error || 'Erreur lors de l\'envoi du lien.');
      }
    } catch (error) {
      setMessage('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* Bouton Retour */}
      <button
        type="button"
        onClick={() => router.push('/login')}
        className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white/90 text-[#FF671E] font-semibold rounded shadow transition-all z-20"
        style={{backdropFilter: 'blur(6px)'}}
      >
        <ArrowLeft className="h-5 w-5" />
        Retour
      </button>

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF671E] via-[#FF8A3D] to-[#FF671E] opacity-90" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/zalama-logo.svg"
              alt="ZaLaMa Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Réinitialisation du mot de passe
            </h1>
            <p className="text-white/80 text-sm">
              {email && `Pour ${email}`}
            </p>
          </div>

          {/* Status Messages */}
          {status === 'verifying' && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="text-white">Vérification du lien...</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="text-white text-sm">{message}</span>
              </div>
              {email && (
                <button
                  onClick={handleResendEmail}
                  className="mt-3 text-blue-300 hover:text-blue-200 text-sm underline"
                >
                  Demander un nouveau lien
                </button>
              )}
            </div>
          )}

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white text-sm">{message}</span>
              </div>
            </div>
          )}

          {/* Reset Password Form */}
          {status === 'ready' && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                    className="pr-10"
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    className="pr-10"
                    onFocus={() => setFocusedInput('confirmPassword')}
                    onBlur={() => setFocusedInput(null)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-white text-[#FF671E] font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF671E]"></div>
                    Réinitialisation...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Réinitialiser le mot de passe
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-white/80 hover:text-white text-sm underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}