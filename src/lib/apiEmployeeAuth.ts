// Service API pour l'authentification employé via l'API employee-auth
// Remplace l'authentification directe Supabase par des appels à l'Edge Function

const EMPLOYEE_AUTH_BASE_URL = process.env.NEXT_PUBLIC_EMPLOYEE_AUTH_URL || 'http://localhost:3001/api/auth';

export interface EmployeeAuthResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  employee?: EmployeeData;
  error?: string;
}

export interface EmployeeData {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  nomComplet?: string;
  telephone: string | null;
  email: string;
  genre: string;
  adresse: string | null;
  poste: string | null;
  role: string | null;
  type_contrat: string;
  salaire_net: number;
  date_embauche: string;
  photo_url: string | null;
  actif: boolean;
  partner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class EmployeeAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = EMPLOYEE_AUTH_BASE_URL;
    console.log('🔧 EmployeeAuthService initialisé avec URL:', this.baseUrl);
  }

  // Méthode utilitaire pour gérer les erreurs de fetch
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }));
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
    }
    return response.json();
  }

  // Méthode pour récupérer le token depuis les cookies
  private getAuthToken(): string | null {
    if (typeof document === 'undefined') return null; // Côté serveur
    
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    return authCookie ? authCookie.split('=')[1] : null;
  }

  // Méthode pour définir les cookies sécurisés
  private setAuthCookies(accessToken: string, refreshToken: string): void {
    if (typeof document === 'undefined') return; // Côté serveur
    
    // Cookie pour le token d'accès (7 jours)
    document.cookie = `auth-token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
    
    // Cookie pour le refresh token (30 jours)
    document.cookie = `refresh-token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`;
  }

  // Méthode pour supprimer les cookies d'authentification
  private clearAuthCookies(): void {
    if (typeof document === 'undefined') return; // Côté serveur
    
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
    document.cookie = 'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
  }

  // POST /login - Authentification employé
  async login(credentials: LoginCredentials): Promise<EmployeeAuthResponse> {
    try {
      console.log('🔐 Tentative de connexion via employee-auth API...');
      console.log('🔧 URL de l\'API:', `${this.baseUrl}/login`);
      console.log('🔧 Credentials:', { email: credentials.email, password: '***' });
      
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('🔧 Réponse reçue:', response.status, response.statusText);

      const data = await this.handleResponse<EmployeeAuthResponse>(response);
      
      if (data.success && data.access_token && data.refresh_token) {
        // Stocker les tokens dans les cookies sécurisés
        this.setAuthCookies(data.access_token, data.refresh_token);
        console.log('✅ Connexion réussie, tokens stockés');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // GET /getme - Récupérer le profil employé
  async getProfile(): Promise<EmployeeData | null> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      console.log('👤 Récupération du profil employé...');
      
      const response = await fetch(`${this.baseUrl}/getme`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Si le token a expiré, essayer de le rafraîchir
      if (response.status === 401) {
        console.log('🔄 Token expiré, tentative de rafraîchissement...');
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Réessayer avec le nouveau token
          return this.getProfile();
        }
        throw new Error('Session expirée, veuillez vous reconnecter');
      }

      const data = await this.handleResponse<{ employee: EmployeeData }>(response);
      return data.employee;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  // Méthode pour rafraîchir le token
  private async refreshToken(): Promise<boolean> {
    try {
      if (typeof document === 'undefined') return false; // Côté serveur
      
      const cookies = document.cookie.split(';');
      const refreshCookie = cookies.find(cookie => cookie.trim().startsWith('refresh-token='));
      const refreshToken = refreshCookie ? refreshCookie.split('=')[1] : null;
      
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          // Mettre à jour le token d'accès
          document.cookie = `auth-token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
          console.log('✅ Token rafraîchi avec succès');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement du token:', error);
      return false;
    }
  }

  // GET /debug - Route de diagnostic (admin uniquement)
  async debug(): Promise<any> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      console.log('🔧 Appel de la route de diagnostic...');
      
      const response = await fetch(`${this.baseUrl}/debug`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('❌ Erreur lors de l\'appel debug:', error);
      throw error;
    }
  }

  // Méthode pour se déconnecter
  async logout(): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (token) {
        // Appeler l'API de déconnexion si elle existe
        try {
          await fetch(`${this.baseUrl}/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.warn('⚠️ Erreur lors de l\'appel logout API:', error);
        }
      }
      
      // Supprimer les cookies locaux
      this.clearAuthCookies();
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      // Forcer la suppression des cookies même en cas d'erreur
      this.clearAuthCookies();
      throw error;
    }
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return this.getAuthToken() !== null;
  }

  // Méthode pour obtenir le token actuel (pour debug)
  getCurrentToken(): string | null {
    return this.getAuthToken();
  }
}

// Instance singleton du service
export const employeeAuthService = new EmployeeAuthService();
