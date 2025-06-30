import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour correspondre au schéma Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          nom: string
          prenom: string
          telephone: string | null
          adresse: string | null
          type: 'Étudiant' | 'Salarié' | 'Entreprise'
          statut: 'Actif' | 'Inactif' | 'En attente'
          photo_url: string | null
          organisation: string | null
          poste: string | null
          niveau_etudes: string | null
          etablissement: string | null
          date_inscription: string
          derniere_connexion: string | null
          actif: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          nom: string
          prenom: string
          telephone?: string | null
          adresse?: string | null
          type?: 'Étudiant' | 'Salarié' | 'Entreprise'
          statut?: 'Actif' | 'Inactif' | 'En attente'
          photo_url?: string | null
          organisation?: string | null
          poste?: string | null
          niveau_etudes?: string | null
          etablissement?: string | null
          date_inscription?: string
          derniere_connexion?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          nom?: string
          prenom?: string
          telephone?: string | null
          adresse?: string | null
          type?: 'Étudiant' | 'Salarié' | 'Entreprise'
          statut?: 'Actif' | 'Inactif' | 'En attente'
          photo_url?: string | null
          organisation?: string | null
          poste?: string | null
          niveau_etudes?: string | null
          etablissement?: string | null
          date_inscription?: string
          derniere_connexion?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      partners: {
        Row: {
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
        Insert: {
          id?: string
          nom: string
          type: string
          secteur: string
          description?: string | null
          nom_representant?: string | null
          email_representant?: string | null
          telephone_representant?: string | null
          nom_rh?: string | null
          email_rh?: string | null
          telephone_rh?: string | null
          rccm?: string | null
          nif?: string | null
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          site_web?: string | null
          logo_url?: string | null
          date_adhesion?: string
          actif?: boolean
          nombre_employes?: number
          salaire_net_total?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          type?: string
          secteur?: string
          description?: string | null
          nom_representant?: string | null
          email_representant?: string | null
          telephone_representant?: string | null
          nom_rh?: string | null
          email_rh?: string | null
          telephone_rh?: string | null
          rccm?: string | null
          nif?: string | null
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          site_web?: string | null
          logo_url?: string | null
          date_adhesion?: string
          actif?: boolean
          nombre_employes?: number
          salaire_net_total?: number
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
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
        Insert: {
          id?: string
          partner_id: string
          nom: string
          prenom: string
          genre: 'Homme' | 'Femme' | 'Autre'
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          poste: string
          role?: string | null
          type_contrat: 'CDI' | 'CDD' | 'Consultant' | 'Stage' | 'Autre'
          salaire_net?: number | null
          date_embauche?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          nom?: string
          prenom?: string
          genre?: 'Homme' | 'Femme' | 'Autre'
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          poste?: string
          role?: string | null
          type_contrat?: 'CDI' | 'CDD' | 'Consultant' | 'Stage' | 'Autre'
          salaire_net?: number | null
          date_embauche?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      financial_transactions: {
        Row: {
          id: string
          montant: number
          type: 'Débloqué' | 'Récupéré' | 'Revenu' | 'Remboursement'
          description: string | null
          partenaire_id: string | null
          utilisateur_id: string | null
          service_id: string | null
          statut: 'En attente' | 'Validé' | 'Rejeté' | 'Annulé'
          date_transaction: string
          date_validation: string | null
          reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          montant: number
          type: 'Débloqué' | 'Récupéré' | 'Revenu' | 'Remboursement'
          description?: string | null
          partenaire_id?: string | null
          utilisateur_id?: string | null
          service_id?: string | null
          statut?: 'En attente' | 'Validé' | 'Rejeté' | 'Annulé'
          date_transaction?: string
          date_validation?: string | null
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          montant?: number
          type?: 'Débloqué' | 'Récupéré' | 'Revenu' | 'Remboursement'
          description?: string | null
          partenaire_id?: string | null
          utilisateur_id?: string | null
          service_id?: string | null
          statut?: 'En attente' | 'Validé' | 'Rejeté' | 'Annulé'
          date_transaction?: string
          date_validation?: string | null
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 