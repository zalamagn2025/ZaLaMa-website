-- Script de migration rapide pour corriger les user_id dans la table avis
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier l'état actuel de la table avis
SELECT 
  'État actuel de la table avis:' as info,
  COUNT(*) as total_avis,
  COUNT(DISTINCT user_id) as user_ids_uniques
FROM avis;

-- 2. Voir les user_id actuels dans avis
SELECT 
  'User IDs actuels dans avis:' as info,
  user_id,
  COUNT(*) as nombre_avis
FROM avis 
GROUP BY user_id
ORDER BY nombre_avis DESC;

-- 3. Vérifier la correspondance entre users et auth.users
SELECT 
  'Correspondance users -> auth.users:' as info,
  u.id as users_id,
  u.email as users_email,
  au.id as auth_users_id,
  au.email as auth_users_email,
  CASE 
    WHEN u.email = au.email THEN '✅ Correspondance'
    ELSE '❌ Pas de correspondance'
  END as statut
FROM users u
LEFT JOIN auth.users au ON u.email = au.email
WHERE u.email IS NOT NULL
ORDER BY u.email;

-- 4. Vérifier les employés et leurs user_id
SELECT 
  'Employés et leurs user_id:' as info,
  e.id as employee_id,
  e.email as employee_email,
  e.user_id as employee_user_id,
  au.id as auth_user_id,
  au.email as auth_user_email,
  CASE 
    WHEN e.user_id = au.id THEN '✅ Synchronisé'
    WHEN e.email = au.email THEN '⚠️ Email correspond mais user_id différent'
    ELSE '❌ Pas de correspondance'
  END as statut
FROM employees e
LEFT JOIN auth.users au ON e.user_id = au.id OR e.email = au.email
ORDER BY e.email;

-- 5. MIGRATION : Mettre à jour les user_id dans avis
-- Option 1: Via la correspondance email entre users et auth.users
UPDATE avis 
SET user_id = au.id
FROM users u
JOIN auth.users au ON u.email = au.email
WHERE avis.user_id = u.id
  AND au.id IS NOT NULL;

-- 6. Vérifier le résultat de la migration
SELECT 
  'Résultat après migration:' as info,
  COUNT(*) as total_avis,
  COUNT(DISTINCT user_id) as user_ids_uniques
FROM avis;

-- 7. Vérifier que les nouveaux user_id existent dans auth.users
SELECT 
  'Vérification des user_id après migration:' as info,
  a.user_id,
  COUNT(*) as nombre_avis,
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ Existe dans auth.users'
    ELSE '❌ N\'existe pas dans auth.users'
  END as statut
FROM avis a
LEFT JOIN auth.users au ON a.user_id = au.id
GROUP BY a.user_id, au.id
ORDER BY nombre_avis DESC;

-- 8. Nettoyer les avis avec des user_id invalides (optionnel)
-- Décommenter si vous voulez supprimer les avis avec des user_id invalides
-- DELETE FROM avis 
-- WHERE user_id NOT IN (SELECT id FROM auth.users);

-- 9. Vérifier l'état final
SELECT 
  'État final de la table avis:' as info,
  COUNT(*) as total_avis,
  COUNT(DISTINCT user_id) as user_ids_uniques,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_invalides
FROM avis;

-- 10. Afficher quelques exemples d'avis après migration
SELECT 
  'Exemples d\'avis après migration:' as info,
  a.id,
  a.user_id,
  a.note,
  a.commentaire,
  a.type_retour,
  a.created_at,
  au.email as user_email
FROM avis a
LEFT JOIN auth.users au ON a.user_id = au.id
ORDER BY a.created_at DESC
LIMIT 10; 