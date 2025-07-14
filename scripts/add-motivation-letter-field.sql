-- Ajout du champ motivation_letter_url à la table partnership_requests
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Ajouter la colonne motivation_letter_url
ALTER TABLE public.partnership_requests 
ADD COLUMN motivation_letter_url TEXT;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.partnership_requests.motivation_letter_url IS 'URL du fichier de lettre de motivation uploadé dans Supabase Storage';

-- Créer un index pour optimiser les requêtes sur ce champ
CREATE INDEX IF NOT EXISTS idx_partnership_requests_motivation_letter 
ON public.partnership_requests(motivation_letter_url) 
WHERE motivation_letter_url IS NOT NULL;

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'partnership_requests' 
AND column_name = 'motivation_letter_url'; 