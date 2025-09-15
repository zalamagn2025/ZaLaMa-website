import { useState, useEffect, useCallback } from 'react'
import { Avis, CreateAvisRequest, AvisResponse, AvisListResponse } from '@/types/avis'

export function useAvis() {
  const [avis, setAvis] = useState<Avis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Récupérer les avis de l'utilisateur
  const fetchAvis = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/avis', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      
      const data: AvisListResponse = await response.json()
      
      if (data.success && data.data) {
        setAvis(data.data)
      } else {
        console.error('❌ Erreur API avis:', data.error)
        setError(data.error || 'Erreur lors de la récupération des avis')
      }
    } catch (err) {
      console.error('💥 Erreur lors de la récupération des avis:', err)
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }, [])

  // Créer un nouvel avis
  const createAvis = async (avisData: CreateAvisRequest): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/avis', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(avisData),
      })
      
      
      const data: AvisResponse = await response.json()
      
      if (data.success && data.data) {
        
        // Forcer le rechargement des avis
        setRefreshTrigger(prev => prev + 1)
        
        return true
      } else {
        console.error('❌ Erreur création avis:', data.error)
        setError(data.error || 'Erreur lors de la création de l\'avis')
        return false
      }
    } catch (err) {
      console.error('💥 Erreur lors de la création de l\'avis:', err)
      setError('Erreur de connexion')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Charger les avis au montage du composant et quand refreshTrigger change
  useEffect(() => {
    fetchAvis()
  }, [fetchAvis, refreshTrigger])

  return {
    avis,
    loading,
    error,
    createAvis,
    fetchAvis,
    refreshTrigger,
  }
} 