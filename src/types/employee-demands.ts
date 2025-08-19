// Types pour les demandes d'avance de salaire

export interface SalaryAdvanceDemand {
  id: string;
  employe_id: string;
  montant_demande: number;
  type_motif: string;
  motif: string;
  numero_reception?: string;
  frais_service: number;
  montant_total: number;
  statut: 'En attente' | 'Approuvée' | 'Rejetée';
  created_at: string;
  updated_at: string;
}

export interface CreateDemandRequest {
  montant_demande: number;
  type_motif: string;
  motif: string;
  numero_reception?: string;
}

export interface CreateDemandResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    montant_demande: number;
    frais_service: number;
    montant_total: number;
    statut: string;
  };
}

export interface DemandsListResponse {
  success: boolean;
  message: string;
  data: {
    demands: SalaryAdvanceDemand[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface DemandsStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    enAttente: number;
    approuvees: number;
    rejetees: number;
    montantTotal: number;
    montantEnAttente: number;
    montantApprouve: number;
  };
}

export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}






