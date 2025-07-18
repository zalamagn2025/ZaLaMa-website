-- SCRIPT DE VÉRIFICATION - Structure employees et relation avec avis
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- VÉRIFICATION DE LA STRUCTURE DE LA TABLE EMPLOYEES
-- =====================================================
SELECT 'STRUCTURE DE LA TABLE EMPLOYEES:' as info;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'employees'
ORDER BY ordinal_position;

-- =====================================================
-- VÉRIFICATION DES EMPLOYEES EXISTANTS
-- =====================================================
SELECT 'EMPLOYEES EXISTANTS:' as info;

SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  partner_id,
  created_at
FROM employees 
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- VÉRIFICATION DE LA RELATION AVIS-EMPLOYEES
-- =====================================================
SELECT 'RELATION AVIS-EMPLOYEES:' as info;

-- Vérifier si les user_id dans avis correspondent à des employees
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE user_id IN (SELECT user_id FROM employees)) as avis_employes_valides,
  COUNT(*) FILTER (WHERE user_id NOT IN (SELECT user_id FROM employees)) as avis_employes_invalides
FROM avis;

-- =====================================================
-- VÉRIFICATION DES AVIS EXISTANTS AVEC DÉTAILS EMPLOYE
-- =====================================================
SELECT 'AVIS EXISTANTS AVEC DÉTAILS EMPLOYE:' as info;

SELECT 
  a.id as avis_id,
  a.user_id,
  a.note,
  LEFT(a.commentaire, 30) as commentaire_court,
  a.created_at as avis_created,
  e.id as employee_id,
  e.email as employee_email,
  e.nom as employee_nom,
  e.prenom as employee_prenom
FROM avis a
LEFT JOIN employees e ON a.user_id = e.user_id
ORDER BY a.created_at DESC
LIMIT 10;

-- =====================================================
-- VÉRIFICATION DE LA CONTRAINTE ACTUELLE
-- =====================================================
SELECT 'CONTRAINTE ACTUELLE SUR AVIS:' as info;

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