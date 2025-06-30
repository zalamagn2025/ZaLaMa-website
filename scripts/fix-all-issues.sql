-- Script complet pour corriger tous les problèmes
-- Exécutez ce script dans l'ordre

-- 1. Vérifier l'utilisateur Auth
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'bea_bintou@yahoo.fr';

-- 2. Créer l'employé s'il n'existe pas
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
('77a51763-16bc-4b2f-ac3c-3ca8f73945b6', 'Bintou', 'Bea', 'bea_bintou@yahoo.fr', 10000000, 'Développeur', true, 'FEMME', 'CDI', '2024-01-15')
ON CONFLICT (user_id) DO UPDATE SET
  salaire_net = 10000000,
  actif = true,
  updated_at = NOW();

-- 3. Vérifier l'employé créé
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  partner_id,
  created_at
FROM employees 
WHERE email = 'bea_bintou@yahoo.fr';

-- 4. Corriger les politiques RLS
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view own employee data" ON employees;
DROP POLICY IF EXISTS "Users can update own employee data" ON employees;
DROP POLICY IF EXISTS "Users can insert own employee data" ON employees;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON employees;

-- Activer RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles politiques
CREATE POLICY "Users can view own employee data" ON employees
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() AND actif = true
  );

CREATE POLICY "Users can update own employee data" ON employees
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own employee data" ON employees
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 5. Vérifier les politiques
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'employees'
ORDER BY policyname;

-- 6. Tester l'accès (à exécuter en tant qu'utilisateur authentifié)
-- Cette requête devrait maintenant fonctionner
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

-- 7. Vérifier les services financiers
SELECT 
  id,
  nom,
  description,
  disponible,
  pourcentage_max
FROM services 
WHERE disponible = true
ORDER BY nom;

-- 8. Vérifier les transactions financières
SELECT 
  id,
  utilisateur_id,
  montant,
  type_transaction,
  statut,
  created_at
FROM financial_transactions 
WHERE utilisateur_id = '77a51763-16bc-4b2f-ac3c-3ca8f73945b6'
ORDER BY created_at DESC
LIMIT 5; 