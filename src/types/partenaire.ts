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