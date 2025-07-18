-- Script pour temporairement désactiver RLS sur storage.objects
-- ATTENTION : Cette solution désactive la sécurité, à utiliser seulement pour tester
-- Exécuter dans l'éditeur SQL de Supabase

-- =====================================================
-- 1. DÉSACTIVER RLS TEMPORAIREMENT
-- =====================================================

-- Désactiver RLS sur storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. VÉRIFIER LA CONFIGURATION
-- =====================================================

-- Vérifier que RLS est désactivé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Vérifier le bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'zalama-storage';

-- =====================================================
-- 3. MESSAGE DE CONFIRMATION
-- =====================================================

SELECT 
  'RLS désactivé temporairement' as status,
  'Vous pouvez maintenant tester l\'upload' as action,
  '⚠️ N\'oubliez pas de réactiver RLS plus tard' as warning; 