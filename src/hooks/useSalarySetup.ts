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

export function useSalarySetup() {
  const { employee, isAuthenticated } = useEmployeeAuth();
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'utilisateur a besoin de configurer son salaire
  const checkSalarySetup = async () => {
    // Récupérer le token depuis localStorage
    const accessToken = localStorage.getItem('employee_access_token');
    
    if (!accessToken) {
      setError('Token d\'accès non disponible');
      setNeedsSetup(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Vérification du besoin de configuration du salaire via Edge Function...');
      const response = await fetch(`${EDGE_FUNCTION_URL}/check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('📊 Réponse Edge Function /check:', data);

      if (response.ok && data.success) {
        setNeedsSetup(data.needsSetup);
        setUserInfo(data.user);
        console.log('✅ Vérification terminée - needsSetup:', data.needsSetup);
      } else {
        setError(data.error || 'Erreur lors de la vérification');
        setNeedsSetup(false);
        console.error('❌ Erreur lors de la vérification:', data.error);
      }
    } catch (err) {
      console.error('💥 Erreur lors de la vérification du salaire:', err);
      setError('Erreur de connexion');
      setNeedsSetup(false);
    } finally {
      setLoading(false);
    }
  };

  // Configurer le salaire
  const configureSalary = async (salaryData: SalarySetupData): Promise<boolean> => {
    // Récupérer le token depuis localStorage
    const accessToken = localStorage.getItem('employee_access_token');
    
    if (!accessToken) {
      setError('Token d\'accès non disponible');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔧 Configuration du salaire via Edge Function...', salaryData);
      const response = await fetch(`${EDGE_FUNCTION_URL}/configure`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salaryData),
      });

      const data = await response.json();
      console.log('📊 Réponse Edge Function /configure:', data);

      if (response.ok && data.success) {
        setNeedsSetup(false);
        // Mettre à jour les informations utilisateur
        if (userInfo) {
          setUserInfo({
            ...userInfo,
            currentSalary: data.employee.salaire_net
          });
        }
        console.log('✅ Salaire configuré avec succès');
        return true;
      } else {
        setError(data.error || 'Erreur lors de la configuration');
        console.error('❌ Erreur lors de la configuration:', data.error);
        return false;
      }
    } catch (err) {
      console.error('💥 Erreur lors de la configuration du salaire:', err);
      setError('Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Vérifier automatiquement au montage du composant
  useEffect(() => {
    if (employee && isAuthenticated) {
      console.log('🔄 Hook useSalarySetup - Vérification automatique...');
      console.log('   - employee.user_id:', employee.user_id);
      console.log('   - employee.salaire_net:', employee.salaire_net);
      console.log('   - employee.poste:', employee.poste);
      
      // Utiliser directement l'Edge Function pour vérifier
      checkSalarySetup();
    } else {
      console.log('🔄 Hook useSalarySetup - Pas d\'employé connecté');
      setNeedsSetup(false);
    }
  }, [employee, isAuthenticated]);

  return {
    needsSetup,
    userInfo,
    loading,
    error,
    checkSalarySetup,
    configureSalary,
  };
}
