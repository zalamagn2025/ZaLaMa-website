import { 
  SalaryAdvanceDemand, 
  CreateDemandRequest, 
  CreateDemandResponse, 
  DemandsListResponse, 
  DemandsStatsResponse,
  ApiError 
} from '@/types/employee-demands';

class EmployeeDemandsService {
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('employee_access_token') || sessionStorage.getItem('employee_access_token');
    }
    return null;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = this.getAccessToken();
    
    if (!accessToken) {
      console.warn('⚠️ Token d\'accès non trouvé - redirection vers la page de connexion');
      // Rediriger vers la page de connexion si pas de token
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Token d\'accès non trouvé - veuillez vous connecter');
    }

    try {
      const response = await fetch(`/api/employee-demands/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          ...options.headers,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur API:', response.status, result);
        throw new Error(result.error || 'Erreur lors de la requête');
      }

      return result;
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      throw error;
    }
  }

  /**
   * Récupérer la liste des demandes d'avance de salaire
   */
  async getDemandsList(page: number = 1, limit: number = 20): Promise<DemandsListResponse> {
    try {
      console.log('📋 Récupération de la liste des demandes...');
      
      const response = await this.makeRequest<DemandsListResponse>(
        `list?page=${page}&limit=${limit}`
      );
      
      console.log('✅ Liste des demandes récupérée:', response.data.demands.length, 'demandes');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle demande d'avance de salaire
   */
  async createDemand(demandData: CreateDemandRequest): Promise<CreateDemandResponse> {
    try {
      console.log('📝 Création d\'une nouvelle demande...', demandData);
      
      const response = await this.makeRequest<CreateDemandResponse>('create', {
        method: 'POST',
        body: JSON.stringify(demandData),
      });
      
      console.log('✅ Demande créée avec succès:', response.data.id);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la demande:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des demandes
   */
  async getDemandsStats(): Promise<DemandsStatsResponse> {
    try {
      console.log('📊 Récupération des statistiques...');
      
      const response = await this.makeRequest<DemandsStatsResponse>('stats');
      
      console.log('✅ Statistiques récupérées:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour une demande (si autorisé)
   */
  async updateDemand(demandId: string, updateData: Partial<CreateDemandRequest>): Promise<any> {
    try {
      console.log('🔄 Mise à jour de la demande:', demandId, updateData);
      
      const response = await this.makeRequest(`update/${demandId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      console.log('✅ Demande mise à jour avec succès');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la demande:', error);
      throw error;
    }
  }

  /**
   * Supprimer une demande (si autorisé)
   */
  async deleteDemand(demandId: string): Promise<any> {
    try {
      console.log('🗑️ Suppression de la demande:', demandId);
      
      const response = await this.makeRequest(`delete/${demandId}`, {
        method: 'DELETE',
      });
      
      console.log('✅ Demande supprimée avec succès');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la demande:', error);
      throw error;
    }
  }

  /**
   * Récupérer une demande spécifique
   */
  async getDemand(demandId: string): Promise<any> {
    try {
      console.log('🔍 Récupération de la demande:', demandId);
      
      const response = await this.makeRequest(`get/${demandId}`);
      
      console.log('✅ Demande récupérée:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la demande:', error);
      throw error;
    }
  }

  /**
   * Annuler une demande d'avance
   */
  async cancelDemand(demandId: string, reason?: string): Promise<any> {
    try {
      console.log('❌ Annulation de la demande:', demandId, reason ? `Motif: ${reason}` : 'Sans motif');
      
      const response = await this.makeRequest('cancel', {
        method: 'POST',
        body: JSON.stringify({
          id: demandId,
          ...(reason && { reason })
        }),
      });
      
      console.log('✅ Demande annulée avec succès');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation de la demande:', error);
      throw error;
    }
  }
}

// Instance singleton
export const employeeDemandsService = new EmployeeDemandsService();


