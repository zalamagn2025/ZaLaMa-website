/**
 * Service API unifié pour masquer les appels Supabase
 * Toutes les requêtes passent par nos routes API internes
 */

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

class ApiService {
  private baseUrl = '/api'
  
  /**
   * Récupérer tous les services financiers
   */
  async getServices(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Pas de cache pour les données en temps réel
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('❌ Erreur API getServices:', error)
      return {
        success: false,
        error: 'Erreur de connexion',
        message: 'Impossible de récupérer les services'
      }
    }
  }
  
  /**
   * Récupérer les données financières de l'utilisateur
   */
  async getFinancialData(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/financial-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('❌ Erreur API getFinancialData:', error)
      return {
        success: false,
        error: 'Erreur de connexion',
        message: 'Impossible de récupérer les données financières'
      }
    }
  }
  
  /**
   * Récupérer le profil de l'utilisateur
   */
  async getProfile(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('❌ Erreur API getProfile:', error)
      return {
        success: false,
        error: 'Erreur de connexion',
        message: 'Impossible de récupérer le profil'
      }
    }
  }
  
  /**
   * Méthode générique pour gérer les réponses API
   */
  private handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }
}

// Export de l'instance unique
export const apiService = new ApiService()

// Export du type pour TypeScript
export type { ApiResponse }

