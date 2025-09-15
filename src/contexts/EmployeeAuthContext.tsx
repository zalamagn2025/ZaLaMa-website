"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { employeeAuthService, EmployeeData } from '@/lib/apiEmployeeAuth';

interface EmployeeAuthContextType {
  employee: EmployeeData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext);
  if (context === undefined) {
    throw new Error('useEmployeeAuth doit être utilisé à l\'intérieur d\'un EmployeeAuthProvider');
  }
  return context;
}

interface EmployeeAuthProviderProps {
  children: ReactNode;
}

export function EmployeeAuthProvider({ children }: EmployeeAuthProviderProps) {
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour charger le profil employé
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si un token d'accès existe (utiliser la même clé que le service)
      const accessToken = localStorage.getItem('employee_access_token');
      if (!accessToken) {
        setEmployee(null);
        setIsAuthenticated(false);
        return;
      }

      // Vérifier que le token n'est pas vide ou invalide
      if (accessToken.trim() === '' || accessToken === 'null' || accessToken === 'undefined') {
        localStorage.removeItem('employee_access_token');
        localStorage.removeItem('employee_refresh_token');
        setEmployee(null);
        setIsAuthenticated(false);
        return;
      }

      // Récupérer le profil depuis l'Edge Function
      const response = await employeeAuthService.getProfile(accessToken);
      
      if (response.success && response.data) {
        // Adapter les données du profil pour correspondre au type EmployeeData
        const employeeData: EmployeeData = {
          id: response.data.id,
          user_id: response.data.user_id,
          nom: response.data.nom,
          prenom: response.data.prenom,
          nomComplet: `${response.data.prenom} ${response.data.nom}`,
          telephone: response.data.telephone,
          email: response.data.email,
          genre: response.data.genre || '',
          adresse: response.data.adresse,
          poste: response.data.poste,
          role: response.data.role,
          matricule: response.data.matricule,
          type_contrat: response.data.type_contrat,
          salaire_net: response.data.salaire_net,
          date_embauche: response.data.date_embauche,
          photo_url: response.data.photo_url,
          actif: response.data.actif,
          partner_id: response.data.partner_id,
          partner_info: response.data.partner_info,
          financial: response.data.financial,
          workCalendar: response.data.workCalendar,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
        };
        
        setEmployee(employeeData);
        setIsAuthenticated(true);
      } else {
        setEmployee(null);
        setIsAuthenticated(false);
        console.warn('⚠️ Aucun profil trouvé ou erreur:', response.error);
        
        // Si c'est une erreur 401 (token invalide), nettoyer les tokens
        if (response.error && (
          response.error.includes('401') || 
          response.error.includes('Token') || 
          response.error.includes('Unauthorized')
        )) {
        localStorage.removeItem('employee_access_token');
        localStorage.removeItem('employee_refresh_token');
        }
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement du profil:', err);
      
      // Ne pas afficher l'erreur si c'est juste un problème de réseau temporaire
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du profil';
      
      // Si l'erreur est liée à l'authentification, nettoyer les tokens et l'état
      if (err instanceof Error && (
        errorMessage.includes('Token') || 
        errorMessage.includes('Session') || 
        errorMessage.includes('401') ||
        errorMessage.includes('403')
      )) {
        setError(null); // Ne pas afficher l'erreur à l'utilisateur
        setEmployee(null);
        setIsAuthenticated(false);
        localStorage.removeItem('employee_access_token');
        localStorage.removeItem('employee_refresh_token');
      } else {
        // Pour les autres erreurs (réseau, etc.), garder l'état actuel
        setError(errorMessage);
        console.warn('⚠️ Erreur temporaire, conservation de l\'état d\'authentification');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      
      const response = await employeeAuthService.login(email, password);
      
      if (response.success && response.access_token) {
        // Stocker les tokens (utiliser la même clé que le service)
        localStorage.setItem('employee_access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('employee_refresh_token', response.refresh_token);
        }
        
        // Charger le profil avec le nouveau token
        await loadProfile();
        
      } else {
        throw new Error(response.error || 'Échec de la connexion');
      }
    } catch (err) {
      console.error('❌ Erreur de connexion via le contexte:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      setEmployee(null);
      setIsAuthenticated(false);
      throw err; // Re-lancer l'erreur pour que le composant puisse la gérer
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      setLoading(true);
      
      // Nettoyer les tokens du localStorage (utiliser la même clé que le service)
      localStorage.removeItem('employee_access_token');
      localStorage.removeItem('employee_refresh_token');
      
      setEmployee(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur lors de la déconnexion via le contexte:', err);
      // Même en cas d'erreur, nettoyer l'état local
      setEmployee(null);
      setIsAuthenticated(false);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rafraîchir le profil
  const refreshProfile = async () => {
    await loadProfile();
  };

  // Charger le profil au montage du composant
  useEffect(() => {
    loadProfile();
  }, []);

  // Écouter les changements d'authentification (optionnel, pour la synchronisation)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Seulement vérifier si on n'a pas déjà un employé chargé
        if (!employee && employeeAuthService.isAuthenticated()) {
          const accessToken = localStorage.getItem('employee_access_token');
          if (accessToken) {
            const response = await employeeAuthService.getProfile(accessToken);
            if (response.success && response.data) {
                             // Adapter les données du profil pour correspondre au type EmployeeData
               const employeeData: EmployeeData = {
                 id: response.data.id,
                 user_id: response.data.user_id,
                 nom: response.data.nom,
                 prenom: response.data.prenom,
                 nomComplet: `${response.data.prenom} ${response.data.nom}`,
                 telephone: response.data.telephone,
                 email: response.data.email,
                 genre: response.data.genre || '',
                 adresse: response.data.adresse,
                 poste: response.data.poste,
                 role: response.data.role,
                 matricule: response.data.matricule,
                 type_contrat: response.data.type_contrat,
                 salaire_net: response.data.salaire_net,
                 date_embauche: response.data.date_embauche,
                 photo_url: response.data.photo_url,
                 actif: response.data.actif,
                 partner_id: response.data.partner_id,
                 partner_info: response.data.partner_info,
                 financial: response.data.financial,
                 workCalendar: response.data.workCalendar,
                 created_at: response.data.created_at,
                 updated_at: response.data.updated_at,
               };
              setEmployee(employeeData);
            setIsAuthenticated(true);
          } else {
            // Token invalide, nettoyer l'état
            setEmployee(null);
            setIsAuthenticated(false);
            await employeeAuthService.logout();
            }
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification du statut d\'authentification:', error);
        // En cas d'erreur, ne pas nettoyer automatiquement l'état
        // Laisser l'utilisateur continuer sa session
      }
    };

    // Vérifier périodiquement le statut d'authentification seulement si pas d'employé
    const interval = setInterval(checkAuthStatus, 120000); // Toutes les 2 minutes

    return () => clearInterval(interval);
  }, [employee]); // Dépendance seulement sur employee


  const value = {
    employee,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    refreshProfile,
  };

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  );
}
