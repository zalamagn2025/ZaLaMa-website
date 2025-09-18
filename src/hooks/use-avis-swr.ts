import useSWR, { mutate } from 'swr'
import { Avis, CreateAvisRequest, AvisListResponse, LimitInfo, LimitResponse } from '@/types/avis'

const fetcher = async (url: string) => {
  // Récupérer le token d'authentification depuis localStorage
  const token = localStorage.getItem('employee_access_token')
  
  if (!token) {
    throw new Error('Token d\'authentification manquant')
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

export function useAvisSWR() {
  // Utilisation de SWR pour récupérer les avis via l'Edge Function
  const { data, error, isLoading, mutate: mutateAvis } = useSWR<AvisListResponse>(
    'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-avis/list', 
    fetcher, 
    {
      refreshInterval: 0, // Pas de polling automatique
      revalidateOnFocus: true, // Revalide au focus
    }
  )

  // Optimistic update pour la création d'avis
  const createAvis = async (avisData: CreateAvisRequest) => {
    // Optimistic update: on ajoute l'avis localement avant la réponse serveur
    const optimisticAvis: Avis = {
      id: 'optimistic-' + Date.now(),
      employee_id: '', // sera ignoré côté affichage
      partner_id: null,
      note: avisData.note,
      commentaire: avisData.commentaire,
      type_retour: avisData.type_retour,
      date_avis: new Date().toISOString(),
      approuve: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    // Ajout optimiste
    mutateAvis(
      (prev) => {
        if (!prev) {
          return {
            success: true,
            data: [optimisticAvis]
          }
        }
        return {
          ...prev,
          data: [optimisticAvis, ...(prev.data || [])],
          success: true,
        }
      },
      false // Ne pas revalider tout de suite
    )

    // Récupérer le token d'authentification
    const token = localStorage.getItem('employee_access_token')
    
    if (!token) {
      throw new Error('Token d\'authentification manquant')
    }

    // Envoi réel au serveur via l'Edge Function
    const response = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/employee-avis/create', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(avisData),
    })
    const result = await response.json()

    // Si erreur de limite, on retire l'optimistic update
    if (!result.success && response.status === 429) {
      mutateAvis(
        (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            data: (prev.data || []).filter(avis => avis.id !== optimisticAvis.id),
            success: true,
          }
        },
        false
      )
      throw new Error(result.error || 'Limite d\'avis quotidienne atteinte')
    }

    // Revalidation pour avoir la vraie donnée seulement si succès
    if (result.success) {
      mutateAvis()
      // Mettre à jour les informations de limite
      mutate('/api/avis/limit')
    }
    
    return result.success
  }

  return {
    avis: data?.data || [],
    loading: isLoading,
    error: error ? (error.message || 'Erreur') : undefined,
    createAvis,
    refresh: () => mutateAvis(),
  }
}

// Hook séparé pour les informations de limite
export function useAvisLimit() {
  const { data, error, isLoading, mutate } = useSWR<LimitResponse>(
    '/api/avis/limit', 
    fetcher, 
    {
      refreshInterval: 0,
      revalidateOnFocus: true,
    }
  )

  return {
    limitInfo: data?.data,
    loading: isLoading,
    error: error ? (error.message || 'Erreur') : undefined,
    refresh: () => mutate(),
  }
} 