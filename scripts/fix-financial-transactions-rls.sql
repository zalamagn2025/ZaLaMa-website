-- Script pour vérifier et corriger les politiques RLS de financial_transactions

-- 1. Vérifier les politiques existantes
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'financial_transactions';

-- 2. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view their own transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Admins can manage financial transactions" ON financial_transactions;

-- 3. Créer les nouvelles politiques RLS
-- Politique pour permettre aux utilisateurs de voir leurs propres transactions
CREATE POLICY "Users can view their own transactions" ON financial_transactions
  FOR SELECT
  TO authenticated
  USING (utilisateur_id = auth.uid());

-- Politique pour permettre aux utilisateurs d'insérer leurs propres transactions
CREATE POLICY "Users can insert their own transactions" ON financial_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (utilisateur_id = auth.uid());

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres transactions
CREATE POLICY "Users can update their own transactions" ON financial_transactions
  FOR UPDATE
  TO authenticated
  USING (utilisateur_id = auth.uid())
  WITH CHECK (utilisateur_id = auth.uid());

-- Politique pour les administrateurs (optionnel)
CREATE POLICY "Admins can manage all transactions" ON financial_transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND e.role = 'admin'
    )
  );

-- 4. Vérifier que RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'financial_transactions';

-- 5. Activer RLS si ce n'est pas déjà fait
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- 6. Vérifier les nouvelles politiques
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'financial_transactions'
ORDER BY policyname;

-- 7. Tester les permissions
-- Vérifier que l'utilisateur authentifié peut insérer
SELECT has_table_privilege('authenticated', 'financial_transactions', 'INSERT');
SELECT has_table_privilege('authenticated', 'financial_transactions', 'SELECT');

-- 8. Test d'insertion (remplacez 'votre-user-id' par un vrai user_id)
-- Cette requête devrait fonctionner si les politiques sont correctes
INSERT INTO financial_transactions (
  montant,
  type,
  description,
  utilisateur_id,
  statut,
  date_transaction,
  reference
) VALUES (
  50000,
  'Débloqué',
  'Test RLS après correction',
  'votre-user-id-ici', -- Remplacez par un vrai user_id
  'En attente',
  NOW(),
  'TEST-RLS-CORRECTION'
) ON CONFLICT DO NOTHING; 