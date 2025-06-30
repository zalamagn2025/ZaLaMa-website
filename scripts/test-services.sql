-- Script de test pour vérifier les services
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier si la table existe
SELECT 'Table services existe' as status, EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'services'
) as exists;

-- 2. Compter les services
SELECT 'Nombre de services' as status, COUNT(*) as count FROM services;

-- 3. Lister tous les services
SELECT id, nom, description, categorie, disponible, pourcentage_max 
FROM services 
ORDER BY categorie, nom;

-- 4. Vérifier les services disponibles
SELECT 'Services disponibles' as status, COUNT(*) as count 
FROM services 
WHERE disponible = true;

-- 5. Vérifier les politiques RLS
SELECT 'Politiques RLS' as status, COUNT(*) as count
FROM pg_policies 
WHERE tablename = 'services';

-- 6. Tester une requête simple
SELECT 'Test requête' as status, COUNT(*) as count
FROM services 
WHERE disponible = true; 