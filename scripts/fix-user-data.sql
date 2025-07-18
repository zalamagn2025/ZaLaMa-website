-- Script pour corriger les données utilisateur
-- Exécutez ce script pour créer l'employé manquant

-- 1. Vérifier si l'utilisateur Auth existe
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'bea_bintou@yahoo.fr';

-- 2. Vérifier si l'employé existe
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  partner_id
FROM employees 
WHERE email = 'bea_bintou@yahoo.fr';

-- 3. Créer l'employé s'il n'existe pas
-- Remplacez '77a51763-16bc-4b2f-ac3c-3ca8f73945b6' par le vrai user_id de l'utilisateur Auth
INSERT INTO employees (
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  genre,
  type_contrat,
  date_embauche
) VALUES 
('77a51763-16bc-4b2f-ac3c-3ca8f73945b6', 'Bintou', 'Bea', 'bea_bintou@yahoo.fr', 10000000, 'Développeur', true, 'FEMME', 'CDI', '2024-01-15')
ON CONFLICT (user_id) DO UPDATE SET
  salaire_net = 10000000,
  actif = true,
  updated_at = NOW();

-- 4. Vérifier après insertion
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  partner_id,
  created_at
FROM employees 
WHERE email = 'bea_bintou@yahoo.fr';

-- 5. Vérifier les politiques RLS
-- Assurez-vous que l'utilisateur peut lire ses propres données
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'employees'; 