-- SCRIPT DE CORRECTION - Avis liés aux employees via employee_id
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: VÉRIFICATION DE LA STRUCTURE ACTUELLE
-- =====================================================
SELECT 'VÉRIFICATION DE LA STRUCTURE ACTUELLE:' as info;

-- Vérifier la structure de avis
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'avis'
ORDER BY ordinal_position;

-- Vérifier la structure de employees
SELECT 'STRUCTURE EMPLOYEES:' as info;
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'employees'
ORDER BY ordinal_position;

-- =====================================================
-- ÉTAPE 2: SUPPRESSION DE L'ANCIENNE CONTRAINTE
-- =====================================================
SELECT 'SUPPRESSION DE L\'ANCIENNE CONTRAINTE...' as info;

ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_users_id_fkey;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey1;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey2;

-- =====================================================
-- ÉTAPE 3: RENOMMER LA COLONNE USER_ID EN EMPLOYEE_ID
-- =====================================================
SELECT 'RENOMMAGE DE LA COLONNE USER_ID EN EMPLOYEE_ID...' as info;

-- Renommer la colonne user_id en employee_id
ALTER TABLE avis RENAME COLUMN user_id TO employee_id;

-- =====================================================
-- ÉTAPE 4: CRÉATION DE LA NOUVELLE CONTRAINTE VERS EMPLOYEES.ID
-- =====================================================
SELECT 'CRÉATION DE LA NOUVELLE CONTRAINTE VERS EMPLOYEES.ID...' as info;

ALTER TABLE avis 
ADD CONSTRAINT avis_employee_id_fkey 
FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE;

-- =====================================================
-- ÉTAPE 5: VÉRIFICATION DE LA NOUVELLE CONTRAINTE
-- =====================================================
SELECT 'VÉRIFICATION DE LA NOUVELLE CONTRAINTE:' as info;

SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'avis'
  AND kcu.column_name = 'employee_id';

-- =====================================================
-- ÉTAPE 6: MIGRATION DES DONNÉES EXISTANTES
-- =====================================================
SELECT 'MIGRATION DES DONNÉES EXISTANTES...' as info;

-- Mettre à jour les employee_id pour pointer vers l'ID de l'employé
UPDATE avis 
SET employee_id = e.id
FROM employees e
WHERE avis.employee_id = e.user_id;

-- Vérification de la migration
SELECT 'VÉRIFICATION DE LA MIGRATION:' as info;
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE employee_id IN (SELECT id FROM employees)) as avis_valides,
  COUNT(*) FILTER (WHERE employee_id NOT IN (SELECT id FROM employees)) as avis_invalides
FROM avis;

-- =====================================================
-- ÉTAPE 7: AFFICHAGE DES AVIS AVEC DÉTAILS EMPLOYE
-- =====================================================
SELECT 'AVIS AVEC DÉTAILS EMPLOYE:' as info;

SELECT 
  a.id as avis_id,
  a.employee_id,
  a.note,
  LEFT(a.commentaire, 50) as commentaire_court,
  a.type_retour,
  a.created_at as avis_created,
  e.email as employee_email,
  e.nom as employee_nom,
  e.prenom as employee_prenom,
  e.user_id as employee_user_id
FROM avis a
LEFT JOIN employees e ON a.employee_id = e.id
ORDER BY a.created_at DESC
LIMIT 5;

-- =====================================================
-- ÉTAPE 8: CRÉATION D'INDEX POUR LES PERFORMANCES
-- =====================================================
SELECT 'CRÉATION D\'INDEX POUR LES PERFORMANCES...' as info;

CREATE INDEX IF NOT EXISTS idx_avis_employee_id ON avis(employee_id);
CREATE INDEX IF NOT EXISTS idx_avis_created_at ON avis(created_at);
CREATE INDEX IF NOT EXISTS idx_avis_type_retour ON avis(type_retour);

SELECT '✅ CORRECTION TERMINÉE ! Les avis sont maintenant liés aux employees via employee_id.' as info; 