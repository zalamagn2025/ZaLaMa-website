import { useState } from 'react';

// Types pour l'inscription employé
export interface EmployeeRegistrationData {
  api_key: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  genre: 'Homme' | 'Femme' | 'Autre';
  poste: string;
  matricule: string;
  type_contrat: 'CDI' | 'CDD' | 'Consultant' | 'Stage' | 'Autre';
  salaire_net: number;
  date_embauche: string;
  date_expiration: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  employee_id?: string;
  partner_name?: string;
}

export interface RegisterEmployeeState {
  loading: boolean;
  success: boolean;
  error: string | null;
  data: ApiResponse | null;
}

export const useRegisterEmployee = () => {
  const [state, setState] = useState<RegisterEmployeeState>({
    loading: false,
    success: false,
    error: null,
    data: null,
  });

  const registerEmployee = async (data: EmployeeRegistrationData): Promise<ApiResponse> => {
    setState(prev => ({
      ...prev,
      loading: true,
      success: false,
      error: null,
      data: null,
    }));

    try {
      
      // Appel de l'API Route Next.js
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Erreur API:', response.status, result);
        setState(prev => ({
          ...prev,
          loading: false,
          success: false,
          error: result.error || `Erreur ${response.status}: ${response.statusText}`,
        }));
        
        return {
          success: false,
          message: result.error || `Erreur ${response.status}: ${response.statusText}`,
        };
      }

      if (result && result.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          data: result,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          success: false,
          error: result?.message || 'Erreur lors de l\'inscription',
        }));
      }

      return result || { success: false, message: 'Erreur inconnue' };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      console.error('Erreur lors de l\'appel Edge Function:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        success: false,
        error: errorMessage,
      }));
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const resetState = () => {
    setState({
      loading: false,
      success: false,
      error: null,
      data: null,
    });
  };

  return {
    ...state,
    registerEmployee,
    resetState,
  };
};
