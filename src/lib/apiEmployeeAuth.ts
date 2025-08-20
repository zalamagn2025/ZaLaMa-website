// Service pour l'authentification des employés via Edge Function Supabase

export interface EmployeeAuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  access_token?: string;
  refresh_token?: string;
  employee?: EmployeeData;
  data?: EmployeeProfileData;
  debug?: any;
}

export interface EmployeeData {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  nomComplet?: string;
  telephone?: string;
  email: string;
  genre?: string;
  adresse?: string;
  poste: string;
  role?: string;
  matricule?: string;
  type_contrat: string;
  salaire_net?: number;
  date_embauche?: string;
  photo_url?: string;
  actif: boolean;
  partner_id?: string;
  partner_info?: {
    id: string;
    company_name: string;
    legal_status: string;
    rccm?: string;
    nif?: string;
    activity_domain: string;
    phone?: string;
    email?: string;
    logo_url?: string;
    status: string;
  };
  financial?: {
    salaireNet: number;
    salaireRestant: number;
    acompteDisponible: number;
    avanceActif: number;
    avanceDisponible: number;
    nombreAvancesValidees?: number;
    devise: string;
  };
  workCalendar?: {
    moisEnCours: string;
    joursTravailTotal: number;
    joursTravailEcoules: number;
    joursTravailRestants: number;
    pourcentageMois: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeProfileData {
  id: string;
  user_id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  poste: string;
  role: string;
  matricule: string;
  type_contrat: string;
  salaire_net: number;
  date_embauche: string;
  actif: boolean;
  photo_url: string;
  partner_id: string;
  genre: string;
  created_at: string;
  updated_at: string;
  partner_info: {
    id: string;
    company_name: string;
    legal_status: string;
    rccm: string;
    nif: string;
    activity_domain: string;
    phone: string;
    email: string;
    logo_url: string;
    status: string;
  };
  financial: {
    salaireNet: number;
    salaireRestant: number;
    acompteDisponible: number;
    avanceActif: number;
    avanceDisponible: number;
    nombreAvancesValidees: number;
    devise: string;
  };
  workCalendar: {
    moisEnCours: string;
    joursTravailTotal: number;
    joursTravailEcoules: number;
    joursTravailRestants: number;
    pourcentageMois: number;
  };
}

export interface UpdateProfileData {
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  photo_url?: string;
}

class EmployeeAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!this.baseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL non défini');
    }
  }

  private getEdgeFunctionUrl(endpoint: string): string {
    return `${this.baseUrl}/functions/v1/employee-auth/${endpoint}`;
  }

  /**
   * Récupérer le token d'accès depuis le localStorage
   */
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('employee_access_token');
    }
    return null;
  }

  /**
   * Sauvegarder les tokens dans le localStorage
   */
  saveTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('employee_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('employee_refresh_token', refreshToken);
      }
    }
  }

  /**
   * Effacer les tokens du localStorage
   */
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('employee_access_token');
      localStorage.removeItem('employee_refresh_token');
    }
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const payload = this.parseToken(token);
      if (!payload) return false;
      
      // Vérifier si le token n'est pas expiré
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    this.clearTokens();
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<EmployeeAuthResponse> {
    try {
      // Utiliser les API routes Next.js au lieu d'appeler directement l'Edge Function
      let url: string;

      if (endpoint === 'login') {
        url = '/api/auth/login';
      } else if (endpoint === 'getme') {
        url = '/api/auth/getme';
      } else {
        // Pour les autres endpoints, utiliser l'Edge Function directement
        url = this.getEdgeFunctionUrl(endpoint);
      }

      console.log(`🔗 Appel vers: ${url}`);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`❌ Erreur ${response.status} pour ${endpoint}:`, result);
        
                 // Gestion spéciale pour les erreurs d'authentification
         if (response.status === 401) {
           console.log('🔒 Erreur 401 détectée - Identifiants invalides');
           return {
             success: false,
             error: result.error || 'Email ou mot de passe incorrect',
             details: result.message || result.details,
           };
         }
        
        return {
          success: false,
          error: result.error || `Erreur ${response.status}: ${response.statusText}`,
          details: result.message || result.details,
        };
      }

      return result;
    } catch (error) {
      console.error(`💥 Erreur lors de l'appel à ${endpoint}:`, error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Authentifier un employé
   */
  async login(email: string, password: string): Promise<EmployeeAuthResponse> {
    return this.makeRequest('login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * Récupérer le profil de l'employé connecté
   */
  async getProfile(accessToken: string): Promise<EmployeeAuthResponse> {
    return this.makeRequest('getme', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Mettre à jour le profil de l'employé
   */
  async updateProfile(
    accessToken: string,
    profileData: UpdateProfileData
  ): Promise<EmployeeAuthResponse> {
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors de la mise à jour du profil',
          details: result.message,
        };
      }

      return result;
    } catch (error) {
      console.error('💥 Erreur lors de la mise à jour du profil:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  /**
   * Uploader une photo de profil
   */
  async uploadPhoto(accessToken: string, photoFile: File): Promise<EmployeeAuthResponse> {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      const response = await fetch('/api/auth/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors de l\'upload',
          details: result.message,
        };
      }

      return result;
    } catch (error) {
      console.error('💥 Erreur lors de l\'upload de photo:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  /**
   * Debug - Récupérer des informations de diagnostic
   */
  async debug(
    accessToken: string,
    params?: { email?: string; user_id?: string }
  ): Promise<EmployeeAuthResponse> {
    let url = this.getEdgeFunctionUrl('debug');
    
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.email) searchParams.append('email', params.email);
      if (params.user_id) searchParams.append('user_id', params.user_id);
      url += `?${searchParams.toString()}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors du debug',
          details: result.message,
        };
      }

      return result;
    } catch (error) {
      console.error('💥 Erreur lors du debug:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  /**
   * Changer le mot de passe de l'utilisateur
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    accessToken?: string
  ): Promise<EmployeeAuthResponse> {
    const token = accessToken || this.getAccessToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Token d\'authentification requis',
      };
    }

    try {
      const response = await fetch(this.getEdgeFunctionUrl('change-password'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Erreur lors du changement de mot de passe',
          details: result.message,
        };
      }

      // Si le changement de mot de passe réussit et qu'un nouveau token est retourné
      if (result.success && result.access_token) {
        // Sauvegarder le nouveau token
        this.saveTokens(result.access_token, result.refresh_token);
      }

      return result;
    } catch (error) {
      console.error('💥 Erreur lors du changement de mot de passe:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      };
    }
  }

  /**
   * Valider un token d'accès
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const result = await this.getProfile(accessToken);
      return result.success;
    } catch (error) {
      return false;
    }
  }



  /**
   * Extraire les informations du token JWT (côté client)
   */
  parseToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Erreur lors du parsing du token:', error);
      return null;
    }
  }
}

// Instance singleton
export const employeeAuthService = new EmployeeAuthService();

// Hooks utilitaires pour React
export const useEmployeeAuth = () => {
  return {
    login: employeeAuthService.login.bind(employeeAuthService),
    getProfile: employeeAuthService.getProfile.bind(employeeAuthService),
    updateProfile: employeeAuthService.updateProfile.bind(employeeAuthService),
    uploadPhoto: employeeAuthService.uploadPhoto.bind(employeeAuthService),
    changePassword: employeeAuthService.changePassword.bind(employeeAuthService),
    debug: employeeAuthService.debug.bind(employeeAuthService),
    validateToken: employeeAuthService.validateToken.bind(employeeAuthService),
    parseToken: employeeAuthService.parseToken.bind(employeeAuthService),
    // Nouvelles méthodes de gestion des tokens
    isAuthenticated: employeeAuthService.isAuthenticated.bind(employeeAuthService),
    getAccessToken: employeeAuthService.getAccessToken.bind(employeeAuthService),
    saveTokens: employeeAuthService.saveTokens.bind(employeeAuthService),
    clearTokens: employeeAuthService.clearTokens.bind(employeeAuthService),
    logout: employeeAuthService.logout.bind(employeeAuthService),

  };
};
