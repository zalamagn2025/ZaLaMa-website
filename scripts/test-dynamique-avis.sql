-- SCRIPT DE TEST - Insertion dynamique d'avis
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: VÉRIFICATION INITIALE
-- =====================================================
SELECT 'ÉTAT INITIAL:' as info;
SELECT COUNT(*) as total_avis FROM avis;

-- =====================================================
-- ÉTAPE 2: INSERTION D'AVIS DE TEST
-- =====================================================
SELECT 'INSERTION D\'AVIS DE TEST...' as info;

-- Récupérer le premier employee_id disponible
WITH test_employee AS (
  SELECT id, email FROM employees LIMIT 1
)
INSERT INTO avis (
  employee_id,
  partner_id,
  note,
  commentaire,
  type_retour,
  date_avis,
  approuve
) 
SELECT 
  id,
  NULL,
  5,
  'Test dynamique - Excellent service ! Cet avis a été créé pour tester l''affichage dynamique.',
  'positif',
  NOW(),
  false
FROM test_employee
RETURNING id, employee_id, note, commentaire, type_retour, created_at;

-- =====================================================
-- ÉTAPE 3: INSERTION D'UN AVIS NÉGATIF
-- =====================================================
SELECT 'INSERTION D\'UN AVIS NÉGATIF...' as info;

WITH test_employee AS (
  SELECT id, email FROM employees LIMIT 1
)
INSERT INTO avis (
  employee_id,
  partner_id,
  note,
  commentaire,
  type_retour,
  date_avis,
  approuve
) 
SELECT 
  id,
  NULL,
  2,
  'Test dynamique - Service à améliorer. Cet avis négatif teste l''affichage.',
  'negatif',
  NOW(),
  false
FROM test_employee
RETURNING id, employee_id, note, commentaire, type_retour, created_at;

-- =====================================================
-- ÉTAPE 4: VÉRIFICATION FINALE
-- =====================================================
SELECT 'VÉRIFICATION FINALE:' as info;

SELECT 
  COUNT(*) as total_avis_apres_insertion
FROM avis;

-- Afficher tous les avis avec détails
SELECT 'TOUS LES AVIS:' as info;
SELECT 
  a.id as avis_id,
  a.employee_id,
  a.note,
  LEFT(a.commentaire, 50) as commentaire_court,
  a.type_retour,
  a.created_at as avis_created,
  e.email as employee_email,
  e.nom as employee_nom,
  e.prenom as employee_prenom
FROM avis a
LEFT JOIN employees e ON a.employee_id = e.id
ORDER BY a.created_at DESC;

-- =====================================================
-- ÉTAPE 5: TEST DE PERFORMANCE
-- =====================================================
SELECT 'TEST DE PERFORMANCE:' as info;

-- Vérifier les index
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'avis'
ORDER BY indexname;

-- Vérifier les contraintes
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'avis';

SELECT '✅ TESTS D\'INSERTION DYNAMIQUE TERMINÉS !' as info; 