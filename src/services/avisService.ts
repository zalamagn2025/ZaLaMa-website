import { CreateAvisRequest, Avis, AvisListResponse, AvisResponse, LimitInfo } from '@/types/avis';

export interface AvisQuery {
  page?: number;
  limit?: number;
  partner_id?: string;
  note_min?: number;
  note_max?: number;
  type_retour?: 'positif' | 'negatif';
  approuve?: boolean;
  date_debut?: string;
  date_fin?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AvisStats {
  total_avis: number;
  moyenne_note: number;
  avis_positifs: number;
  avis_negatifs: number;
  avis_approuves: number;
  avis_en_attente: number;
  par_partenaire: Record<string, number>;
  par_note: Record<string, number>;
  evolution_mensuelle: Record<string, number>;
}

export interface AvisListResult {
  data: Avis[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: AvisStats;
}

export class AvisService {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseUrl = '/api/avis';
  }

  // Définir le token d'authentification
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  // Vérifier si un token est disponible
  private checkAuth(): void {
    if (!this.accessToken) {
      throw new Error('Token d\'authentification requis. Utilisez setAccessToken() d\'abord.');
    }
  }

  // Headers d'authentification
  private getHeaders(): HeadersInit {
    this.checkAuth();
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  // Lister les avis avec filtres et pagination
  async getAvis(query?: AvisQuery): Promise<AvisListResult> {
    try {
      const queryString = new URLSearchParams();
      
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryString.append(key, String(value));
          }
        });
      }

      const url = `${this.baseUrl}/list${queryString.toString() ? `?${queryString.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des avis');
      }

      const result = await response.json();
      return {
        data: result.data || [],
        pagination: result.pagination,
        stats: result.stats
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      throw error;
    }
  }

  // Créer un nouvel avis
  async createAvis(avisData: CreateAvisRequest): Promise<{ avis: Avis; limitInfo: LimitInfo }> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(avisData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de l\'avis');
      }

      const result = await response.json();
      return {
        avis: result.data,
        limitInfo: result.limitInfo
      };
    } catch (error) {
      console.error('Erreur lors de la création de l\'avis:', error);
      throw error;
    }
  }

  // Récupérer un avis spécifique
  async getAvisById(id: string): Promise<Avis> {
    try {
      const response = await fetch(`${this.baseUrl}/get?id=${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération de l\'avis');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'avis:', error);
      throw error;
    }
  }

  // Mettre à jour un avis
  async updateAvis(id: string, avisData: Partial<CreateAvisRequest>): Promise<Avis> {
    try {
      const response = await fetch(`${this.baseUrl}/update?id=${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(avisData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'avis');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avis:', error);
      throw error;
    }
  }

  // Supprimer un avis
  async deleteAvis(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete?id=${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression de l\'avis');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avis:', error);
      throw error;
    }
  }

  // Récupérer les statistiques des avis
  async getStats(): Promise<AvisStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Méthodes utilitaires

  // Vérifier si un avis peut être créé (limite quotidienne)
  async canCreateAvis(): Promise<LimitInfo> {
    try {
      // On utilise la liste avec une limite de 1 pour vérifier le nombre d'avis aujourd'hui
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();
      
      const result = await this.getAvis({
        date_debut: startOfDay,
        date_fin: endOfDay,
        limit: 1
      });

      // La limite est gérée côté serveur, on retourne les infos de base
      return {
        currentCount: result.data.length,
        limit: 3, // Limite par défaut
        remaining: Math.max(0, 3 - result.data.length),
        canPost: result.data.length < 3
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de la limite:', error);
      throw error;
    }
  }

  // Filtrer les avis par note
  async getAvisByNote(note: number): Promise<Avis[]> {
    return this.getAvis({ note_min: note, note_max: note }).then(result => result.data);
  }

  // Filtrer les avis par type de retour
  async getAvisByType(type: 'positif' | 'negatif'): Promise<Avis[]> {
    return this.getAvis({ type_retour: type }).then(result => result.data);
  }

  // Filtrer les avis par partenaire
  async getAvisByPartner(partnerId: string): Promise<Avis[]> {
    return this.getAvis({ partner_id: partnerId }).then(result => result.data);
  }

  // Filtrer les avis par statut d'approbation
  async getAvisByStatus(approuve: boolean): Promise<Avis[]> {
    return this.getAvis({ approuve }).then(result => result.data);
  }
}

// Instance singleton
export const avisService = new AvisService();
