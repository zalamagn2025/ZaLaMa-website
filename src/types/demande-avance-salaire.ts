// Types pour la table demande-avance-salaire

export type DemandeStatut = 
  | 'EN_ATTENTE'
  | 'VALIDEE'
  | 'REFUSEE'
  | 'ANNULEE'
  | 'EN_COURS_TRAITEMENT'

export type TypeMotifAvance = 
  | 'TRANSPORT'
  | 'SANTE'
  | 'EDUCATION'
  | 'LOGEMENT'
  | 'ALIMENTATION'
  | 'URGENCE_FAMILIALE'
  | 'FRAIS_MEDICAUX'
  | 'FRAIS_SCOLAIRES'
  | 'REPARATION_VEHICULE'
  | 'FRAIS_DEUIL'
  | 'AUTRE'

export interface DemandeAvanceSalaire {
  id: string
  employe_id: string
  montant_demande: number
  type_motif: TypeMotifAvance
  motif: string
  numero_reception?: string
  frais_service: number
  montant_total: number
  salaire_disponible?: number
  avance_disponible?: number
  statut: DemandeStatut
  commentaire?: string
  date_demande: string
  date_traitement?: string
  partenaire_id?: string
  transaction_id?: string
  created_at: string
  updated_at: string
}

export interface CreateDemandeAvanceSalaire {
  employe_id: string
  montant_demande: number
  type_motif: TypeMotifAvance
  motif: string
  numero_reception?: string
  frais_service: number
  montant_total: number
  salaire_disponible?: number
  avance_disponible?: number
  partenaire_id?: string
  transaction_id?: string
}

export interface UpdateDemandeAvanceSalaire {
  statut?: DemandeStatut
  commentaire?: string
  date_traitement?: string
}

// Constantes pour les types de motif
export const TYPE_MOTIF_OPTIONS = [
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'SANTE', label: 'Santé' },
  { value: 'EDUCATION', label: 'Éducation' },
  { value: 'LOGEMENT', label: 'Logement' },
  { value: 'ALIMENTATION', label: 'Alimentation' },
  { value: 'URGENCE_FAMILIALE', label: 'Urgence Familiale' },
  { value: 'FRAIS_MEDICAUX', label: 'Frais Médicaux' },
  { value: 'FRAIS_SCOLAIRES', label: 'Frais Scolaires' },
  { value: 'REPARATION_VEHICULE', label: 'Réparation Véhicule' },
  { value: 'FRAIS_DEUIL', label: 'Frais de Deuil' },
  { value: 'AUTRE', label: 'Autre' }
] as const

// Constantes pour les statuts
export const STATUT_OPTIONS = [
  { value: 'EN_ATTENTE', label: 'En Attente', color: 'yellow' },
  { value: 'EN_COURS_TRAITEMENT', label: 'En Cours de Traitement', color: 'blue' },
  { value: 'VALIDEE', label: 'Validée', color: 'green' },
  { value: 'REFUSEE', label: 'Refusée', color: 'red' },
  { value: 'ANNULEE', label: 'Annulée', color: 'gray' }
] as const

// Fonction utilitaire pour obtenir la couleur d'un statut
export function getStatutColor(statut: DemandeStatut): string {
  const option = STATUT_OPTIONS.find(opt => opt.value === statut)
  return option?.color || 'gray'
}

// Fonction utilitaire pour obtenir le label d'un statut
export function getStatutLabel(statut: DemandeStatut): string {
  const option = STATUT_OPTIONS.find(opt => opt.value === statut)
  return option?.label || statut
}

// Fonction utilitaire pour obtenir le label d'un type de motif
export function getTypeMotifLabel(typeMotif: TypeMotifAvance): string {
  const option = TYPE_MOTIF_OPTIONS.find(opt => opt.value === typeMotif)
  return option?.label || typeMotif
} 