-- Script pour créer la table demande-avance-salaire avec structure professionnelle
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- TYPES ENUM POUR LES STATUTS
-- =====================================================
-- Vérifier si les types existent déjà et les créer si nécessaire
DO $$ 
BEGIN
    -- Créer le type demande_statut s'il n'existe pas
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'demande_statut') THEN
        CREATE TYPE demande_statut AS ENUM (
          'EN_ATTENTE',
          'VALIDEE', 
          'REFUSEE',
          'ANNULEE',
          'EN_COURS_TRAITEMENT'
        );
    END IF;
    
    -- Créer le type type_motif_avance s'il n'existe pas
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_motif_avance') THEN
        CREATE TYPE type_motif_avance AS ENUM (
          'TRANSPORT',
          'SANTE',
          'EDUCATION',
          'LOGEMENT',
          'ALIMENTATION',
          'URGENCE_FAMILIALE',
          'FRAIS_MEDICAUX',
          'FRAIS_SCOLAIRES',
          'REPARATION_VEHICULE',
          'FRAIS_DEUIL',
          'AUTRE'
        );
    END IF;
END $$;

-- =====================================================
-- TABLE: demande-avance-salaire
-- =====================================================
CREATE TABLE IF NOT EXISTS "demande-avance-salaire" (
  -- Identifiants
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employe_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  
  -- Informations de la demande
  montant_demande DECIMAL(15,2) NOT NULL CHECK (montant_demande > 0),
  type_motif type_motif_avance NOT NULL,
  motif TEXT NOT NULL,
  numero_reception VARCHAR(50),
  
  -- Informations financières
  frais_service DECIMAL(15,2) DEFAULT 0 CHECK (frais_service >= 0),
  montant_total DECIMAL(15,2) NOT NULL CHECK (montant_total > 0),
  salaire_disponible DECIMAL(15,2),
  avance_disponible DECIMAL(15,2),
  
  -- Statut et suivi
  statut demande_statut NOT NULL DEFAULT 'EN_ATTENTE',
  commentaire TEXT,
  date_demande TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_traitement TIMESTAMP WITH TIME ZONE,
  
  -- Informations supplémentaires
  partenaire_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes de validation
  CONSTRAINT valid_montant_total CHECK (montant_total >= montant_demande),
  CONSTRAINT valid_avance_disponible CHECK (avance_disponible IS NULL OR avance_disponible >= 0),
  CONSTRAINT valid_salaire_disponible CHECK (salaire_disponible IS NULL OR salaire_disponible >= 0)
);

-- =====================================================
-- INDEX POUR LES PERFORMANCES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_demande_avance_employe ON "demande-avance-salaire"(employe_id);
CREATE INDEX IF NOT EXISTS idx_demande_avance_statut ON "demande-avance-salaire"(statut);
CREATE INDEX IF NOT EXISTS idx_demande_avance_date_demande ON "demande-avance-salaire"(date_demande);
CREATE INDEX IF NOT EXISTS idx_demande_avance_type_motif ON "demande-avance-salaire"(type_motif);
CREATE INDEX IF NOT EXISTS idx_demande_avance_partenaire ON "demande-avance-salaire"(partenaire_id);
CREATE INDEX IF NOT EXISTS idx_demande_avance_transaction ON "demande-avance-salaire"(transaction_id);
CREATE INDEX IF NOT EXISTS idx_demande_avance_created_at ON "demande-avance-salaire"(created_at);

-- =====================================================
-- TRIGGER POUR MISE À JOUR AUTOMATIQUE
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS trigger_update_demande_avance_updated_at ON "demande-avance-salaire";

-- Créer le trigger
CREATE TRIGGER trigger_update_demande_avance_updated_at
  BEFORE UPDATE ON "demande-avance-salaire"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE "demande-avance-salaire" ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Employés peuvent voir leurs propres demandes" ON "demande-avance-salaire";
DROP POLICY IF EXISTS "Employés peuvent créer leurs propres demandes" ON "demande-avance-salaire";
DROP POLICY IF EXISTS "Partenaires peuvent voir les demandes de leurs employés" ON "demande-avance-salaire";
DROP POLICY IF EXISTS "Partenaires peuvent traiter les demandes de leurs employés" ON "demande-avance-salaire";

