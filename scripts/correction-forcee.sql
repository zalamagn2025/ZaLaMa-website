-- SCRIPT DE CORRECTION FORCÉE - Problème de clé étrangère avis
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: SUPPRESSION FORCÉE DE TOUTES LES CONTRAINTES
-- =====================================================
SELECT 'SUPPRESSION FORCÉE DE TOUTES LES CONTRAINTES...' as info;

-- Supprimer toutes les contraintes possibles
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_users_id_fkey;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey1;
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey2;

-- =====================================================
-- ÉTAPE 2: VÉRIFICATION QU'AUCUNE CONTRAINTE N'EXISTE
-- =====================================================
SELECT 'VÉRIFICATION - Aucune contrainte ne doit exister:' as info;

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
-- ÉTAPE 3: CRÉATION DE LA NOUVELLE CONTRAINTE VERS AUTH.USERS
-- =====================================================
SELECT 'CRÉATION DE LA NOUVELLE CONTRAINTE VERS AUTH.USERS...' as info;

ALTER TABLE avis 
ADD CONSTRAINT avis_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =====================================================
-- ÉTAPE 4: VÉRIFICATION DE LA NOUVELLE CONTRAINTE
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
-- ÉTAPE 5: TEST DE VALIDATION
-- =====================================================
SELECT 'TEST DE VALIDATION:' as info;

-- Vérifier que les user_id dans avis existent dans auth.users
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_invalides
FROM avis;

-- =====================================================
-- ÉTAPE 6: CORRECTION DES USER_ID SI NÉCESSAIRE
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

SELECT '✅ CORRECTION FORCÉE TERMINÉE ! Testez maintenant l\'application.' as info; 