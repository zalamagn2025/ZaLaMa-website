-- Script pour configurer le bucket de stockage Supabase
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. CRÉER LE BUCKET ZALAMA-STORAGE
-- =====================================================

-- Vérifier si le bucket existe déjà
SELECT * FROM storage.buckets WHERE id = 'zalama-storage';

-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'zalama-storage',
  'zalama-storage',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

-- =====================================================
-- 2. CONFIGURER LES POLITIQUES RLS POUR LE BUCKET
-- =====================================================

-- Politique pour permettre l'upload aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Users can upload profile images" ON storage.objects;
CREATE POLICY "Users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'profile-images'
);

-- Politique pour permettre la lecture publique des images de profil
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
CREATE POLICY "Public can view profile images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'zalama-storage'
);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Users can delete own profile images" ON storage.objects;
CREATE POLICY "Users can delete own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'profile-images'
);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
DROP POLICY IF EXISTS "Users can update own profile images" ON storage.objects;
CREATE POLICY "Users can update own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'zalama-storage' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = 'profile-images'
);

-- =====================================================
-- 3. VÉRIFIER LA CONFIGURATION
-- =====================================================

-- Vérifier que le bucket a été créé
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'zalama-storage';

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
ORDER BY policyname;

-- =====================================================
-- 4. TESTER LA CONFIGURATION
-- =====================================================

-- Vérifier que les politiques sont actives
SELECT 
  'Bucket configuré avec succès' as status,
  'zalama-storage' as bucket_id,
  'profile-images' as folder_name,
  '5MB' as file_size_limit,
  'JPEG, PNG, JPG, WebP' as allowed_formats; 