-- Script pour ajouter manuellement un employé
-- Remplacez les valeurs par celles de votre employé

-- 1. D'abord, vérifier si l'utilisateur existe dans Auth
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email = 'email_de_votre_employe@example.com';

-- 2. Ajouter l'employé dans la table employes
-- Remplacez les valeurs par celles de votre employé
INSERT INTO employes (
  user_id,
  email,
  nom,
  prenom,
  poste,
  genre,
  type_contrat,
  actif
) VALUES (
  'UUID_DE_L_UTILISATEUR_AUTH', -- Remplacez par l'ID de l'utilisateur Auth
  'email_de_votre_employe@example.com', -- Email de l'employé
  'Nom de l\'employé',
  'Prénom de l\'employé',
  'Poste de l\'employé',
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

-- 3. Vérifier que l'employé a été ajouté
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif,
  e.created_at
FROM employes e
WHERE e.email = 'email_de_votre_employe@example.com';

-- 4. Lister tous les employés
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif,
  e.created_at
FROM employes e
ORDER BY e.created_at DESC; 