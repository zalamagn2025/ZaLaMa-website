-- Script pour ajouter la colonne photo_url à la table employees
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure actuelle de la table employees
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'employees'
ORDER BY ordinal_position;

-- 2. Ajouter la colonne photo_url si elle n'existe pas
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);

-- 3. Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'employees'
AND column_name = 'photo_url';

-- 4. Mettre à jour les types TypeScript si nécessaire
-- La colonne photo_url est maintenant disponible dans la table employees

-- 5. Vérifier la structure finale
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'employees'
ORDER BY ordinal_position; 