-- SCRIPT DE TEST - Vérification des données avis
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: VÉRIFICATION DE LA STRUCTURE DES TABLES
-- =====================================================
SELECT 'STRUCTURE DE LA TABLE AVIS:' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'avis'
ORDER BY ordinal_position;

SELECT 'STRUCTURE DE LA TABLE EMPLOYEES:' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'employees'
ORDER BY ordinal_position;

-- =====================================================
-- ÉTAPE 2: VÉRIFICATION DES CONTRAINTES
-- =====================================================
SELECT 'CONTRAINTES DE LA TABLE AVIS:' as info;

SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'avis'
ORDER BY tc.constraint_type, tc.constraint_name;

-- =====================================================
-- ÉTAPE 3: VÉRIFICATION DES DONNÉES
-- =====================================================
SELECT 'DONNÉES DANS LA TABLE AVIS:' as info;

SELECT 
  id,
  employee_id,
  partner_id,
  note,
  LEFT(commentaire, 50) as commentaire_court,
  type_retour,
  date_avis,
  approuve,
  created_at
FROM avis 
ORDER BY created_at DESC;

-- =====================================================
-- ÉTAPE 4: VÉRIFICATION DES EMPLOYEES
-- =====================================================
SELECT 'EMPLOYEES DISPONIBLES:' as info;

SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  partner_id,
  created_at
FROM employees 
ORDER BY created_at DESC;

-- =====================================================
-- ÉTAPE 5: TEST DE JOINTURE AVIS-EMPLOYEES
-- =====================================================
SELECT 'JOINTURE AVIS-EMPLOYEES:' as info;

SELECT 
  a.id as avis_id,
  a.employee_id,
  a.note,
  LEFT(a.commentaire, 50) as commentaire_court,
  a.type_retour,
  a.created_at as avis_created,
  e.id as employee_id_from_join,
  e.email as employee_email,
  e.nom as employee_nom,
  e.prenom as employee_prenom,
  e.user_id as employee_user_id
FROM avis a
LEFT JOIN employees e ON a.employee_id = e.id
ORDER BY a.created_at DESC;

-- =====================================================
-- ÉTAPE 6: VÉRIFICATION DES AVIS VALIDES
-- =====================================================
SELECT 'AVIS VALIDES (AVEC EMPLOYEE):' as info;

SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE employee_id IN (SELECT id FROM employees)) as avis_avec_employee,
  COUNT(*) FILTER (WHERE employee_id NOT IN (SELECT id FROM employees)) as avis_sans_employee
FROM avis;

-- =====================================================
-- ÉTAPE 7: TEST D'INSERTION (optionnel)
-- =====================================================
-- Décommenter pour tester l'insertion d'un avis de test
-- SELECT 'TEST D\'INSERTION D\'UN AVIS:' as info;
-- 
-- -- Récupérer un employee_id valide
-- WITH test_employee AS (
--   SELECT id FROM employees LIMIT 1
-- )
-- INSERT INTO avis (
--   employee_id,
--   partner_id,
--   note,
--   commentaire,
--   type_retour,
--   date_avis,
--   approuve
-- ) 
-- SELECT 
--   id,
--   NULL,
--   5,
--   'Test automatique - Excellent service !',
--   'positif',
--   NOW(),
--   false
-- FROM test_employee;

SELECT '✅ TEST TERMINÉ - Vérifiez les résultats ci-dessus.' as info; 