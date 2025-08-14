export interface Avis {
  id: string
  employee_id: string
  partner_id: string | null
  note: number
  commentaire: string
  type_retour: 'positif' | 'negatif'
  date_avis: string
  approuve: boolean
  created_at: string
  updated_at: string
  
  // Relations (ajoutées par l'Edge Function)
  partner_name?: string
  partner_logo?: string
}

export interface CreateAvisRequest {
  note: number
  commentaire: string
  type_retour: 'positif' | 'negatif'
}

export interface AvisResponse {
  success: boolean
  data?: Avis
  error?: string
  limitInfo?: LimitInfo
}

export interface AvisListResponse {
  success: boolean
  data?: Avis[]
  error?: string
}

export interface LimitInfo {
  currentCount: number
  limit: number
  remaining: number
  canPost?: boolean
}

export interface AvisStats {
  total_avis: number
  moyenne_note: number
  avis_positifs: number
  avis_negatifs: number
  avis_approuves: number
  avis_en_attente: number
  par_partenaire: Record<string, number>
  par_note: Record<string, number>
  evolution_mensuelle: Record<string, number>
}

export interface LimitResponse {
  success: boolean
  data?: LimitInfo
  error?: string
} 