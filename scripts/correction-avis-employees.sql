-- SCRIPT DE CORRECTION - Avis liés aux employees
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- ÉTAPE 1: SUPPRESSION DE L'ANCIENNE CONTRAINTE
-- =====================================================
SELECT 'SUPPRESSION DE L\'ANCIENNE CONTRAINTE...' as info;

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
-- ÉTAPE 3: CRÉATION DE LA NOUVELLE CONTRAINTE VERS EMPLOYEES
-- =====================================================
SELECT 'CRÉATION DE LA NOUVELLE CONTRAINTE VERS EMPLOYEES...' as info;

ALTER TABLE avis 
ADD CONSTRAINT avis_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES employees(user_id) ON DELETE CASCADE;

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

-- Vérifier que les user_id dans avis existent dans employees
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT user_id FROM employees)) as avis_employes_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT user_id FROM employees)) as avis_employes_invalides
FROM avis;

-- =====================================================
-- ÉTAPE 6: CORRECTION DES USER_ID SI NÉCESSAIRE
-- =====================================================
SELECT 'CORRECTION DES USER_ID SI NÉCESSAIRE...' as info;

-- Mettre à jour les user_id qui pointent vers users au lieu de employees
UPDATE avis 
SET user_id = e.user_id
FROM users u
JOIN employees e ON u.email = e.email
WHERE avis.user_id = u.id;

-- Vérification finale
SELECT 'RÉSULTAT FINAL:' as info;
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT user_id FROM employees)) as avis_employes_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT user_id FROM employees)) as avis_employes_invalides
FROM avis;

-- =====================================================
-- ÉTAPE 7: AFFICHAGE DES AVIS AVEC DÉTAILS EMPLOYE
-- =====================================================
SELECT 'AVIS AVEC DÉTAILS EMPLOYE:' as info;

SELECT 
  a.id as avis_id,
  a.user_id,
  a.note,
  LEFT(a.commentaire, 50) as commentaire_court,
  a.type_retour,
  a.created_at as avis_created,
  e.email as employee_email,
  e.nom as employee_nom,
  e.prenom as employee_prenom
FROM avis a
LEFT JOIN employees e ON a.user_id = e.user_id
ORDER BY a.created_at DESC
LIMIT 5;

SELECT '✅ CORRECTION TERMINÉE ! Les avis sont maintenant liés aux employees.' as info; 