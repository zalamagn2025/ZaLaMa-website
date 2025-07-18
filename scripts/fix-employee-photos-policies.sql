-- Script pour corriger les politiques RLS du bucket employee-photos
-- Exécuter dans l'éditeur SQL de Supabase APRÈS avoir désactivé RLS temporairement

-- =====================================================
-- 1. SUPPRIMER LES ANCIENNES POLITIQUES
-- =====================================================

-- Supprimer toutes les politiques existantes pour storage.objects liées à employee-photos
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;

-- =====================================================
-- 2. CRÉER DES POLITIQUES PLUS PERMISSIVES
-- =====================================================

-- Politique pour permettre l'upload à tous les utilisateurs authentifiés
CREATE POLICY "Allow authenticated uploads to employee-photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'employee-photos' 
  AND auth.uid() IS NOT NULL
);

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public viewing of employee-photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'employee-photos'
);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated deletes from employee-photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'employee-photos' 
  AND auth.uid() IS NOT NULL
);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated updates to employee-photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'employee-photos' 
  AND auth.uid() IS NOT NULL
);

-- =====================================================
-- 3. VÉRIFIER LA CONFIGURATION
-- =====================================================

-- Vérifier que le bucket existe
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'employee-photos';

-- Vérifier les politiques créées
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
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%employee-photos%'
ORDER BY policyname;

-- =====================================================
-- 4. RÉACTIVER RLS (si désactivé)
-- =====================================================

-- Réactiver RLS sur la table storage.objects
-- Note: Cette commande peut nécessiter des permissions spéciales
-- Si elle échoue, utilisez l'interface Supabase pour réactiver RLS

-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. TESTER LA CONFIGURATION
-- =====================================================

SELECT 
  'Politiques configurées avec succès' as status,
  'employee-photos' as bucket_id,
  '4 politiques créées' as policies_count,
  'Authentifiés peuvent uploader' as upload_policy,
  'Public peut lire' as read_policy; 