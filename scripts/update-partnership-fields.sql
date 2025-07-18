-- Script de mise à jour pour les nouveaux champs partnership_requests
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Ajouter le champ motivation_letter_text
ALTER TABLE public.partnership_requests 
ADD COLUMN motivation_letter_text TEXT;

-- 2. Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.partnership_requests.motivation_letter_text IS 'Texte de la lettre de motivation rédigée directement par l''utilisateur';

-- 3. Ajouter une contrainte pour s'assurer qu'au moins une lettre de motivation est fournie
ALTER TABLE public.partnership_requests 
ADD CONSTRAINT check_motivation_letter 
CHECK (
  (motivation_letter_url IS NOT NULL AND motivation_letter_url != '') OR 
  (motivation_letter_text IS NOT NULL AND motivation_letter_text != '')
);

-- 4. Créer un index pour optimiser les requêtes sur le nouveau champ
CREATE INDEX IF NOT EXISTS idx_partnership_requests_motivation_text 
ON public.partnership_requests(motivation_letter_text) 
WHERE motivation_letter_text IS NOT NULL;

-- 5. Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'partnership_requests' 
AND column_name IN ('motivation_letter_url', 'motivation_letter_text');

-- 6. Vérifier la contrainte
SELECT constraint_name, check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'check_motivation_letter'; 