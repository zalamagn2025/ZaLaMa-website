"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertTriangle, 
  Trash2, 
  Shield, 
  Mail,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmployeeAuth } from "@/contexts/EmployeeAuthContext";

// Composant Input personnalisé avec icône
function InputWithIcon({ 
  className, 
  type, 
  icon,
  ...props 
}: React.ComponentProps<"input"> & { icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <Input
        type={type}
        className={`${icon ? 'pl-10' : ''} ${className || ''}`}
        {...props}
      />
    </div>
  );
}

export default function DeleteAccountForm() {
  const router = useRouter();
  const { employee, isAuthenticated, login, loading: authLoading } = useEmployeeAuth();
  
  // États pour l'authentification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // États pour la confirmation de suppression
  const [isAuthenticatedStep, setIsAuthenticatedStep] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Texte de confirmation requis
  const requiredConfirmationText = "SUPPRIMER MON COMPTE";
  
  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isAuthenticated && employee) {
      setEmail(employee.email);
      setIsAuthenticatedStep(true);
    }
  }, [isAuthenticated, employee]);

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    if (!email || !password) {
      setAuthError("Veuillez remplir tous les champs");
      setIsAuthenticating(false);
      return;
    }

    try {
      await login(email, password);
      setIsAuthenticatedStep(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Erreur d'authentification");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== requiredConfirmationText) {
      setDeleteError("Veuillez taper exactement : SUPPRIMER MON COMPTE");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      // TODO: Implémenter l'API de suppression de compte
      // const response = await fetch('/api/delete-account', {
      //   method: 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      
      // Simulation pour l'instant
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDeleteSuccess(true);
      
      // Redirection après succès
      setTimeout(() => {
        router.push("/");
      }, 3000);
      
    } catch (error) {
      setDeleteError("Erreur lors de la suppression du compte. Veuillez réessayer.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  if (deleteSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
      >
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Compte supprimé
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Votre compte a été supprimé avec succès. Vous allez être redirigé...
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full"
    >
      {/* En-tête */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
          <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Supprimer mon compte
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Cette action est irréversible et supprimera définitivement toutes vos données.
        </p>
      </div>

      {/* Étape 1: Authentification */}
      {!isAuthenticatedStep && (
        <motion.div variants={stepVariants}>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vérification de votre identité
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Pour des raisons de sécurité, veuillez confirmer votre identité avant de procéder à la suppression.
            </p>
          </div>

          <form onSubmit={handleAuthentication} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse email
              </label>
              <InputWithIcon
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                icon={<Mail className="w-4 h-4" />}
                required
                disabled={isAuthenticating}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <InputWithIcon
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  icon={<Shield className="w-4 h-4" />}
                  required
                  disabled={isAuthenticating}
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isAuthenticating}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <XCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isAuthenticating || !email || !password}
              className="w-full bg-[#FF671E] hover:bg-[#FF8533] text-white"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                "Vérifier mon identité"
              )}
            </Button>
          </form>
        </motion.div>
      )}

      {/* Étape 2: Confirmation de suppression */}
      {isAuthenticatedStep && (
        <motion.div variants={stepVariants}>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmation de suppression
              </h2>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                ⚠️ Attention : Cette action est irréversible
              </h3>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Toutes vos données personnelles seront supprimées</li>
                <li>• Votre historique d'avances sera perdu</li>
                <li>• Vous ne pourrez plus accéder à votre compte</li>
                <li>• Cette action ne peut pas être annulée</li>
              </ul>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pour confirmer, tapez exactement : <span className="font-bold text-red-600">SUPPRIMER MON COMPTE</span>
              </label>
              <Input
                id="confirmation"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="SUPPRIMER MON COMPTE"
                className="w-full font-mono"
                disabled={isDeleting}
              />
            </div>

            {deleteError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4"
              >
                <XCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="flex-1"
                disabled={isDeleting || confirmationText !== requiredConfirmationText}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer définitivement
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Informations supplémentaires */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Si vous avez des questions, contactez notre support avant de supprimer votre compte.
        </p>
      </div>
    </motion.div>
  );
}
