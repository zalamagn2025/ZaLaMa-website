import { useState, useEffect } from 'react'

export interface WithdrawalHistoryItem {
  id: string
  type: 'RETRAIT' | 'PAIEMENT'
  montant: number
  montant_final?: number
  frais_retrait?: number
  type_compte?: string
  numero_reception?: string
  statut: string
  date_demande: string
  date_limite?: string
  date_traitement?: string
  reference: string
  commentaire?: string
  nom_beneficiaire?: string
  partenaire?: string
  transfer?: {
    success: boolean
    pay_id?: string
    status?: string
  }
}

export interface WithdrawalHistoryResponse {
  success: boolean
  data: {
    historique: WithdrawalHistoryItem[]
    retraits: WithdrawalHistoryItem[]
    paiements: WithdrawalHistoryItem[]
    total: number
    total_retraits: number
    total_paiements: number
  }
  message?: string
}

export function useWithdrawalHistory() {
  const [history, setHistory] = useState<WithdrawalHistoryItem[]>([])
  const [retraits, setRetraits] = useState<WithdrawalHistoryItem[]>([])
  const [paiements, setPaiements] = useState<WithdrawalHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    total_retraits: 0,
    total_paiements: 0
  })

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')
      if (!accessToken) {
        throw new Error('Token d\'authentification manquant')
      }


      const response = await fetch('/api/employee/withdrawal-history', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_history'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération de l\'historique')
      }

      const data: WithdrawalHistoryResponse = await response.json()
      
      if (data.success && data.data) {
        
        setHistory(data.data.historique || [])
        setRetraits(data.data.retraits || [])
        setPaiements(data.data.paiements || [])
        setStats({
          total: data.data.total || 0,
          total_retraits: data.data.total_retraits || 0,
          total_paiements: data.data.total_paiements || 0
        })
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération de l\'historique')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'historique:', error)
      setError(error instanceof Error ? error.message : 'Erreur de connexion')
      setHistory([])
      setRetraits([])
      setPaiements([])
      setStats({ total: 0, total_retraits: 0, total_paiements: 0 })
    } finally {
      setLoading(false)
    }
  }

  const fetchPending = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')
      if (!accessToken) {
        throw new Error('Token d\'authentification manquant')
      }


      const response = await fetch('/api/employee/withdrawal-history', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_pending'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la récupération des retraits en attente')
      }

      const data: WithdrawalHistoryResponse = await response.json()
      
      if (data.success && data.data) {
        return data.data.retraits || []
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des retraits en attente')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des retraits en attente:', error)
      setError(error instanceof Error ? error.message : 'Erreur de connexion')
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return {
    history,
    retraits,
    paiements,
    loading,
    error,
    stats,
    fetchHistory,
    fetchPending,
    refetch: fetchHistory
  }
}
