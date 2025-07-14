-- Script pour réactiver RLS avec les bonnes politiques
-- Exécuter APRÈS avoir testé que l'upload fonctionne
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. SUPPRIMER LES ANCIENNES POLITIQUES
-- =====================================================

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;

-- =====================================================
-- 2. CRÉER LES BONNES POLITIQUES
-- =====================================================

-- Politique pour l'upload (utilisateurs authentifiés)
CREATE POLICY "Enable insert for authenticated users only" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
);

-- Politique pour la lecture (publique)
CREATE POLICY "Enable read access for all users" ON storage.objects
FOR SELECT USING (
  bucket_id = 'zalama-storage'
);

-- Politique pour la suppression (utilisateurs authentifiés)
CREATE POLICY "Enable delete for authenticated users only" ON storage.objects
FOR DELETE USING (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
);

-- Politique pour la mise à jour (utilisateurs authentifiés)
CREATE POLICY "Enable update for authenticated users only" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
);

-- =====================================================
-- 3. RÉACTIVER RLS
-- =====================================================

-- Réactiver RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. VÉRIFIER LA CONFIGURATION
-- =====================================================

-- Vérifier que RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Lister les politiques
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- 5. MESSAGE DE CONFIRMATION
-- =====================================================

SELECT 
  'RLS réactivé avec les bonnes politiques' as status,
  'Sécurité restaurée' as action,
  'Testez à nouveau l\'upload' as next_step; 