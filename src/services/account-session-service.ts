import { WebEncryption } from './web-encryption'
import { AccountSession, DeviceAccounts, AccountData } from '@/types/account-session'

export interface AccountManagementResponse {
  success: boolean
  account?: AccountSession
  accounts?: AccountSession[]
  message?: string
  error?: string
  details?: string[]
}

export class AccountSessionService {
  private readonly STORAGE_KEY = 'zalama_accounts'
  private readonly DEVICE_ID_KEY = 'zalama_device_id'
  private readonly MAX_ACCOUNTS = 5
  private readonly API_BASE_URL = '/api/account-management'

  // Générer un ID d'appareil unique
  generateDeviceId(): string {
    if (typeof window === 'undefined') return 'server'

    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY)
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId)
    }
    return deviceId
  }

  // Méthode privée pour faire les requêtes API
  private async makeRequest<T>(action: string, data: any, accessToken?: string): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
      // console.log('🔑 Token envoyé dans la requête:', accessToken.substring(0, 20) + '...')
    } else {
      // Ne pas afficher de warning pour les actions publiques
      const publicActions = ['get_accounts', 'verify_pin', 'update_last_login', 'remove_account']
      if (!publicActions.includes(action)) {
        console.warn('⚠️ Aucun token d\'accès fourni pour l\'action:', action)
      }
    }

    const response = await fetch(this.API_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, data }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la requête')
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur inconnue')
    }

    return result
  }

  // Sauvegarder un compte via API Route
  async saveAccountSession(userData: any): Promise<AccountSession> {
    const deviceId = this.generateDeviceId()
    
    // console.log('🔍 Données utilisateur reçues:', {
    //   email: userData.email,
    //   nom: userData.nom,
    //   prenom: userData.prenom,
    //   profile_image: userData.profile_image,
    //   poste: userData.poste,
    //   entreprise: userData.entreprise,
    //   hasAccessToken: !!userData.access_token
    // })
    
    const accountData: AccountData = {
      deviceId,
      email: userData.email,
      nom: userData.nom,
      prenom: userData.prenom,
      profileImage: userData.profile_image,
      poste: userData.poste,
      entreprise: userData.entreprise
    }
    
    // console.log('📤 Données envoyées à l\'API:', accountData)

    try {
      const result = await this.makeRequest<AccountManagementResponse>(
        'save_account',
        accountData,
        userData.access_token
      )
      
      if (result.account) {
        // Sauvegarder aussi en local pour l'accès rapide
        this.saveAccountLocally(result.account)
        return result.account
      } else {
        throw new Error('Aucun compte retourné')
      }
    } catch (error) {
      console.error('Erreur saveAccountSession:', error)
      throw error
    }
  }

  // Récupérer les comptes d'un appareil
  async getDeviceAccounts(): Promise<AccountSession[]> {
    const deviceId = this.generateDeviceId()
    
    try {
      const result = await this.makeRequest<AccountManagementResponse>(
        'get_accounts',
        { deviceId }
      )
      
      if (result.accounts) {
        // Mettre à jour le cache local
        this.updateLocalAccounts(result.accounts)
        return result.accounts
      } else {
        return []
      }
    } catch (error) {
      console.error('Erreur getDeviceAccounts:', error)
      // Fallback sur le cache local
      return this.getLocalAccounts()
    }
  }

  // Vérifier un PIN via l'API existante
  async verifyAccountPin(email: string, pin: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: pin
        })
      })

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      return result.success === true
    } catch (error) {
      console.error('Erreur vérification PIN:', error)
      return false
    }
  }

  // Supprimer un compte
  async removeAccount(accountId: string): Promise<void> {
    const deviceId = this.generateDeviceId()
    // console.log('🔄 Service removeAccount appelé:', { accountId, deviceId });
    
    try {
      // Récupérer les informations du compte pour avoir le user_id
      const localAccounts = this.getLocalAccounts()
      const accountToDelete = localAccounts.find(acc => acc.id === accountId)
      
      if (!accountToDelete) {
        // console.warn('⚠️ Compte non trouvé localement:', accountId)
        // Supprimer quand même du cache local au cas où
        this.removeAccountLocally(accountId)
        return
      }
      
      // console.log('📋 Compte trouvé:', { 
      //   id: accountToDelete.id, 
      //   user_id: accountToDelete.user_id, 
      //   email: accountToDelete.email 
      // })
      
      // D'abord supprimer du cache local (plus fiable)
      // console.log('🗑️ Suppression locale...');
      this.removeAccountLocally(accountId)
      // console.log('✅ Suppression locale terminée');
      
      // Ensuite essayer la suppression serveur (non bloquante)
      try {
        // console.log('📡 Appel API remove_account...');
        await this.makeRequest<AccountManagementResponse>(
          'remove_account',
          { deviceId, userId: accountToDelete.user_id }
        )
        // console.log('✅ API remove_account réussie');
      } catch (apiError) {
        console.warn('⚠️ Erreur API remove_account (non bloquante):', apiError)
        // Ne pas faire échouer la suppression locale
      }
      
    } catch (error) {
      console.error('❌ Erreur removeAccount:', error)
      throw error
    }
  }

  // Mettre à jour la dernière connexion
  async updateLastLogin(accountId: string): Promise<void> {
    const deviceId = this.generateDeviceId()
    
    try {
      await this.makeRequest<AccountManagementResponse>(
        'update_last_login',
        { deviceId, userId: accountId }
      )
      
      // Mettre à jour le cache local
      this.updateLocalAccountLastLogin(accountId)
    } catch (error) {
      console.error('Erreur updateLastLogin:', error)
      // Ne pas faire échouer pour cette opération
    }
  }

  // Méthodes pour le cache local (fallback)
  private saveAccountLocally(account: AccountSession): void {
    try {
      const data = this.getLocalDeviceAccounts()
      const existingIndex = data.accounts.findIndex(a => a.id === account.id)
      
      if (existingIndex >= 0) {
        data.accounts[existingIndex] = account
      } else {
        data.accounts.unshift(account)
        // Limiter le nombre de comptes
        if (data.accounts.length > this.MAX_ACCOUNTS) {
          data.accounts = data.accounts.slice(0, this.MAX_ACCOUNTS)
        }
      }
      
      data.last_used_account_id = account.id
      data.updated_at = new Date().toISOString()
      
      const encrypted = WebEncryption.encrypt(JSON.stringify(data))
      localStorage.setItem(this.STORAGE_KEY, encrypted)
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde locale:', error)
    }
  }

  private updateLocalAccountLastLogin(userId: string): void {
    try {
      const data = this.getLocalDeviceAccounts()
      const accountIndex = data.accounts.findIndex(acc => acc.user_id === userId)
      
      if (accountIndex >= 0) {
        data.accounts[accountIndex].last_login = new Date().toISOString()
        data.updated_at = new Date().toISOString()
        
        // Mettre à jour le lastUsedAccount si c'est le même compte
        if (data.last_used_account_id === data.accounts[accountIndex].id) {
          data.accounts[accountIndex].last_login = new Date().toISOString()
        }
        
        const encrypted = WebEncryption.encrypt(JSON.stringify(data))
        localStorage.setItem(this.STORAGE_KEY, encrypted)
        // console.log('✅ Dernière connexion mise à jour localement pour user_id:', userId)
      } else {
        console.warn('⚠️ Compte non trouvé pour user_id:', userId)
      }
    } catch (error) {
      console.warn('Erreur mise à jour locale last_login:', error)
    }
  }

  private getLocalAccounts(): AccountSession[] {
    try {
      const data = this.getLocalDeviceAccounts()
      return data.accounts
    } catch (error) {
      console.warn('Erreur lors de la lecture locale:', error)
      return []
    }
  }

  private getLocalDeviceAccounts(): DeviceAccounts {
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEY)
      if (!encrypted) {
        return this.getDefaultDeviceAccounts()
      }
      
      const decrypted = WebEncryption.decrypt(encrypted)
      return JSON.parse(decrypted)
    } catch (error) {
      console.warn('Erreur lors du décryptage:', error)
      return this.getDefaultDeviceAccounts()
    }
  }

  private updateLocalAccounts(accounts: AccountSession[]): void {
    try {
      const data = this.getLocalDeviceAccounts()
      data.accounts = accounts
      data.updated_at = new Date().toISOString()
      
      const encrypted = WebEncryption.encrypt(JSON.stringify(data))
      localStorage.setItem(this.STORAGE_KEY, encrypted)
    } catch (error) {
      console.warn('Erreur lors de la mise à jour locale:', error)
    }
  }

  private removeAccountLocally(accountId: string): void {
    try {
      const data = this.getLocalDeviceAccounts()
      data.accounts = data.accounts.filter(a => a.id !== accountId)
      
      if (data.last_used_account_id === accountId) {
        data.last_used_account_id = data.accounts[0]?.id
      }
      
      data.updated_at = new Date().toISOString()
      
      const encrypted = WebEncryption.encrypt(JSON.stringify(data))
      localStorage.setItem(this.STORAGE_KEY, encrypted)
    } catch (error) {
      console.warn('Erreur lors de la suppression locale:', error)
    }
  }

  private getDefaultDeviceAccounts(): DeviceAccounts {
    return {
      device_id: this.generateDeviceId(),
      accounts: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

// Instance singleton
export const accountSessionService = new AccountSessionService()
