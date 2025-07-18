-- Script pour corriger les politiques de stockage Supabase
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. SUPPRIMER LES ANCIENNES POLITIQUES
-- =====================================================

-- Supprimer toutes les politiques existantes pour storage.objects
DROP POLICY IF EXISTS "Users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile images" ON storage.objects;

-- =====================================================
-- 2. CRÉER DES POLITIQUES PLUS PERMISSIVES
-- =====================================================

-- Politique pour permettre l'upload à tous les utilisateurs authentifiés
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
);

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (
  bucket_id = 'zalama-storage'
);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
);

-- =====================================================
-- 3. VÉRIFIER LE BUCKET
-- =====================================================

-- Vérifier que le bucket existe et est public
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'zalama-storage';

-- =====================================================
-- 4. VÉRIFIER LES POLITIQUES
-- =====================================================

-- Lister toutes les politiques pour storage.objects
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- 5. TEST DE CONFIGURATION
-- =====================================================

-- Vérifier que RLS est activé sur storage.objects
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Afficher un message de succès
SELECT 
  'Configuration terminée' as status,
  'Politiques mises à jour' as action,
  'Testez maintenant l\'upload' as next_step; 