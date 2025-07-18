-- Script de configuration du bucket de stockage pour les lettres de motivation
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Créer le bucket pour les fichiers de motivation (si pas déjà fait)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'motivation-letters',
  'motivation-letters',
  false, -- Bucket privé pour la sécurité
  10485760, -- Limite de 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Politique RLS pour permettre l'upload à tous les utilisateurs (public)
CREATE POLICY "Allow public uploads for motivation letters" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'motivation-letters'
);

-- 3. Politique RLS pour permettre la lecture aux admins uniquement
CREATE POLICY "Allow admins to read motivation letters" ON storage.objects
FOR SELECT USING (
  bucket_id = 'motivation-letters' 
  AND (
    auth.jwt() ->> 'email' IN ('admin@zalamagn.com', 'contact@zalamagn.com')
    OR auth.role() = 'service_role'
  )
);

-- 4. Politique RLS pour permettre la suppression aux admins uniquement
CREATE POLICY "Allow admins to delete motivation letters" ON storage.objects
FOR DELETE USING (
  bucket_id = 'motivation-letters' 
  AND (
    auth.jwt() ->> 'email' IN ('admin@zalamagn.com', 'contact@zalamagn.com')
    OR auth.role() = 'service_role'
  )
);

-- 5. Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'motivation-letters';

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