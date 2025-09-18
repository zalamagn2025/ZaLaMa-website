import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UsePasswordVerificationProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePasswordVerification({ onSuccess, onError }: UsePasswordVerificationProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    const verifyPassword = useCallback(async (password: string) => {
    /*console.log('🔐 Début de la vérification du mot de passe...')*/
    setIsLoading(true);

    try {
      // Récupérer le token d'accès des employés
      const accessToken = localStorage.getItem('employee_access_token');
      /*console.log('🔑 Token d\'accès trouvé:', accessToken ? 'Oui' : 'Non')*/
      
      // Préparer les headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Ajouter le token Bearer si disponible
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        /*console.log('🔑 Token Bearer ajouté aux headers')*/
      }
      
      // Utiliser l'API route pour la vérification du mot de passe
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        /*console.log('✅ Vérification réussie!')*/
        setIsVerified(true);
        /*console.log('🔓 isVerified mis à true')*/
        onSuccess?.();
        return true;
      } else {
        /*console.log('❌ Vérification échouée:', result.message)*/
        throw new Error(result.message || 'Erreur de vérification');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de vérification';
      /*console.log('❌ Erreur capturée:', errorMessage)*/
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const openVerificationModal = useCallback(() => {
    /*console.log('🚪 Ouverture du modal de vérification...')*/
    setIsModalOpen(true);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const resetVerification = useCallback(() => {
    /*console.log('🔄 Réinitialisation de la vérification')*/
    setIsVerified(false);
  }, []);

  return {
    isModalOpen,
    isVerified,
    isLoading,
    verifyPassword,
    openVerificationModal,
    closeVerificationModal,
    resetVerification
  };
} 