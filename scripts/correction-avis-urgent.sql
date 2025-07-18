-- SCRIPT DE CORRECTION URGENT - Problème de clé étrangère avis
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: SUPPRIMER L'ANCIENNE CONTRAINTE
-- =====================================================
SELECT 'SUPPRESSION DE L\'ANCIENNE CONTRAINTE...' as info;

ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey;

-- =====================================================
-- ÉTAPE 2: AJOUTER LA NOUVELLE CONTRAINTE VERS AUTH.USERS
-- =====================================================
SELECT 'AJOUT DE LA NOUVELLE CONTRAINTE VERS AUTH.USERS...' as info;

ALTER TABLE avis 
ADD CONSTRAINT avis_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =====================================================
-- ÉTAPE 3: VÉRIFICATION
-- =====================================================
SELECT 'VÉRIFICATION DE LA NOUVELLE CONTRAINTE:' as info;

SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'avis'
  AND kcu.column_name = 'user_id';

-- =====================================================
-- ÉTAPE 4: TEST RAPIDE
-- =====================================================
SELECT 'TEST - Vérification des user_id dans avis:' as info;

SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_invalides
FROM avis;

-- =====================================================
-- ÉTAPE 5: CORRECTION DES USER_ID SI NÉCESSAIRE
-- =====================================================
SELECT 'CORRECTION DES USER_ID SI NÉCESSAIRE...' as info;

-- Mettre à jour les user_id qui pointent vers users au lieu de auth.users
UPDATE avis 
SET user_id = au.id
FROM users u
JOIN auth.users au ON u.email = au.email
WHERE avis.user_id = u.id;

-- Vérification finale
SELECT 'RÉSULTAT FINAL:' as info;
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_invalides
FROM avis;

SELECT '✅ CORRECTION TERMINÉE ! Vous pouvez maintenant tester l\'application.' as info; 