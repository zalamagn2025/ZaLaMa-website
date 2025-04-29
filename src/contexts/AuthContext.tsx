"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

interface UserData {
  name: string
  phone: string
  email: string
  role: string
  entreprise: string
  department: string
  joinDate: string
  avatar: string
  createdAt: string
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error)
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email: string, password: string, name: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Mettre à jour le profil utilisateur
    await updateProfile(user, { displayName: name })
    
    // Créer un document utilisateur dans Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      phone: "",
      role: 'Employé',
      entreprise: 'ZALAMA',
      department: 'Direction générale',
      joinDate: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      avatar: "",
      createdAt: serverTimestamp(),
    })
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  }

  async function logout() {
    await signOut(auth)
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
