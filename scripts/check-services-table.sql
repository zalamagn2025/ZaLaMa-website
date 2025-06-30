-- Script pour vérifier et corriger la table services
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier si la table services existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'services'
) as table_exists;

-- 2. Vérifier la structure de la table services
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'services'
ORDER BY ordinal_position;

-- 3. Vérifier les contraintes de la table
SELECT 
    tc.constraint_name, 
    tc.constraint_type, 
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'services' 
    AND tc.table_schema = 'public';

-- 4. Vérifier les données existantes
SELECT id, nom, description, categorie, disponible, pourcentage_max 
FROM services 
ORDER BY categorie, nom;

-- 5. Vérifier les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'services';

-- 6. Si la table n'a pas de contrainte unique sur 'nom', en ajouter une (optionnel)
-- ALTER TABLE services ADD CONSTRAINT services_nom_unique UNIQUE (nom); 