-- Politique pour permettre aux employés de voir leurs propres demandes
CREATE POLICY "Employés peuvent voir leurs propres demandes" ON "demande-avance-salaire"
  FOR SELECT
  TO authenticated
  USING (
    employe_id IN (
      SELECT id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour permettre aux employés de créer leurs propres demandes
CREATE POLICY "Employés peuvent créer leurs propres demandes" ON "demande-avance-salaire"
  FOR INSERT
  TO authenticated
  WITH CHECK (
    employe_id IN (
      SELECT id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour permettre aux partenaires de voir les demandes de leurs employés
CREATE POLICY "Partenaires peuvent voir les demandes de leurs employés" ON "demande-avance-salaire"
  FOR SELECT
  TO authenticated
  USING (
    partenaire_id IN (
      SELECT partner_id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- Politique pour permettre aux partenaires de traiter les demandes de leurs employés
CREATE POLICY "Partenaires peuvent traiter les demandes de leurs employés" ON "demande-avance-salaire"
  FOR UPDATE
  TO authenticated
  USING (
    partenaire_id IN (
      SELECT partner_id FROM employees 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    partenaire_id IN (
      SELECT partner_id FROM employees 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- VUES POUR LES RAPPORTS
-- =====================================================

-- Vue des statistiques des demandes d'avance
CREATE OR REPLACE VIEW demande_avance_statistics AS
SELECT 
  COUNT(*) as total_demandes,
  COUNT(*) FILTER (WHERE statut = 'EN_ATTENTE') as demandes_en_attente,
  COUNT(*) FILTER (WHERE statut = 'VALIDEE') as demandes_validees,
  COUNT(*) FILTER (WHERE statut = 'REFUSEE') as demandes_refusees,
  COUNT(*) FILTER (WHERE statut = 'ANNULEE') as demandes_annulees,
  COALESCE(SUM(montant_demande) FILTER (WHERE statut = 'VALIDEE'), 0) as montant_total_valide,
  COALESCE(AVG(montant_demande), 0) as montant_moyen_demande,
  COUNT(*) FILTER (WHERE date_demande >= CURRENT_DATE - INTERVAL '30 days') as demandes_ce_mois
FROM "demande-avance-salaire";

-- Vue des demandes avec informations employé
CREATE OR REPLACE VIEW demande_avance_with_employee AS
SELECT 
  das.*,
  e.nom as employe_nom,
  e.prenom as employe_prenom,
  e.email as employe_email,
  e.poste as employe_poste,
  p.nom as partenaire_nom
FROM "demande-avance-salaire" das
LEFT JOIN employees e ON das.employe_id = e.id
LEFT JOIN partners p ON das.partenaire_id = p.id;

-- =====================================================
-- FONCTIONS UTILES
-- =====================================================

-- Fonction pour calculer l'avance disponible d'un employé
CREATE OR REPLACE FUNCTION calculer_avance_disponible(p_employe_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  v_salaire_net DECIMAL;
  v_avances_ce_mois DECIMAL;
  v_max_avance_mensuelle DECIMAL;
  v_avance_disponible DECIMAL;
BEGIN
  -- Récupérer le salaire net
  SELECT salaire_net INTO v_salaire_net
  FROM employees
  WHERE id = p_employe_id;
  
  IF v_salaire_net IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculer le maximum d'avance mensuelle (25% du salaire)
  v_max_avance_mensuelle := FLOOR(v_salaire_net * 0.25);
  
  -- Calculer les avances déjà approuvées ce mois
  SELECT COALESCE(SUM(montant_demande), 0) INTO v_avances_ce_mois
  FROM "demande-avance-salaire"
  WHERE employe_id = p_employe_id
    AND statut = 'VALIDEE'
    AND DATE_TRUNC('month', date_demande) = DATE_TRUNC('month', CURRENT_DATE);
  
  -- Calculer l'avance disponible
  v_avance_disponible := GREATEST(0, v_max_avance_mensuelle - v_avances_ce_mois);
  
  RETURN v_avance_disponible;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VÉRIFICATION DE LA CRÉATION
-- =====================================================

-- Vérifier les types ENUM existants
SELECT 
  typname as type_name,
  enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('demande_statut', 'type_motif_avance')
ORDER BY typname, e.enumsortorder;

-- Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'demande-avance-salaire'
ORDER BY ordinal_position;

-- Vérifier les index
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'demande-avance-salaire';

-- Vérifier les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'demande-avance-salaire'
ORDER BY policyname;

-- Test d'insertion (remplacez les valeurs par vos vraies données)
-- INSERT INTO "demande-avance-salaire" (
--   employe_id,
--   montant_demande,
--   type_motif,
--   motif,
--   numero_reception,
--   frais_service,
--   montant_total,
--   salaire_disponible,
--   avance_disponible,
--   partenaire_id
-- ) VALUES (
--   'votre-employee-id-ici',
--   100000,
--   'TRANSPORT',
--   'Frais de transport pour déplacement professionnel',
--   'REF-2024-001',
--   5000,
--   105000,
--   750000,
--   187500,
--   'votre-partner-id-ici'
-- ); 