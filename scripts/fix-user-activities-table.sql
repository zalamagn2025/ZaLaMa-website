-- Script pour vérifier et créer la table user_activities

-- 1. Vérifier si la table existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name = 'user_activities';

-- 2. Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_action ON user_activities(action);

-- 4. Activer RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- 5. Créer les politiques RLS
DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON user_activities;

CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activities" ON user_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 6. Vérifier la structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_activities'
ORDER BY ordinal_position;

-- 7. Tester l'insertion
INSERT INTO user_activities (
  user_id,
  action,
  details,
  ip_address
) VALUES (
  auth.uid(),
  'test_activity',
  '{"test": true}',
  '127.0.0.1'
) ON CONFLICT DO NOTHING;

-- 8. Vérifier l'insertion
SELECT 
  id,
  user_id,
  action,
  details,
  created_at
FROM user_activities 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 5; 