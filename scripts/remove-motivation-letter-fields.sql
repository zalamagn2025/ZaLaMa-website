-- Script pour supprimer les champs de lettre de motivation
-- de la table partnership_requests

-- 1. Supprimer la contrainte de validation
ALTER TABLE public.partnership_requests 
DROP CONSTRAINT IF EXISTS check_motivation_letter;

-- 2. Supprimer les index sur les colonnes de lettre de motivation
DROP INDEX IF EXISTS idx_partnership_requests_motivation_letter;
DROP INDEX IF EXISTS idx_partnership_requests_motivation_letter_text;

-- 3. Supprimer les colonnes
ALTER TABLE public.partnership_requests 
DROP COLUMN IF EXISTS motivation_letter_url;

ALTER TABLE public.partnership_requests 
DROP COLUMN IF EXISTS motivation_letter_text;

-- 4. Vérifier que les colonnes ont été supprimées
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'partnership_requests' 
AND table_schema = 'public'
ORDER BY ordinal_position; 