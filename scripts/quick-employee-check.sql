-- Script rapide pour vérifier et ajouter un employé
-- Remplacez 'email_de_votre_employe@example.com' par l'email réel

-- 1. Vérifier si l'utilisateur existe dans Auth
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'email_de_votre_employe@example.com';

-- 2. Vérifier si l'employé existe dans la table employees
SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  poste,
  actif
FROM employees 
WHERE email = 'email_de_votre_employe@example.com';

-- 3. Ajouter la colonne user_id si elle n'existe pas
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Ajouter une contrainte unique sur email si elle n'existe pas
ALTER TABLE employees 
ADD CONSTRAINT IF NOT EXISTS employees_email_unique UNIQUE (email);

-- 5. Ajouter l'employé (remplacez les valeurs)
-- Copiez l'UUID de l'étape 1 et remplacez les autres valeurs
INSERT INTO employees (
  user_id,
  nom,
  prenom,
  email,
  poste,
  genre,
  type_contrat,
  actif
) VALUES (
  'UUID_DE_L_UTILISATEUR_AUTH', -- Copiez l'UUID de l'étape 1
  'Nom de l\'employé',
  'Prénom de l\'employé',
  'email_de_votre_employe@example.com',
  'Poste de l\'employé',
  'Homme',
  'CDI',
  true
)
ON CONFLICT (email) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  poste = EXCLUDED.poste,
  updated_at = NOW();

-- 6. Vérifier le résultat
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif,
  CASE 
    WHEN e.user_id IS NOT NULL THEN '✅ Synchronisé'
    ELSE '❌ Pas de user_id'
  END as statut_sync
FROM employees e
WHERE e.email = 'email_de_votre_employe@example.com'; 