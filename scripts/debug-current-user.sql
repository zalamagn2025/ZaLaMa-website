-- Script pour déboguer l'utilisateur actuel
-- Remplacez '77a51763-16bc-4b2f-ac3c-3ca8f73945b6' par votre user_id

-- 1. Vérifier l'utilisateur Auth
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE id = '77a51763-16bc-4b2f-ac3c-3ca8f73945b6';

-- 2. Vérifier l'employé correspondant
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
WHERE user_id = '77a51763-16bc-4b2f-ac3c-3ca8f73945b6';

-- 3. Vérifier le partenaire
SELECT 
  p.id,
  p.nom,
  p.email,
  p.statut
FROM partenaires p
JOIN employees e ON p.id = e.partner_id
WHERE e.user_id = '77a51763-16bc-4b2f-ac3c-3ca8f73945b6';

-- 4. Créer l'employé s'il n'existe pas
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
  actif = true;

-- 5. Vérifier après insertion
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
WHERE user_id = '77a51763-16bc-4b2f-ac3c-3ca8f73945b6'; 