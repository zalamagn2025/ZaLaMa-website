-- Script pour corriger la contrainte de clé étrangère de la table avis
-- Le problème : user_id fait référence à users(id) mais nous utilisons auth.users(id)

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
  AND tc.table_name = 'avis'
  AND kcu.column_name = 'user_id';

-- 2. Supprimer la contrainte existante
ALTER TABLE avis 
DROP CONSTRAINT IF EXISTS avis_user_id_fkey;

-- 3. Ajouter la nouvelle contrainte vers auth.users
ALTER TABLE avis 
ADD CONSTRAINT avis_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

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
  AND tc.table_name = 'avis'
  AND kcu.column_name = 'user_id';

-- 5. Vérifier que la table avis existe et a la bonne structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'avis'
ORDER BY ordinal_position;

-- 6. Activer RLS sur la table avis si ce n'est pas déjà fait
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

-- 7. Créer les politiques RLS pour la table avis
DROP POLICY IF EXISTS "Users can view own avis" ON avis;
DROP POLICY IF EXISTS "Users can insert own avis" ON avis;
DROP POLICY IF EXISTS "Users can update own avis" ON avis;

CREATE POLICY "Users can view own avis" ON avis
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own avis" ON avis
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own avis" ON avis
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 8. Créer un index sur user_id pour les performances
CREATE INDEX IF NOT EXISTS idx_avis_user_id ON avis(user_id);
CREATE INDEX IF NOT EXISTS idx_avis_partner_id ON avis(partner_id);
CREATE INDEX IF NOT EXISTS idx_avis_created_at ON avis(created_at);

-- 9. Vérifier les politiques RLS créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'avis';

-- 10. Test de la structure finale
SELECT 
  'Table avis structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'avis'
ORDER BY ordinal_position;

-- 11. Vérifier les contraintes finales
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'avis'
ORDER BY tc.constraint_type, kcu.column_name; 