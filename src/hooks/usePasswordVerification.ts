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
      
      // Utiliser l'API route pour la vérification du mot de passe
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setIsVerified(true);
        onSuccess?.();
        return true;
      } else {
        throw new Error(result.message || 'Erreur de vérification');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de vérification';
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
    verifyPassword,
    openVerificationModal,
    closeVerificationModal,
    resetVerification
  };
} 