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
      await updateLastLogin(account.user_id)
      
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
      // console.log('🔄 useEffect saveCurrentAccount déclenché:', {
      //   isAuthenticated,
      //   hasCurrentEmployee: !!currentEmployee,
      //   currentEmployeeEmail: currentEmployee?.email,
      //   accountsLoading,
      //   accountsCount: accounts.length
      // })
      
      if (isAuthenticated && currentEmployee && !accountsLoading) {
        // Vérifier si le compte existe déjà
        const existingAccount = accounts.find(acc => acc.email === currentEmployee.email)
        
        if (!existingAccount) {
          try {
            const accessToken = localStorage.getItem('employee_access_token')
            // console.log('💾 Sauvegarde automatique du compte:', currentEmployee.email)
            // console.log('🔑 Token d\'accès:', accessToken ? 'Présent' : 'Absent')
            
            if (!accessToken) {
              console.warn('⚠️ Aucun token d\'accès trouvé, impossible de sauvegarder le compte')
              return
            }
            
            const userData = {
              ...currentEmployee,
              profile_image: currentEmployee.photo_url, // Mapper photo_url vers profile_image
              entreprise: currentEmployee.partner_info?.company_name, // Mapper company_name vers entreprise
              access_token: accessToken
            }
            
            // console.log('📤 Envoi des données utilisateur:', {
            //   email: userData.email,
            //   nom: userData.nom,
            //   prenom: userData.prenom,
            //   profile_image: userData.profile_image,
            //   entreprise: userData.entreprise,
            //   hasAccessToken: !!userData.access_token
            // })
            
            await saveAccount(userData)
            // console.log('✅ Compte sauvegardé avec succès')
          } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde automatique du compte:', error)
          }
        } else {
          // Vérifier si les données ont changé (notamment la photo de profil)
          const accessToken = localStorage.getItem('employee_access_token')
          
          if (!accessToken) {
            console.warn('⚠️ Aucun token d\'accès trouvé, impossible de mettre à jour le compte')
            return
          }
          
          const userData = {
            ...currentEmployee,
            profile_image: currentEmployee.photo_url,
            entreprise: currentEmployee.partner_info?.company_name,
            access_token: accessToken
          }
          
          const hasProfileImageChanged = existingAccount.profile_image !== userData.profile_image
          const hasOtherDataChanged = 
            existingAccount.nom !== userData.nom ||
            existingAccount.prenom !== userData.prenom ||
            existingAccount.entreprise !== userData.entreprise ||
            existingAccount.poste !== userData.poste
          
          if (hasProfileImageChanged || hasOtherDataChanged) {
            try {
              // console.log('🔄 Mise à jour du compte existant:', {
              //   email: currentEmployee.email,
              //   profileImageChanged: hasProfileImageChanged,
              //   otherDataChanged: hasOtherDataChanged,
              //   oldProfileImage: existingAccount.profile_image,
              //   newProfileImage: userData.profile_image
              // })
              
              // Supprimer l'ancien compte et sauvegarder avec les nouvelles données
              await removeAccount(existingAccount.id)
              await saveAccount(userData)
              // console.log('✅ Compte existant mis à jour avec succès')
            } catch (error) {
              console.error('❌ Erreur lors de la mise à jour du compte:', error)
            }
          } else {
            // console.log('ℹ️ Compte déjà existant et à jour:', currentEmployee.email)
          }
        }
      } else {
        // console.log('⏳ Conditions non remplies pour la sauvegarde automatique')
      }
    }

    saveCurrentAccount()
  }, [isAuthenticated, currentEmployee, accountsLoading, accounts]) // Ajouté accounts pour vérifier l'existence

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
