-- Script pour synchroniser automatiquement tous les employés
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Voir tous les employés qui n'ont pas de user_id
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif
FROM employees e
WHERE e.user_id IS NULL;

-- 2. Voir tous les utilisateurs Auth qui pourraient correspondre
SELECT 
  au.id,
  au.email,
  au.created_at
FROM auth.users au
WHERE au.email IN (
  SELECT e.email 
  FROM employees e 
  WHERE e.user_id IS NULL
);

-- 3. Synchroniser automatiquement tous les employés sans user_id
UPDATE employees 
SET user_id = au.id
FROM auth.users au
WHERE employees.email = au.email 
  AND employees.user_id IS NULL;

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
ORDER BY e.created_at DESC;

-- 5. Lister les employés qui n'ont toujours pas de user_id (problème)
SELECT 
  e.id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif
FROM employees e
WHERE e.user_id IS NULL; 