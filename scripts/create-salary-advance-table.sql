-- Script pour créer la table salary_advance_requests
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- TABLE: salary_advance_requests
-- =====================================================
CREATE TABLE IF NOT EXISTS salary_advance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employe_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  partenaire_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  montant_demande DECIMAL(15,2) NOT NULL,
  type_motif VARCHAR(50) NOT NULL,
  motif TEXT NOT NULL,
  numero_reception VARCHAR(20),
  frais_service DECIMAL(15,2) DEFAULT 0,
  montant_total DECIMAL(15,2) NOT NULL,
  salaire_disponible DECIMAL(15,2),
  avance_disponible DECIMAL(15,2),
  statut transaction_status NOT NULL DEFAULT 'En attente',
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_validation TIMESTAMP WITH TIME ZONE,
  date_rejet TIMESTAMP WITH TIME ZONE,
  motif_rejet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_salary_advance_requests_employe ON salary_advance_requests(employe_id);
CREATE INDEX IF NOT EXISTS idx_salary_advance_requests_partenaire ON salary_advance_requests(partenaire_id);
CREATE INDEX IF NOT EXISTS idx_salary_advance_requests_statut ON salary_advance_requests(statut);
CREATE INDEX IF NOT EXISTS idx_salary_advance_requests_date_creation ON salary_advance_requests(date_creation);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer le trigger s'il existe déjà, puis le recréer
DROP TRIGGER IF EXISTS trigger_update_salary_advance_requests_updated_at ON salary_advance_requests;
CREATE TRIGGER trigger_update_salary_advance_requests_updated_at
  BEFORE UPDATE ON salary_advance_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Politique pour les employés
ALTER TABLE salary_advance_requests ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Employés peuvent voir leurs propres demandes d'avance" ON salary_advance_requests;
DROP POLICY IF EXISTS "Employés peuvent créer leurs propres demandes d'avance" ON salary_advance_requests;
DROP POLICY IF EXISTS "Partenaires peuvent voir les demandes de leurs employés" ON salary_advance_requests;
DROP POLICY IF EXISTS "Partenaires peuvent mettre à jour les demandes de leurs employés" ON salary_advance_requests;

-- Politique pour permettre aux employés de voir leurs propres demandes
CREATE POLICY "Employés peuvent voir leurs propres demandes d'avance" ON salary_advance_requests
  FOR SELECT USING (
    employe_id IN (
      SELECT id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour permettre aux employés de créer leurs propres demandes
CREATE POLICY "Employés peuvent créer leurs propres demandes d'avance" ON salary_advance_requests
  FOR INSERT WITH CHECK (
    employe_id IN (
      SELECT id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour permettre aux partenaires de voir les demandes de leurs employés
CREATE POLICY "Partenaires peuvent voir les demandes de leurs employés" ON salary_advance_requests
  FOR SELECT USING (
    partenaire_id IN (
      SELECT partner_id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour permettre aux partenaires de mettre à jour les demandes de leurs employés
CREATE POLICY "Partenaires peuvent mettre à jour les demandes de leurs employés" ON salary_advance_requests
  FOR UPDATE USING (
    partenaire_id IN (
      SELECT partner_id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Vérifier que la table a été créée
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'salary_advance_requests'
ORDER BY ordinal_position; 