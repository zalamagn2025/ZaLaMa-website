import useSWR, { mutate } from 'swr'
import { Avis, CreateAvisRequest, AvisListResponse, LimitInfo, LimitResponse } from '@/types/avis'

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json())

export function useAvisSWR() {
  // Utilisation de SWR pour récupérer les avis
  const { data, error, isLoading, mutate: mutateAvis } = useSWR<AvisListResponse>('/api/avis', fetcher, {
    refreshInterval: 0, // Pas de polling automatique
    revalidateOnFocus: true, // Revalide au focus
  })

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
      prev => ({
        ...prev,
        data: prev?.data ? [optimisticAvis, ...prev.data] : [optimisticAvis],
        success: true,
      }),
      false // Ne pas revalider tout de suite
    )

    // Envoi réel au serveur
    const response = await fetch('/api/avis', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avisData),
    })
    const result = await response.json()

    // Si erreur de limite, on retire l'optimistic update
    if (!result.success && response.status === 429) {
      mutateAvis(
        prev => ({
          ...prev,
          data: prev?.data?.filter(avis => avis.id !== optimisticAvis.id) || [],
          success: true,
        }),
        false
      )
      throw new Error(result.error || 'Limite d\'avis quotidienne atteinte')
    }

    // Revalidation pour avoir la vraie donnée
    mutateAvis()
    
    // Mettre à jour les informations de limite
    mutate('/api/avis/limit')
    
    return result.success
  }

  return {
    avis: data?.data || [],
    loading: isLoading,
    error: error ? (error.message || 'Erreur') : undefined,
    createAvis,
    refresh: () => mutate('/api/avis'),
  }
}

// Hook séparé pour les informations de limite
export function useAvisLimit() {
  const { data, error, isLoading, mutate } = useSWR<LimitResponse>('/api/avis/limit', fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: true,
  })

  return {
    limitInfo: data?.data,
    loading: isLoading,
    error: error ? (error.message || 'Erreur') : undefined,
    refresh: () => mutate(),
  }
} 