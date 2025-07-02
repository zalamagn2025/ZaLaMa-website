-- CORRECTION RAPIDE pour les user_id dans la table avis
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Voir le problème actuel
SELECT 'PROBLÈME ACTUEL:' as info;
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_corrects,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_incorrects
FROM avis;

-- 2. CORRECTION RAPIDE : Mettre à jour les user_id incorrects
UPDATE avis 
SET user_id = au.id
FROM users u
JOIN auth.users au ON u.email = au.email
WHERE avis.user_id = u.id;

-- 3. Vérifier le résultat
SELECT 'RÉSULTAT APRÈS CORRECTION:' as info;
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_corrects,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_incorrects
FROM avis;

-- 4. Afficher quelques exemples
SELECT 'EXEMPLES D\'AVIS CORRIGÉS:' as info;
SELECT 
  a.id,
  a.user_id,
  a.note,
  LEFT(a.commentaire, 50) as commentaire_court,
  a.type_retour,
  au.email as user_email
FROM avis a
LEFT JOIN auth.users au ON a.user_id = au.id
ORDER BY a.created_at DESC
LIMIT 5; 