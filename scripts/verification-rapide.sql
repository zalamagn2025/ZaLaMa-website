-- VÉRIFICATION RAPIDE - Diagnostic du problème
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. VÉRIFICATION DE LA STRUCTURE
-- =====================================================
SELECT 'STRUCTURE AVIS:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'avis' ORDER BY ordinal_position;

SELECT 'STRUCTURE EMPLOYEES:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'employees' ORDER BY ordinal_position;

-- =====================================================
-- 2. VÉRIFICATION DES DONNÉES
-- =====================================================
SELECT 'NOMBRE D\'EMPLOYEES:' as info;
SELECT COUNT(*) as total_employees FROM employees;

SELECT 'NOMBRE D\'AVIS:' as info;
SELECT COUNT(*) as total_avis FROM avis;

-- =====================================================
-- 3. VÉRIFICATION DES CONTRAINTES
-- =====================================================
SELECT 'CONTRAINTES AVIS:' as info;
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
WHERE tc.table_name = 'avis';

-- =====================================================
-- 4. ÉCHANTILLON DE DONNÉES
-- =====================================================
SELECT 'EMPLOYEES SAMPLE:' as info;
SELECT id, user_id, email, nom, prenom FROM employees LIMIT 3;

SELECT 'AVIS SAMPLE:' as info;
SELECT id, employee_id, note, LEFT(commentaire, 30) as commentaire_court FROM avis LIMIT 3;

-- =====================================================
-- 5. TEST DE JOINTURE
-- =====================================================
SELECT 'TEST JOINTURE:' as info;
SELECT 
  a.id as avis_id,
  a.employee_id,
  e.id as employee_id_from_join,
  e.email
FROM avis a
LEFT JOIN employees e ON a.employee_id = e.id
LIMIT 5; 