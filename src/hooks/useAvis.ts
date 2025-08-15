import { useState, useCallback } from 'react';
import { avisService, AvisQuery, AvisStats } from '@/services/avisService';
import { Avis, CreateAvisRequest, LimitInfo } from '@/types/avis';

export interface UseAvisState {
  avis: Avis[];
  loading: boolean;
  error: string | null;
  stats: AvisStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

export interface UseAvisActions {
  fetchAvis: (query?: AvisQuery) => Promise<void>;
  createAvis: (avisData: CreateAvisRequest) => Promise<{ avis: Avis; limitInfo: LimitInfo }>;
  updateAvis: (id: string, avisData: Partial<CreateAvisRequest>) => Promise<Avis>;
  deleteAvis: (id: string) => Promise<void>;
  getAvisById: (id: string) => Promise<Avis>;
  getStats: () => Promise<AvisStats>;
  canCreateAvis: () => Promise<LimitInfo>;
  clearError: () => void;
  setAccessToken: (token: string) => void;
}

export function useAvis(initialToken?: string): UseAvisState & UseAvisActions {
  const [state, setState] = useState<UseAvisState>({
    avis: [],
    loading: false,
    error: null,
    stats: null,
    pagination: null,
  });

  // Définir le token d'authentification
  const setAccessToken = useCallback((token: string) => {
    avisService.setAccessToken(token);
  }, []);

  // Initialiser le token si fourni
  if (initialToken) {
    avisService.setAccessToken(initialToken);
  }

  // Récupérer la liste des avis
  const fetchAvis = useCallback(async (query?: AvisQuery) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await avisService.getAvis(query);
      setState(prev => ({
        ...prev,
        avis: result.data,
        pagination: result.pagination || null,
        stats: result.stats || null,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inattendue',
        loading: false,
      }));
    }
  }, []);

  // Créer un nouvel avis
  const createAvis = useCallback(async (avisData: CreateAvisRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await avisService.createAvis(avisData);
      
      // Ajouter le nouvel avis à la liste
      setState(prev => ({
        ...prev,
        avis: [result.avis, ...prev.avis],
        loading: false,
      }));
      
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inattendue',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Mettre à jour un avis
  const updateAvis = useCallback(async (id: string, avisData: Partial<CreateAvisRequest>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const updatedAvis = await avisService.updateAvis(id, avisData);
      
      // Mettre à jour l'avis dans la liste
      setState(prev => ({
        ...prev,
        avis: prev.avis.map(avis => 
          avis.id === id ? updatedAvis : avis
        ),
        loading: false,
      }));
      
      return updatedAvis;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inattendue',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Supprimer un avis
  const deleteAvis = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await avisService.deleteAvis(id);
      
      // Retirer l'avis de la liste
      setState(prev => ({
        ...prev,
        avis: prev.avis.filter(avis => avis.id !== id),
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inattendue',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Récupérer un avis spécifique
  const getAvisById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const avis = await avisService.getAvisById(id);
      setState(prev => ({ ...prev, loading: false }));
      return avis;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inattendue',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Récupérer les statistiques
  const getStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const stats = await avisService.getStats();
      setState(prev => ({
        ...prev,
        stats,
        loading: false,
      }));
      return stats;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inattendue',
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Vérifier si un avis peut être créé
  const canCreateAvis = useCallback(async () => {
    try {
      return await avisService.canCreateAvis();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur inattendue',
      }));
      throw error;
    }
  }, []);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchAvis,
    createAvis,
    updateAvis,
    deleteAvis,
    getAvisById,
    getStats,
    canCreateAvis,
    clearError,
    setAccessToken,
  };
}
