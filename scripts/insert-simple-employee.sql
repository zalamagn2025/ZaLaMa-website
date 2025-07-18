-- Script simple pour insérer des données d'employé
-- Remplacez 'votre-user-id-ici' par votre vrai user_id de Supabase Auth

-- 1. D'abord, vérifions la structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

-- 2. Insérer avec seulement les champs essentiels
INSERT INTO employees (
  user_id,
  nom,
  prenom,
  salaire_net,
  poste,
  statut
) VALUES 
-- Remplacez 'votre-user-id-ici' par votre vrai user_id
('votre-user-id-ici', 'Test', 'User', 750000, 'Développeur', 'Actif')
ON CONFLICT (user_id) DO UPDATE SET
  salaire_net = EXCLUDED.salaire_net,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  poste = EXCLUDED.poste,
  statut = EXCLUDED.statut;

-- 3. Vérifier l'insertion
SELECT 
  id,
  user_id,
  nom,
  prenom,
  salaire_net,
  poste,
  statut
FROM employees 
WHERE user_id = 'votre-user-id-ici'; 