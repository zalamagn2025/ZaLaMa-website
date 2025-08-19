import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { employeeDemandsService } from '@/services/employeeDemandsService';
import { 
  SalaryAdvanceDemand, 
  CreateDemandRequest, 
  DemandsListResponse, 
  DemandsStatsResponse 
} from '@/types/employee-demands';
import { toast } from 'sonner';

interface UseEmployeeDemandsOptions {
  page?: number;
  limit?: number;
}

export function useEmployeeDemands(options: UseEmployeeDemandsOptions = {}) {
  const { page = 1, limit = 20 } = options;
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hook pour la liste des demandes
  const {
    data: demandsData,
    error: demandsError,
    isLoading: isLoadingDemands,
    mutate: mutateDemands
  } = useSWR<DemandsListResponse>(
    `employee-demands-list-${page}-${limit}`,
    () => employeeDemandsService.getDemandsList(page, limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
    }
  );

  // Hook pour les statistiques
  const {
    data: statsData,
    error: statsError,
    isLoading: isLoadingStats,
    mutate: mutateStats
  } = useSWR<DemandsStatsResponse>(
    'employee-demands-stats',
    () => employeeDemandsService.getDemandsStats(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
    }
  );

  // Créer une nouvelle demande
  const createDemand = useCallback(async (demandData: CreateDemandRequest) => {
    setIsCreating(true);
    try {
      console.log('📝 Création d\'une nouvelle demande...', demandData);
      
      const response = await employeeDemandsService.createDemand(demandData);
      
      // Rafraîchir les données
      await Promise.all([
        mutateDemands(),
        mutateStats(),
        mutate('employee-demands-list-*') // Rafraîchir toutes les pages
      ]);
      
      toast.success('Demande d\'avance créée avec succès !');
      console.log('✅ Demande créée:', response);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la création de la demande';
      toast.error(errorMessage);
      console.error('❌ Erreur création demande:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [mutateDemands, mutateStats]);

  // Mettre à jour une demande
  const updateDemand = useCallback(async (demandId: string, updateData: Partial<CreateDemandRequest>) => {
    setIsUpdating(true);
    try {
      console.log('🔄 Mise à jour de la demande...', demandId, updateData);
      
      const response = await employeeDemandsService.updateDemand(demandId, updateData);
      
      // Rafraîchir les données
      await Promise.all([
        mutateDemands(),
        mutateStats(),
        mutate('employee-demands-list-*')
      ]);
      
      toast.success('Demande mise à jour avec succès !');
      console.log('✅ Demande mise à jour:', response);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la demande';
      toast.error(errorMessage);
      console.error('❌ Erreur mise à jour demande:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [mutateDemands, mutateStats]);

  // Supprimer une demande
  const deleteDemand = useCallback(async (demandId: string) => {
    setIsDeleting(true);
    try {
      console.log('🗑️ Suppression de la demande...', demandId);
      
      const response = await employeeDemandsService.deleteDemand(demandId);
      
      // Rafraîchir les données
      await Promise.all([
        mutateDemands(),
        mutateStats(),
        mutate('employee-demands-list-*')
      ]);
      
      toast.success('Demande supprimée avec succès !');
      console.log('✅ Demande supprimée:', response);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression de la demande';
      toast.error(errorMessage);
      console.error('❌ Erreur suppression demande:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [mutateDemands, mutateStats]);

  // Rafraîchir manuellement les données
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        mutateDemands(),
        mutateStats(),
        mutate('employee-demands-list-*')
      ]);
      toast.success('Données rafraîchies !');
    } catch (error) {
      toast.error('Erreur lors du rafraîchissement des données');
    }
  }, [mutateDemands, mutateStats]);

  return {
    // Données
    demands: demandsData?.data.demands || [],
    pagination: demandsData?.data.pagination,
    stats: statsData?.data,
    
    // États de chargement
    isLoadingDemands,
    isLoadingStats,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Erreurs
    demandsError,
    statsError,
    
    // Actions
    createDemand,
    updateDemand,
    deleteDemand,
    refreshData,
    
    // Utilitaires
    mutateDemands,
    mutateStats,
  };
}





