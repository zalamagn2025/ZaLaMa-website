export type MethodePaiement = 'MOBILE_MONEY' | 'VIREMENT_BANCAIRE' | 'CARTE_BANCAIRE' | 'ESPECES';
export type TransactionStatut = 'EFFECTUEE' | 'EN_COURS' | 'ECHOUE' | 'ANNULEE';

export interface Transaction {
  id: string;
  demande_avance_id?: string;
  employe_id?: string;
  entreprise_id?: string;
  montant: number;
  numero_transaction: string;
  methode_paiement: MethodePaiement;
  numero_compte?: string;
  numero_reception?: string;
  date_transaction: string;
  recu_url?: string;
  date_creation: string;
  statut: TransactionStatut;
  created_at: string;
  updated_at: string;
  description?: string;
  message_callback?: string;
  // Relations
  employe?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  entreprise?: {
    id: string;
    nom: string;
    email: string;
  };
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
} 