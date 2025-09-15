import { 
  SalaryAdvanceDemand, 
  CreateDemandRequest, 
  CreateDemandResponse, 
  DemandsListResponse, 
  DemandsStatsResponse,
  ApiError 
} from '@/types/employee-demands';
import { debug, info, warn, error } from '@/lib/logger';

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
        throw new Error(result.error || 'Erreur lors de la requête');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupérer la liste des demandes d'avance de salaire
   */
  async getDemandsList(page: number = 1, limit: number = 20): Promise<DemandsListResponse> {
    try {
      const response = await this.makeRequest<DemandsListResponse>(
        `list?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Créer une nouvelle demande d'avance de salaire
   */
  async createDemand(demandData: CreateDemandRequest): Promise<CreateDemandResponse> {
    try {
      const response = await this.makeRequest<CreateDemandResponse>('create', {
        method: 'POST',
        body: JSON.stringify(demandData),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des demandes
   */
  async getDemandsStats(): Promise<DemandsStatsResponse> {
    try {
      const response = await this.makeRequest<DemandsStatsResponse>('stats');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mettre à jour une demande (si autorisé)
   */
  async updateDemand(demandId: string, updateData: Partial<CreateDemandRequest>): Promise<any> {
    try {
      const response = await this.makeRequest(`update/${demandId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Supprimer une demande (si autorisé)
   */
  async deleteDemand(demandId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`delete/${demandId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupérer une demande spécifique
   */
  async getDemand(demandId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`get/${demandId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Instance singleton
export const employeeDemandsService = new EmployeeDemandsService();


