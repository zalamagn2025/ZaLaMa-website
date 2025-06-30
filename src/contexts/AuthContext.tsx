"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface UserData {
  id: string
  user_id: string
  nom: string
  prenom: string
  telephone: string | null
  email: string
  genre: string
  adresse: string | null
  poste: string | null
  role: string | null
  type_contrat: string
  salaire_net: number
  date_embauche: string
  actif: boolean
  partner_id: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  currentUser: User | null
  userData: UserData | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setCurrentUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            // Récupérer les données utilisateur depuis la table employees
            const { data: userData, error } = await supabase
              .from('employees')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('actif', true)
              .single()

            if (error) {
              console.error('Erreur lors de la récupération des données utilisateur:', error)
            } else if (userData) {
              setUserData(userData as UserData)
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error)
          }
        } else {
          setUserData(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Note: La mise à jour de la dernière connexion se fait automatiquement
      // via l'AuthContext lors de la récupération des données employé
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // Extraire nom et prénom
        const nameParts = name.trim().split(' ')
        const prenom = nameParts[0] || ''
        const nom = nameParts.slice(1).join(' ') || prenom

        // Créer un employé dans la table employees
        const { error: employeeError } = await supabase
          .from('employees')
          .insert({
            user_id: authData.user.id,
            nom,
            prenom,
            email,
            poste: 'Employé',
            type_contrat: 'CDI',
            salaire_net: 500000, // Salaire par défaut
            date_embauche: new Date().toISOString().split('T')[0],
            actif: true,
            genre: 'HOMME', // Valeur par défaut
          })

        if (employeeError) {
          console.error('Erreur lors de la création du profil employé:', employeeError)
          // Note: On ne peut pas supprimer l'utilisateur Auth sans admin
          throw employeeError
        }
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      throw error
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur de réinitialisation de mot de passe:', error)
      throw error
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
      throw error
    }
  }

  const value = {
    currentUser,
    userData,
    loading,
    login,
    register,
    logout,
    resetPassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
