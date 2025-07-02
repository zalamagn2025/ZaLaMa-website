-- Script pour créer la table avis avec la bonne structure
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Créer la table avis si elle n'existe pas
CREATE TABLE IF NOT EXISTS avis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT NOT NULL,
  type_retour VARCHAR(20) NOT NULL CHECK (type_retour IN ('positif', 'negatif')),
  date_avis TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approuve BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_avis_user_id ON avis(user_id);
CREATE INDEX IF NOT EXISTS idx_avis_partner_id ON avis(partner_id);
CREATE INDEX IF NOT EXISTS idx_avis_created_at ON avis(created_at);
CREATE INDEX IF NOT EXISTS idx_avis_type_retour ON avis(type_retour);
CREATE INDEX IF NOT EXISTS idx_avis_approuve ON avis(approuve);

-- 3. Activer RLS
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques RLS
DROP POLICY IF EXISTS "Users can view own avis" ON avis;
DROP POLICY IF EXISTS "Users can insert own avis" ON avis;
DROP POLICY IF EXISTS "Users can update own avis" ON avis;
DROP POLICY IF EXISTS "Partners can view their avis" ON avis;

-- Politique pour que les utilisateurs puissent voir leurs propres avis
CREATE POLICY "Users can view own avis" ON avis
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Politique pour que les utilisateurs puissent créer leurs propres avis
CREATE POLICY "Users can insert own avis" ON avis
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Politique pour que les utilisateurs puissent modifier leurs propres avis
CREATE POLICY "Users can update own avis" ON avis
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Politique pour que les partenaires puissent voir les avis de leurs employés
CREATE POLICY "Partners can view their avis" ON avis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM employees e
      WHERE e.user_id = auth.uid()
      AND e.partner_id = avis.partner_id
    )
  );

-- 5. Créer une fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_avis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS trigger_update_avis_updated_at ON avis;
CREATE TRIGGER trigger_update_avis_updated_at
  BEFORE UPDATE ON avis
  FOR EACH ROW
  EXECUTE FUNCTION update_avis_updated_at();

-- 7. Vérifier la structure de la table
SELECT 
  'Table avis structure:' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'avis'
ORDER BY ordinal_position;

-- 8. Vérifier les contraintes
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

-- 9. Vérifier les index
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'avis'
ORDER BY indexname;

-- 10. Vérifier les politiques RLS
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
WHERE tablename = 'avis'
ORDER BY policyname;

-- 11. Test d'insertion (à exécuter avec un utilisateur authentifié)
-- INSERT INTO avis (
--   user_id,
--   partner_id,
--   note,
--   commentaire,
--   type_retour
-- ) VALUES (
--   auth.uid(),
--   'partner-uuid-here',
--   5,
--   'Excellent service !',
--   'positif'
-- );

-- 12. Vérifier les données existantes
SELECT 
  COUNT(*) as total_avis,
  COUNT(*) FILTER (WHERE type_retour = 'positif') as avis_positifs,
  COUNT(*) FILTER (WHERE type_retour = 'negatif') as avis_negatifs,
  COUNT(*) FILTER (WHERE approuve = true) as avis_approuves,
  AVG(note) as note_moyenne
FROM avis; 