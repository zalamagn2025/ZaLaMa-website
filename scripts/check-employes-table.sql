-- Script pour vérifier l'existence et la structure de la table employes
-- Exécuter dans l'éditeur SQL de Supabase

-- Vérifier si la table employes existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'employes'
) as table_exists;

-- Vérifier si la table employees existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'employees'
) as employees_table_exists;

-- Lister toutes les tables du schéma public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Si la table employes existe, voir sa structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'employes'
ORDER BY ordinal_position;

-- Si la table employees existe, voir sa structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'employees'
ORDER BY ordinal_position; 