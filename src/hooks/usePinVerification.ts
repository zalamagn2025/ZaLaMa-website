import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface UsePinVerificationProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePinVerification({ onSuccess, onError }: UsePinVerificationProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    /*console.log('🔐 Début de la vérification du PIN...')*/
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
      
      // Utiliser l'API route pour la vérification du PIN (même endpoint que le mot de passe)
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ password: pin }), // Envoyer le PIN comme "password"
      });

      const result = await response.json();

      if (result.success) {
        /*console.log('✅ Vérification PIN réussie!')*/
        setIsVerified(true);
        /*console.log('🔓 isVerified mis à true')*/
        onSuccess?.();
        return true;
      } else {
        /*console.log('❌ Vérification PIN échouée:', result.message)*/
        throw new Error(result.message || 'Code PIN incorrect');
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
    /*console.log('🚪 Ouverture du modal de vérification PIN...')*/
    setIsModalOpen(true);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const resetVerification = useCallback(() => {
    /*console.log('🔄 Réinitialisation de la vérification PIN')*/
    setIsVerified(false);
  }, []);

  return {
    isModalOpen,
    isVerified,
    isLoading,
    verifyPin,
    openVerificationModal,
    closeVerificationModal,
    resetVerification
  };
}
