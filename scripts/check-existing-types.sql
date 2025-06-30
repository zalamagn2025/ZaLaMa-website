-- Script pour vérifier les types ENUM existants
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- VÉRIFICATION DES TYPES EXISTANTS
-- =====================================================

-- Vérifier tous les types ENUM existants
SELECT 
  typname as type_name,
  enumlabel as enum_value,
  e.enumsortorder as sort_order
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typtype = 'e'  -- 'e' pour ENUM
ORDER BY typname, e.enumsortorder;

-- Vérifier spécifiquement nos types
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'demande_statut') 
    THEN 'demande_statut existe'
    ELSE 'demande_statut n''existe pas'
  END as demande_statut_status;

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'type_motif_avance') 
    THEN 'type_motif_avance existe'
    ELSE 'type_motif_avance n''existe pas'
  END as type_motif_avance_status;

-- Vérifier les valeurs des types existants
SELECT 
  'demande_statut' as type_name,
  enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname = 'demande_statut'
ORDER BY e.enumsortorder;

SELECT 
  'type_motif_avance' as type_name,
  enumlabel as enum_value
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname = 'type_motif_avance'
ORDER BY e.enumsortorder;

-- =====================================================
-- VÉRIFICATION DE LA TABLE
-- =====================================================

-- Vérifier si la table existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'demande-avance-salaire') 
    THEN 'Table demande-avance-salaire existe'
    ELSE 'Table demande-avance-salaire n''existe pas'
  END as table_status;

-- Vérifier la structure si la table existe
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'demande-avance-salaire'
ORDER BY ordinal_position;

-- =====================================================
-- COMMANDES UTILES POUR LE DÉBOGAGE
-- =====================================================

-- Pour supprimer un type ENUM (à utiliser avec précaution)
-- DROP TYPE IF EXISTS demande_statut CASCADE;
-- DROP TYPE IF EXISTS type_motif_avance CASCADE;

-- Pour supprimer la table (à utiliser avec précaution)
-- DROP TABLE IF EXISTS "demande-avance-salaire" CASCADE; 