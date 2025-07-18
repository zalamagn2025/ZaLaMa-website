-- Script pour corriger les politiques RLS de la table employees

-- 1. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view own employee data" ON employees;
DROP POLICY IF EXISTS "Users can update own employee data" ON employees;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON employees;

-- 2. Activer RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- 3. Créer la politique de lecture pour les utilisateurs authentifiés
CREATE POLICY "Users can view own employee data" ON employees
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() AND actif = true
  );

-- 4. Créer la politique de mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Users can update own employee data" ON employees
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 5. Créer la politique d'insertion pour les nouveaux utilisateurs
CREATE POLICY "Users can insert own employee data" ON employees
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 6. Vérifier les politiques créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'employees'
ORDER BY policyname;

-- 7. Tester l'accès avec l'utilisateur actuel
-- Cette requête devrait fonctionner si les politiques sont correctes
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  actif
FROM employees 
WHERE user_id = auth.uid() AND actif = true; 