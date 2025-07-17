"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface UserData {
  employeId: string // ✅ Utiliser employeId au lieu de id
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
  photo_url: string | null
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
  updateUserData: (updates: Partial<UserData>) => Promise<void>
  refreshUserData: () => Promise<void>
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

  // ✅ Debug pour suivre l'état du contexte
  useEffect(() => {
    console.log('🔍 AuthContext Debug - État actuel:', {
      currentUser: currentUser ? 'Présent' : 'Absent',
      userData: userData ? 'Présent' : 'Absent',
      loading,
      userDataKeys: userData ? Object.keys(userData) : 'Aucune donnée',
      userDataValues: userData ? {
        employeId: userData.employeId,
        nom: userData.nom,
        prenom: userData.prenom,
        user_id: userData.user_id
      } : 'Aucune donnée'
    });
  }, [currentUser, userData, loading]);

  useEffect(() => {
    console.log('🚀 AuthContext - Initialisation...');
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 AuthContext - Événement auth:', event, 'Session:', session ? 'Présente' : 'Absente');
        
        setCurrentUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            console.log('🔍 AuthContext - Récupération des données employee pour:', session.user.id);
            
            // Récupérer les données utilisateur depuis la table employees
            const { data: userData, error } = await supabase
              .from('employees')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('actif', true)
              .single()

            if (error) {
              console.error('❌ Erreur lors de la récupération des données utilisateur:', error.message || error)
              setUserData(null)
            } else if (userData) {
              console.log('✅ Données employé récupérées:', {
                employeId: userData.employeId,
                nom: userData.nom,
                prenom: userData.prenom,
                user_id: userData.user_id
              })
              setUserData(userData as UserData)
            } else {
              console.warn('⚠️ Aucune donnée employé trouvée pour l\'utilisateur:', session.user.id)
              setUserData(null)
            }
          } catch (error) {
            console.error('❌ Erreur lors de la récupération des données utilisateur:', error)
            setUserData(null)
          }
        } else {
          console.log('🔍 AuthContext - Pas de session, reset userData');
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

  async function updateUserData(updates: Partial<UserData>) {
    if (!userData?.employeId) {
      console.warn('Tentative de mise à jour des données employee sans employeId')
      return
    }

    try {
      // Mettre à jour dans Supabase en utilisant l'ID de l'employee
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('employeId', userData.employeId) // ✅ Utiliser employeId dans la requête
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la mise à jour des données employee:', error)
        throw error
      }

      // Mettre à jour le state local
      if (data) {
        setUserData(prev => prev ? { ...prev, ...data } : data)
        console.log('✅ Données employee mises à jour dans le contexte')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données employee:', error)
      throw error
    }
  }

  async function refreshUserData() {
    if (!currentUser) {
      console.warn('Tentative de rafraîchissement des données utilisateur sans utilisateur connecté')
      return
    }

    try {
      console.log('🔄 AuthContext - Rafraîchissement des données pour:', currentUser.id);
      
      // Récupérer les données utilisateur depuis la table employees
      const { data: userData, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('actif', true)
        .single()

      if (error) {
        console.error('❌ Erreur lors du rafraîchissement des données utilisateur:', error.message || error)
        throw error
      } else if (userData) {
        console.log('✅ Données employé rafraîchies:', {
          employeId: userData.employeId,
          nom: userData.nom,
          prenom: userData.prenom,
          user_id: userData.user_id
        })
        setUserData(userData as UserData)
      } else {
        console.warn('⚠️ Aucune donnée employé trouvée lors du rafraîchissement')
        setUserData(null)
      }
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement des données utilisateur:', error)
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
    resetPassword,
    updateUserData,
    refreshUserData
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
