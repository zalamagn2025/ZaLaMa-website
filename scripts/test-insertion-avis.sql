-- SCRIPT DE TEST - Insertion d'un avis de test
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: VÉRIFICATION DES EMPLOYEES DISPONIBLES
-- =====================================================
SELECT 'EMPLOYEES DISPONIBLES:' as info;

SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  partner_id
FROM employees 
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- ÉTAPE 2: INSERTION D'UN AVIS DE TEST
-- =====================================================
SELECT 'INSERTION D\'UN AVIS DE TEST...' as info;

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
  'Test automatique - Excellent service ! Ceci est un avis de test pour vérifier le fonctionnement.',
  'positif',
  NOW(),
  false
FROM test_employee
RETURNING id, employee_id, note, commentaire, type_retour, created_at;

-- =====================================================
-- ÉTAPE 3: VÉRIFICATION DE L'INSERTION
-- =====================================================
SELECT 'VÉRIFICATION DE L\'INSERTION:' as info;

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
ORDER BY a.created_at DESC
LIMIT 3;

-- =====================================================
-- ÉTAPE 4: INSERTION D'UN AVIS NÉGATIF DE TEST
-- =====================================================
SELECT 'INSERTION D\'UN AVIS NÉGATIF DE TEST...' as info;

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
  2,
  'Test automatique - Service à améliorer. Ceci est un avis négatif de test.',
  'negatif',
  NOW(),
  false
FROM test_employee
RETURNING id, employee_id, note, commentaire, type_retour, created_at;

-- =====================================================
-- ÉTAPE 5: VÉRIFICATION FINALE
-- =====================================================
SELECT 'VÉRIFICATION FINALE - TOUS LES AVIS:' as info;

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

SELECT '✅ TESTS D\'INSERTION TERMINÉS !' as info; 