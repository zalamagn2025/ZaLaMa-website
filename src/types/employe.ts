export interface Employe {
  id: string
  partner_id: string
  nom: string
  prenom: string
  genre: 'Homme' | 'Femme' | 'Autre'
  email: string | null
  telephone: string | null
  adresse: string | null
  poste: string
  role: string | null
  type_contrat: 'CDI' | 'CDD' | 'Consultant' | 'Stage' | 'Autre'
  salaire_net: number | null
  date_embauche: string | null
  actif: boolean
  created_at: string
  updated_at: string
}

export interface UserWithEmployeData {
  // Données Supabase Auth
  id: string
  email: string
  emailVerified: boolean
  displayName?: string
  photoURL?: string
  // Données Employe
  employeId?: string
  prenom?: string
  nom?: string
  nomComplet?: string
  telephone?: string
  poste?: string
  role?: string
  genre?: string
  adresse?: string
  salaireNet?: number
  typeContrat?: string
  dateEmbauche?: string
  partnerId?: string
  userId?: string
  entreprise?: {
    nom: string
    // autres champs de l'entreprise si nécessaire
  }
} 