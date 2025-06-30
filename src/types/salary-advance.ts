export interface SalaryAdvanceRequest {
  id: string
  employe_id: string
  partenaire_id: string
  montant_demande: number
  type_motif: string
  motif: string
  numero_reception?: string
  frais_service: number
  montant_total: number
  salaire_disponible?: number
  avance_disponible?: number
  statut: 'En attente' | 'Validé' | 'Rejeté' | 'Annulé'
  date_creation: string
  date_validation?: string
  date_rejet?: string
  motif_rejet?: string
  created_at: string
  updated_at: string
}

export interface CreateSalaryAdvanceRequest {
  employeId: string
  montantDemande: number
  typeMotif: string
  motif: string
  numeroReception?: string
  fraisService: number
  montantTotal: number
  salaireDisponible?: number
  avanceDisponible?: number
  entrepriseId: string
  password: string
}

export type RequestType = 'transport' | 'sante' | 'education' | 'logement' | 'alimentation' | 'autre'

export const REQUEST_TYPES = [
  { value: 'transport', label: 'Transport' },
  { value: 'sante', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'logement', label: 'Logement' },
  { value: 'alimentation', label: 'Alimentation' },
  { value: 'autre', label: 'Autre' }
] as const 