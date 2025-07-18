-- Script pour vérifier la structure de la table employees
-- Exécutez ce script dans votre dashboard Supabase

-- 1. Vérifier la structure exacte de la table employees
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

-- 2. Voir quelques exemples de données existantes
SELECT 
  *
FROM employees 
LIMIT 3;

-- 3. Vérifier les contraintes de la table
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'employees'; 