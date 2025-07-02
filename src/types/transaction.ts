export type TransactionType = 'Avance de salaire' | 'Prêt entre pairs' | 'Autre';
export type TransactionStatus = 'En attente' | 'Approuvé' | 'Rejeté' | 'Terminé';

export interface Transaction {
  id: string;
  montant: number;
  type: TransactionType;
  description?: string;
  statut: TransactionStatus;
  date_transaction: string;
  date_validation?: string;
  reference?: string;
  service: string;
  partenaire: string;
  transaction_id: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
} 