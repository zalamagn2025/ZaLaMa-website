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

export interface LimitResponse {
  success: boolean
  data?: LimitInfo
  error?: string
} 