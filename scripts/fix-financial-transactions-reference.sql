-- Script pour corriger la référence utilisateur_id dans financial_transactions
-- Le problème : utilisateur_id fait référence à users(id) mais nous utilisons auth.users(id)

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

-- 2. Supprimer la contrainte existante
ALTER TABLE financial_transactions 
DROP CONSTRAINT IF EXISTS financial_transactions_utilisateur_id_fkey;

-- 3. Ajouter la nouvelle contrainte vers auth.users
ALTER TABLE financial_transactions 
ADD CONSTRAINT financial_transactions_utilisateur_id_fkey 
FOREIGN KEY (utilisateur_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Vérifier la nouvelle contrainte
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

-- 5. Tester l'insertion avec un user_id valide
-- Remplacez 'votre-user-id-ici' par un vrai user_id de Supabase Auth
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
  'Test après correction de la référence',
  'votre-user-id-ici', -- Remplacez par un vrai user_id
  'En attente',
  NOW(),
  'TEST-REF-CORRECTION'
) ON CONFLICT DO NOTHING;

-- 6. Vérifier les données existantes
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