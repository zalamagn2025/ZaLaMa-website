import { useState, useEffect, useCallback } from 'react'
import { accountSessionService } from '@/services/account-session-service'
import { AccountSession } from '@/types/account-session'

export function useAccountSession() {
  const [accounts, setAccounts] = useState<AccountSession[]>([])
  const [lastUsedAccount, setLastUsedAccount] = useState<AccountSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger depuis localStorage
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const deviceAccounts = await accountSessionService.getDeviceAccounts()
      setAccounts(deviceAccounts)
      
      // Définir le dernier compte utilisé
      if (deviceAccounts.length > 0) {
        setLastUsedAccount(deviceAccounts[0])
      }
    } catch (err) {
      console.error('Erreur chargement comptes:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  // Sauvegarder après connexion réussie
  const saveAccount = useCallback(async (userData: any) => {
    try {
      setError(null)
      const savedAccount = await accountSessionService.saveAccountSession(userData)
      
      // Recharger la liste
      await loadAccounts()
      
      return savedAccount
    } catch (err) {
      console.error('Erreur sauvegarde:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    }
  }, []) // Retiré loadAccounts des dépendances

  // Supprimer un compte
  const removeAccount = useCallback(async (accountId: string) => {
    try {
      setError(null)
      await accountSessionService.removeAccount(accountId)
      
      // Recharger la liste
      await loadAccounts()
    } catch (err) {
      console.error('❌ Erreur suppression:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    }
  }, [loadAccounts])

  // Vérifier PIN via API existante
  const verifyPin = useCallback(async (email: string, pin: string): Promise<boolean> => {
    try {
      setError(null)
      return await accountSessionService.verifyAccountPin(email, pin)
    } catch (err) {
      console.error('Erreur vérification PIN:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return false
    }
  }, [])

  // Mettre à jour la dernière connexion
  const updateLastLogin = useCallback(async (accountId: string) => {
    try {
      await accountSessionService.updateLastLogin(accountId)
      // Recharger les comptes pour mettre à jour l'interface
      await loadAccounts()
    } catch (err) {
      console.error('Erreur updateLastLogin:', err)
      // Ne pas faire échouer pour cette opération
    }
  }, [loadAccounts])

  useEffect(() => {
    loadAccounts()
  }, []) // Retiré loadAccounts des dépendances

  return {
    accounts,
    lastUsedAccount,
    loading,
    error,
    saveAccount,
    removeAccount,
    verifyPin,
    updateLastLogin,
    refreshAccounts: loadAccounts
  }
}
