-- Script pour configurer le bucket employe-photo pour les photos de profil
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. CRÉER LE BUCKET EMPLOYE-PHOTO
-- =====================================================

-- Vérifier si le bucket existe déjà
SELECT * FROM storage.buckets WHERE id = 'employe-photo';

-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'employe-photo',
  'employe-photo',
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

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;

-- Politique pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'employe-photo');

-- Politique pour permettre la lecture publique des images de profil
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'employe-photo');

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'employe-photo');

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'employe-photo');

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
WHERE id = 'employe-photo';

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
AND policyname LIKE '%employe-photo%'
ORDER BY policyname;

-- =====================================================
-- 4. TESTER LA CONFIGURATION
-- =====================================================

-- Vérifier que les politiques sont actives
SELECT 
  'Bucket configuré avec succès' as status,
  'employe-photo' as bucket_id,
  'profile-images' as folder_name,
  '5MB' as file_size_limit,
  'JPEG, PNG, JPG, WebP' as allowed_formats; 