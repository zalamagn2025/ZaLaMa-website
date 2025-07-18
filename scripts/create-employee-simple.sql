-- Script SIMPLE : Créer l'employé manquant
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Vérifier l'utilisateur Auth
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'bea_bintou@yahoo.fr';

-- 2. Vérifier si l'employé existe déjà
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  genre,
  created_at
FROM employees 
WHERE email = 'bea_bintou@yahoo.fr';

-- 3. CRÉER L'EMPLOYÉ (sans ON CONFLICT)
INSERT INTO employees (
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  genre,
  type_contrat,
  date_embauche
) VALUES 
('77a51763-16bc-4b2f-ac3c-3ca8f73945b6', 'Bintou', 'Bea', 'bea_bintou@yahoo.fr', 10000000, 'Développeur', true, 'Femme', 'CDI', '2024-01-15');

-- 4. Vérifier que l'employé a été créé
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  genre,
  created_at
FROM employees 
WHERE email = 'bea_bintou@yahoo.fr';

-- 5. Corriger les politiques RLS
DROP POLICY IF EXISTS "Users can view own employee data" ON employees;
DROP POLICY IF EXISTS "Users can update own employee data" ON employees;
DROP POLICY IF EXISTS "Users can insert own employee data" ON employees;

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own employee data" ON employees
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND actif = true);

CREATE POLICY "Users can update own employee data" ON employees
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own employee data" ON employees
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 6. Test final
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  actif
FROM employees 
WHERE user_id = '77a51763-16bc-4b2f-ac3c-3ca8f73945b6' AND actif = true; 