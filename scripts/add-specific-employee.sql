-- Script pour ajouter manuellement un employé spécifique
-- Remplacez les valeurs par celles de votre employé

-- 1. Vérifier si l'utilisateur existe dans Auth
-- Remplacez 'email_de_votre_employe@example.com' par l'email réel
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email = 'email_de_votre_employe@example.com';

-- 2. Ajouter la colonne user_id si elle n'existe pas
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Ajouter une contrainte unique sur email si elle n'existe pas
ALTER TABLE employees 
ADD CONSTRAINT IF NOT EXISTS employees_email_unique UNIQUE (email);

-- 4. Ajouter l'employé dans la table employees
-- Remplacez toutes les valeurs par celles de votre employé
INSERT INTO employees (
  user_id,
  partner_id,
  nom,
  prenom,
  email,
  poste,
  genre,
  type_contrat,
  actif
) VALUES (
  'UUID_DE_L_UTILISATEUR_AUTH', -- Remplacez par l'ID de l'utilisateur Auth (étape 1)
  NULL, -- partner_id (à remplir si nécessaire)
  'Nom de l\'employé', -- Remplacez par le nom réel
  'Prénom de l\'employé', -- Remplacez par le prénom réel
  'email_de_votre_employe@example.com', -- Remplacez par l'email réel
  'Poste de l\'employé', -- Remplacez par le poste réel
  'Homme', -- ou 'Femme' ou 'Autre'
  'CDI', -- ou 'CDD', 'Consultant', 'Stage', 'Autre'
  true
)
ON CONFLICT (email) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  poste = EXCLUDED.poste,
  genre = EXCLUDED.genre,
  type_contrat = EXCLUDED.type_contrat,
  actif = EXCLUDED.actif,
  updated_at = NOW();

-- 5. Vérifier que l'employé a été ajouté
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif,
  e.created_at,
  CASE 
    WHEN e.user_id IS NOT NULL THEN '✅ Synchronisé'
    ELSE '❌ Pas de user_id'
  END as statut_sync
FROM employees e
WHERE e.email = 'email_de_votre_employe@example.com';

-- 6. Lister tous les employés pour vérification
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif,
  e.created_at
FROM employees e
ORDER BY e.created_at DESC; 