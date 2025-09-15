"use client";

import { useState, useEffect, useCallback } from 'react';
import { employeeAuthService, EmployeeData } from '@/lib/apiEmployeeAuth';

interface UseEmployeeProfileReturn {
  employee: EmployeeData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
}

export function useEmployeeProfile(): UseEmployeeProfileReturn {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour charger le profil employé
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si l'utilisateur est authentifié
      if (!employeeAuthService.isAuthenticated()) {
        setEmployee(null);
        setIsAuthenticated(false);
        return;
      }

      // Récupérer le token d'accès
      const accessToken = localStorage.getItem('employee_access_token');
      if (!accessToken) {
        setEmployee(null);
        setIsAuthenticated(false);
        return;
      }

      // Récupérer le profil depuis l'API
      const response = await employeeAuthService.getProfile(accessToken);
      
      if (response.success && response.data) {
        // Adapter les données du profil pour correspondre au type EmployeeData
        const employeeData: EmployeeData = {
          id: response.data.id,
          user_id: '', // Cette donnée n'est pas disponible dans EmployeeProfileData
          nom: response.data.nom,
          prenom: response.data.prenom,
          email: response.data.email,
          poste: response.data.poste,
          type_contrat: 'CDI', // Valeur par défaut
          actif: true, // Valeur par défaut
          partner_info: {
            id: '', // Non disponible dans EmployeeProfileData
            company_name: response.data.partner_info.company_name,
            legal_status: response.data.partner_info.legal_status,
            activity_domain: response.data.partner_info.activity_domain,
            status: 'Actif', // Valeur par défaut
          },
          financial: response.data.financial,
          workCalendar: response.data.workCalendar,
        };
        
        setEmployee(employeeData);
        setIsAuthenticated(true);
      } else {
        setEmployee(null);
        setIsAuthenticated(false);
        console.warn('⚠️ Aucun profil trouvé ou erreur:', response.error);
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement du profil:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du profil');
      setEmployee(null);
      setIsAuthenticated(false);
      
      // Si l'erreur est liée à l'authentification, nettoyer les cookies
      if (err instanceof Error && (
        err.message.includes('Token') || 
        err.message.includes('Session') || 
        err.message.includes('401')
      )) {
        await employeeAuthService.logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction de connexion
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      
      const response = await employeeAuthService.login(email, password);
      
      if (response.success && response.employee) {
        setEmployee(response.employee);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.error || 'Échec de la connexion');
      }
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      setEmployee(null);
      setIsAuthenticated(false);
      throw err; // Re-lancer l'erreur pour que le composant puisse la gérer
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await employeeAuthService.logout();
      setEmployee(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur lors de la déconnexion:', err);
      // Même en cas d'erreur, nettoyer l'état local
      setEmployee(null);
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour rafraîchir le profil
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Charger le profil au montage du composant
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Écouter les changements d'authentification (optionnel, pour la synchronisation)
  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = employeeAuthService.isAuthenticated();
      if (authenticated !== isAuthenticated) {
        setIsAuthenticated(authenticated);
        if (!authenticated) {
          setEmployee(null);
        }
      }
    };

    // Vérifier périodiquement le statut d'authentification
    const interval = setInterval(checkAuthStatus, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return {
    employee,
    loading,
    error,
    login,
    logout,
    refreshProfile,
    isAuthenticated,
  };
}
