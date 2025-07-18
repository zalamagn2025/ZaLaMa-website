export interface Partenaire {
  id: string
  nom: string
  type: string
  secteur: string
  description: string | null
  nom_representant: string | null
  email_representant: string | null
  telephone_representant: string | null
  nom_rh: string | null
  email_rh: string | null
  telephone_rh: string | null
  rccm: string | null
  nif: string | null
  email: string | null
  telephone: string | null
  adresse: string | null
  site_web: string | null
  logo_url: string | null
  date_adhesion: string
  actif: boolean
  nombre_employes: number
  salaire_net_total: number
  created_at: string
  updated_at: string
} 

export interface PartnershipRequest {
  id: string
  company_name: string
  legal_status: string
  rccm: string
  nif: string
  activity_domain: string
  headquarters_address: string
  phone: string
  email: string
  employees_count: number
  payroll: string
  cdi_count: number
  cdd_count: number
  payment_date: string
  payment_day?: number
  rep_full_name: string
  rep_position: string
  rep_email: string
  rep_phone: string
  hr_full_name: string
  hr_email: string
  hr_phone: string
  agreement: boolean
  motivation_letter_url?: string // URL du fichier uploadé
  motivation_letter_text?: string // Texte de la lettre rédigée
  status: 'pending' | 'approved' | 'rejected' | 'in_review'
  created_at: string
  updated_at: string
}

export interface CreatePartnershipRequest {
  company_name: string
  legal_status: string
  rccm: string
  nif: string
  activity_domain: string
  headquarters_address: string
  phone: string
  email: string
  employees_count: number
  payroll: string
  cdi_count: number
  cdd_count: number
  payment_date: string
  payment_day?: number
  rep_full_name: string
  rep_position: string
  rep_email: string
  rep_phone: string
  hr_full_name: string
  hr_email: string
  hr_phone: string
  agreement: boolean
  motivation_letter_url?: string // URL du fichier uploadé
  motivation_letter_text?: string // Texte de la lettre rédigée
}

export interface FileUploadResponse {
  success: boolean
  url?: string
  error?: string
} 