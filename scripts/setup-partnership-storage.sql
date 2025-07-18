-- Script de configuration du bucket de stockage pour les lettres de motivation
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer le bucket pour les fichiers de partenariat (si pas déjà fait)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partnership-files',
  'partnership-files',
  true,
  5242880, -- 5MB en bytes
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Politique RLS pour permettre l'insertion de fichiers (sans authentification)
CREATE POLICY "Allow public uploads to partnership-files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'partnership-files' AND
  (storage.foldername(name))[1] = 'partnership-letters'
);

-- 3. Politique RLS pour permettre la lecture des fichiers (sans authentification)
CREATE POLICY "Allow public reads from partnership-files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'partnership-files'
);

-- 4. Politique RLS pour permettre la suppression des fichiers (sans authentification)
CREATE POLICY "Allow public deletes from partnership-files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'partnership-files'
);

-- 5. Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'partnership-files';

-- 6. Vérifier les politiques RLS
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
AND schemaname = 'storage'; 