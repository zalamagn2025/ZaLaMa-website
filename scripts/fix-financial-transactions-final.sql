-- Script final pour corriger le problème de financial_transactions
-- Le problème : utilisateur_id fait référence à employees(id) mais nous utilisons auth.users(id)

-- 1. Vérifier la contrainte actuelle
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
  AND tc.table_name = 'financial_transactions'
  AND kcu.column_name = 'utilisateur_id';

-- 2. Vérifier les données existantes dans employees
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net
FROM employees 
LIMIT 5;

-- 3. Vérifier les transactions existantes
SELECT 
  id,
  utilisateur_id,
  montant,
  type,
  statut,
  date_transaction
FROM financial_transactions 
ORDER BY date_transaction DESC 
LIMIT 5;

-- 4. Supprimer la contrainte existante
ALTER TABLE financial_transactions 
DROP CONSTRAINT IF EXISTS financial_transactions_utilisateur_id_fkey;

-- 5. Ajouter la nouvelle contrainte vers employees
ALTER TABLE financial_transactions 
ADD CONSTRAINT financial_transactions_utilisateur_id_fkey 
FOREIGN KEY (utilisateur_id) REFERENCES employees(id) ON DELETE CASCADE;

-- 6. Vérifier la nouvelle contrainte
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
  AND tc.table_name = 'financial_transactions'
  AND kcu.column_name = 'utilisateur_id';

-- 7. Corriger les politiques RLS
DROP POLICY IF EXISTS "Users can view their own transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON financial_transactions;

-- Politique pour permettre aux utilisateurs de voir leurs propres transactions
CREATE POLICY "Users can view their own transactions" ON financial_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = financial_transactions.utilisateur_id
      AND e.user_id = auth.uid()
    )
  );

-- Politique pour permettre aux utilisateurs d'insérer leurs propres transactions
CREATE POLICY "Users can insert their own transactions" ON financial_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = financial_transactions.utilisateur_id
      AND e.user_id = auth.uid()
    )
  );

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres transactions
CREATE POLICY "Users can update their own transactions" ON financial_transactions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = financial_transactions.utilisateur_id
      AND e.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = financial_transactions.utilisateur_id
      AND e.user_id = auth.uid()
    )
  );

-- 8. Vérifier les nouvelles politiques
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

-- 9. Tester l'insertion avec un employee_id valide
-- Remplacez 'votre-employee-id-ici' par un vrai employee_id
INSERT INTO financial_transactions (
  montant,
  type,
  description,
  utilisateur_id,
  statut,
  date_transaction,
  reference
) VALUES (
  100000,
  'Débloqué',
  'Test après correction finale',
  'votre-employee-id-ici', -- Remplacez par un vrai employee_id
  'En attente',
  NOW(),
  'TEST-FINAL-CORRECTION'
) ON CONFLICT DO NOTHING;

-- 10. Vérifier les données finales
SELECT 
  id,
  montant,
  type,
  description,
  utilisateur_id,
  statut,
  date_transaction
FROM financial_transactions 
ORDER BY date_transaction DESC 
LIMIT 5; 