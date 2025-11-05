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
    setIsLoading(true);

    try {
      // Récupérer le token d'accès des employés
      const accessToken = localStorage.getItem('employee_access_token');
      
      // Préparer les headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Ajouter le token Bearer si disponible
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      // Utiliser l'API route pour la vérification du PIN (même endpoint que le mot de passe)
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ password: pin }), // Envoyer le PIN comme "password"
      });

      const result = await response.json();

      if (result.success) {
        setIsVerified(true);
        onSuccess?.();
        return true;
      } else {
        throw new Error(result.message || 'Code PIN incorrect');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de vérification';
      onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const openVerificationModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeVerificationModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const resetVerification = useCallback(() => {
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
