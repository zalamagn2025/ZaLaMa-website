-- Script pour vérifier les valeurs de l'enum employee_gender

-- 1. Vérifier les valeurs de l'enum
SELECT 
  t.typname as enum_name,
  e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'employee_gender'
ORDER BY e.enumsortorder;

-- 2. Vérifier la structure de la table employees
SELECT 
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND column_name = 'genre';

-- 3. Voir quelques exemples d'employés existants
SELECT 
  id,
  nom,
  prenom,
  genre,
  created_at
FROM employees 
LIMIT 5; 