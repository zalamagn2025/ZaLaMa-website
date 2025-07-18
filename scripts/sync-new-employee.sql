-- Script pour synchroniser le nouvel employé
-- Email: zalamagn@gmail.com

-- 1. Vérifier si l'utilisateur existe dans Auth
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'zalamagn@gmail.com';

-- 2. Vérifier l'état actuel dans la table employees
SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  poste,
  actif
FROM employees 
WHERE email = 'zalamagn@gmail.com';

-- 3. Mettre à jour le user_id pour cet employé
-- Remplacez 'UUID_DE_L_UTILISATEUR_AUTH' par l'UUID obtenu à l'étape 1
UPDATE employees 
SET user_id = 'UUID_DE_L_UTILISATEUR_AUTH'
WHERE email = 'zalamagn@gmail.com';

-- 4. Vérifier le résultat
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
WHERE e.email = 'zalamagn@gmail.com'; 