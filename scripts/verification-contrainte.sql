-- SCRIPT DE VÉRIFICATION - État actuel de la contrainte avis
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- VÉRIFICATION DE LA CONTRAINTE ACTUELLE
-- =====================================================
SELECT 'VÉRIFICATION DE LA CONTRAINTE ACTUELLE:' as info;

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
-- VÉRIFICATION DES TABLES
-- =====================================================
SELECT 'TABLES DISPONIBLES:' as info;

SELECT 
  schemaname,
  tablename
FROM pg_tables 
WHERE tablename IN ('users', 'avis')
ORDER BY schemaname, tablename;

-- =====================================================
-- VÉRIFICATION DES USER_ID DANS AUTH.USERS
-- =====================================================
SELECT 'USER_ID DANS AUTH.USERS:' as info;

SELECT 
  id,
  email,
  created_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- VÉRIFICATION DES USER_ID DANS USERS
-- =====================================================
SELECT 'USER_ID DANS USERS:' as info;

SELECT 
  id,
  email,
  created_at
FROM users 
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- VÉRIFICATION DES AVIS EXISTANTS
-- =====================================================
SELECT 'AVIS EXISTANTS:' as info;

SELECT 
  id,
  user_id,
  note,
  LEFT(commentaire, 30) as commentaire_court,
  created_at
FROM avis 
ORDER BY created_at DESC
LIMIT 5; 