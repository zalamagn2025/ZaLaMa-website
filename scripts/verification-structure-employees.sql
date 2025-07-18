-- SCRIPT DE VÉRIFICATION - Structure exacte de employees
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- VÉRIFICATION DE LA STRUCTURE COMPLÈTE DE EMPLOYEES
-- =====================================================
SELECT 'STRUCTURE COMPLÈTE DE LA TABLE EMPLOYEES:' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns 
WHERE table_name = 'employees'
ORDER BY ordinal_position;

-- =====================================================
-- VÉRIFICATION DES CONTRAINTES DE EMPLOYEES
-- =====================================================
SELECT 'CONTRAINTES DE LA TABLE EMPLOYEES:' as info;

SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column
FROM information_schema.table_constraints AS tc
LEFT JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'employees'
ORDER BY tc.constraint_type, tc.constraint_name;

-- =====================================================
-- VÉRIFICATION DES INDEX DE EMPLOYEES
-- =====================================================
SELECT 'INDEX DE LA TABLE EMPLOYEES:' as info;

SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'employees'
ORDER BY indexname;

-- =====================================================
-- VÉRIFICATION DES CLÉS PRIMAIRES
-- =====================================================
SELECT 'CLÉS PRIMAIRES DE EMPLOYEES:' as info;

SELECT 
  a.attname as column_name,
  format_type(a.atttypid, a.atttypmod) as data_type
FROM pg_index i
JOIN pg_attribute a ON a.attrelid = i.indrelid
  AND a.attnum = ANY(i.indkey)
WHERE i.indrelid = 'employees'::regclass
  AND i.indisprimary;

-- =====================================================
-- VÉRIFICATION DES VALEURS UNIQUES
-- =====================================================
SELECT 'VALEURS UNIQUES DANS USER_ID:' as info;

SELECT 
  user_id,
  COUNT(*) as occurrences
FROM employees 
GROUP BY user_id 
HAVING COUNT(*) > 1
ORDER BY occurrences DESC;

-- =====================================================
-- VÉRIFICATION DES VALEURS UNIQUES DANS EMAIL
-- =====================================================
SELECT 'VALEURS UNIQUES DANS EMAIL:' as info;

SELECT 
  email,
  COUNT(*) as occurrences
FROM employees 
GROUP BY email 
HAVING COUNT(*) > 1
ORDER BY occurrences DESC;

-- =====================================================
-- ÉCHANTILLON DE DONNÉES EMPLOYEES
-- =====================================================
SELECT 'ÉCHANTILLON DE DONNÉES EMPLOYEES:' as info;

SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  partner_id,
  created_at
FROM employees 
ORDER BY created_at DESC
LIMIT 5; 