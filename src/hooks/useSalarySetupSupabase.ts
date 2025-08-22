import { useState, useEffect } from 'react';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';

interface UserInfo {
  id: string;
  role: string;
  email: string;
  display_name: string;
  currentSalary: number;
  partner: {
    id: string;
    company_name: string;
  };
}

interface SalarySetupData {
  salaire_net: number;
  type_contrat: string;
  date_embauche: string;
  poste: string;
}

// URL de l'Edge Function Supabase
const EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/salary-setup';

export function useSalarySetupSupabase() {
  const { user, session } = useEmployeeAuth();
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'utilisateur a besoin de configurer son salaire
  const checkSalarySetup = async () => {
    if (!session?.access_token) {
      setError('Token d\'accès non disponible');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNeedsSetup(data.needsSetup);
        setUserInfo(data.user);
      } else {
        setError(data.error || 'Erreur lors de la vérification');
        setNeedsSetup(false);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du salaire:', err);
      setError('Erreur de connexion');
      setNeedsSetup(false);
    } finally {
      setLoading(false);
    }
  };

  // Configurer le salaire
  const configureSalary = async (salaryData: SalarySetupData): Promise<boolean> => {
    if (!session?.access_token) {
      setError('Token d\'accès non disponible');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/configure`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salaryData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNeedsSetup(false);
        // Mettre à jour les informations utilisateur
        if (userInfo) {
          setUserInfo({
            ...userInfo,
            currentSalary: data.employee.salaire_net
          });
        }
        return true;
      } else {
        setError(data.error || 'Erreur lors de la configuration');
        return false;
      }
    } catch (err) {
      console.error('Erreur lors de la configuration du salaire:', err);
      setError('Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'historique des modifications
  const getSalaryHistory = async () => {
    if (!session?.access_token) {
      setError('Token d\'accès non disponible');
      return null;
    }

    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data.history;
      } else {
        setError(data.error || 'Erreur lors de la récupération de l\'historique');
        return null;
      }
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'historique:', err);
      setError('Erreur de connexion');
      return null;
    }
  };

  // Vérifier automatiquement au montage du composant
  useEffect(() => {
    if (user && session?.access_token) {
      checkSalarySetup();
    }
  }, [user, session?.access_token]);

  return {
    needsSetup,
    userInfo,
    loading,
    error,
    checkSalarySetup,
    configureSalary,
    getSalaryHistory,
  };
}
