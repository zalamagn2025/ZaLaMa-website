-- Script simplifié pour configurer la table avis (RLS désactivé)
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: DIAGNOSTIC INITIAL
-- =====================================================
SELECT 'DIAGNOSTIC INITIAL:' as info;
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_corrects,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_incorrects
FROM avis;

-- =====================================================
-- ÉTAPE 2: CORRECTION DES USER_ID
-- =====================================================
SELECT 'CORRECTION DES USER_ID...' as info;

-- Mettre à jour les user_id incorrects
UPDATE avis 
SET user_id = au.id
FROM users u
JOIN auth.users au ON u.email = au.email
WHERE avis.user_id = u.id;

-- Vérifier le résultat
SELECT 'RÉSULTAT APRÈS CORRECTION USER_ID:' as info;
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_corrects,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_incorrects
FROM avis;

-- =====================================================
-- ÉTAPE 3: CORRECTION DE LA CONTRAINTE DE CLÉ ÉTRANGÈRE
-- =====================================================
SELECT 'CORRECTION DE LA CONTRAINTE DE CLÉ ÉTRANGÈRE...' as info;

-- Supprimer l'ancienne contrainte
ALTER TABLE avis DROP CONSTRAINT IF EXISTS avis_user_id_fkey;

-- Ajouter la nouvelle contrainte vers auth.users
ALTER TABLE avis 
ADD CONSTRAINT avis_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Vérifier la nouvelle contrainte
SELECT 'NOUVELLE CONTRAINTE:' as info;
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
-- ÉTAPE 4: DÉSACTIVER RLS (si pas déjà fait)
-- =====================================================
SELECT 'DÉSACTIVATION RLS...' as info;

-- Désactiver RLS
ALTER TABLE avis DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est désactivé
SELECT 'STATUT RLS:' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'avis';

-- =====================================================
-- ÉTAPE 5: CRÉATION DES INDEX
-- =====================================================
SELECT 'CRÉATION DES INDEX...' as info;

CREATE INDEX IF NOT EXISTS idx_avis_user_id ON avis(user_id);
CREATE INDEX IF NOT EXISTS idx_avis_partner_id ON avis(partner_id);
CREATE INDEX IF NOT EXISTS idx_avis_created_at ON avis(created_at);
CREATE INDEX IF NOT EXISTS idx_avis_type_retour ON avis(type_retour);
CREATE INDEX IF NOT EXISTS idx_avis_approuve ON avis(approuve);

-- =====================================================
-- ÉTAPE 6: VÉRIFICATION FINALE
-- =====================================================
SELECT 'VÉRIFICATION FINALE:' as info;

-- Vérifier l'état final
SELECT 
  COUNT(*) as total_avis,
  COUNT(DISTINCT user_id) as user_ids_uniques,
  COUNT(*) FILTER (WHERE user_id IN (SELECT id FROM auth.users)) as avis_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT id FROM auth.users)) as avis_invalides
FROM avis;

-- Vérifier les index
SELECT 'INDEX CRÉÉS:' as info;
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'avis'
ORDER BY indexname;

-- Afficher quelques exemples d'avis
SELECT 'EXEMPLES D\'AVIS:' as info;
SELECT 
  a.id,
  a.user_id,
  a.note,
  LEFT(a.commentaire, 50) as commentaire_court,
  a.type_retour,
  a.created_at,
  au.email as user_email
FROM avis a
LEFT JOIN auth.users au ON a.user_id = au.id
ORDER BY a.created_at DESC
LIMIT 5;

-- =====================================================
-- ÉTAPE 7: TEST D'INSERTION (optionnel)
-- =====================================================
-- Décommenter pour tester l'insertion (nécessite un utilisateur authentifié)
-- INSERT INTO avis (
--   user_id,
--   partner_id,
--   note,
--   commentaire,
--   type_retour
-- ) VALUES (
--   auth.uid(),
--   NULL,
--   5,
--   'Test après correction - Excellent service !',
--   'positif'
-- );

SELECT '✅ CONFIGURATION TERMINÉE - La table avis est maintenant fonctionnelle (RLS désactivé) !' as info; 