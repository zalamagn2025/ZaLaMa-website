'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAccountSession } from '@/hooks/useAccountSession'
import { useEmployeeAuth } from './EmployeeAuthContext'
import { AccountSession } from '@/types/account-session'

interface AccountAuthContextType {
  // État des comptes
  accounts: AccountSession[]
  lastUsedAccount: AccountSession | null
  accountsLoading: boolean
  accountsError: string | null
  
  // Actions sur les comptes
  saveAccount: (userData: any) => Promise<AccountSession>
  removeAccount: (accountId: string) => Promise<void>
  verifyPin: (email: string, pin: string) => Promise<boolean>
  updateLastLogin: (accountId: string) => Promise<void>
  refreshAccounts: () => Promise<void>
  
  // État de l'authentification actuelle
  currentEmployee: any
  isAuthenticated: boolean
  authLoading: boolean
  authError: string | null
  
  // Actions d'authentification
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  quickLogin: (account: AccountSession, pin: string) => Promise<void>
}

const AccountAuthContext = createContext<AccountAuthContextType | undefined>(undefined)

export function useAccountAuth() {
  const context = useContext(AccountAuthContext)
  if (context === undefined) {
    throw new Error('useAccountAuth doit être utilisé à l\'intérieur d\'un AccountAuthProvider')
  }
  return context
}

interface AccountAuthProviderProps {
  children: ReactNode
}

export function AccountAuthProvider({ children }: AccountAuthProviderProps) {
  // Hook pour la gestion des comptes
  const {
    accounts,
    lastUsedAccount,
    loading: accountsLoading,
    error: accountsError,
    saveAccount,
    removeAccount,
    verifyPin,
    updateLastLogin,
    refreshAccounts
  } = useAccountSession()

  // Hook pour l'authentification employé
  const {
    employee: currentEmployee,
    loading: authLoading,
    error: authError,
    isAuthenticated,
    login: employeeLogin,
    logout: employeeLogout
  } = useEmployeeAuth()

  // Connexion avec sauvegarde automatique du compte
  const login = async (email: string, password: string) => {
    try {
      // Utiliser la connexion employé existante
      await employeeLogin(email, password)
      // La sauvegarde du compte se fera automatiquement via useEffect
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  }

  // Connexion rapide avec PIN
  const quickLogin = async (account: AccountSession, pin: string) => {
    try {
      console.log('🚀 Connexion rapide pour:', account.email)
      
      // Se connecter directement avec l'email et le PIN
      // employeeLogin fera la vérification du PIN
      await employeeLogin(account.email, pin)
      
      console.log('✅ Connexion rapide réussie')
      
      // Mettre à jour la dernière connexion
      await updateLastLogin(account.id)
      
      console.log('✅ Dernière connexion mise à jour')
    } catch (error) {
      console.error('❌ Erreur lors de la connexion rapide:', error)
      throw error
    }
  }

  // Déconnexion avec nettoyage des comptes si nécessaire
  const logout = async () => {
    try {
      await employeeLogout()
      // Optionnel: nettoyer les comptes locaux si nécessaire
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    }
  }

  // Sauvegarder automatiquement le compte quand l'utilisateur se connecte
  useEffect(() => {
    const saveCurrentAccount = async () => {
      if (isAuthenticated && currentEmployee && !accountsLoading) {
        try {
          console.log('💾 Sauvegarde automatique du compte:', currentEmployee.email)
          
          const userData = {
            ...currentEmployee,
            access_token: localStorage.getItem('employee_access_token')
          }
          
          await saveAccount(userData)
          console.log('✅ Compte sauvegardé avec succès')
        } catch (error) {
          console.error('❌ Erreur lors de la sauvegarde automatique du compte:', error)
        }
      }
    }

    saveCurrentAccount()
  }, [isAuthenticated, currentEmployee, accountsLoading, saveAccount])

  const value: AccountAuthContextType = {
    // État des comptes
    accounts,
    lastUsedAccount,
    accountsLoading,
    accountsError,
    
    // Actions sur les comptes
    saveAccount,
    removeAccount,
    verifyPin,
    updateLastLogin,
    refreshAccounts,
    
    // État de l'authentification actuelle
    currentEmployee,
    isAuthenticated,
    authLoading,
    authError,
    
    // Actions d'authentification
    login,
    logout,
    quickLogin
  }

  return (
    <AccountAuthContext.Provider value={value}>
      {children}
    </AccountAuthContext.Provider>
  )
}
