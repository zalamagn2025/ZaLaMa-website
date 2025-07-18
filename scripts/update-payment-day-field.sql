-- Script de mise à jour pour simplifier le champ jour de paiement
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Ajouter le nouveau champ payment_day
ALTER TABLE public.partnership_requests 
ADD COLUMN payment_day INTEGER;

-- 2. Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.partnership_requests.payment_day IS 'Jour du mois pour le paiement récurrent (1-31)';

-- 3. Ajouter une contrainte pour s'assurer que la valeur est entre 1 et 31
ALTER TABLE public.partnership_requests 
ADD CONSTRAINT check_payment_day 
CHECK (payment_day >= 1 AND payment_day <= 31);

-- 4. Créer un index pour optimiser les requêtes sur ce champ
CREATE INDEX IF NOT EXISTS idx_partnership_requests_payment_day 
ON public.partnership_requests(payment_day);

-- 5. Migrer les données existantes si nécessaire (optionnel)
-- Si vous avez des données existantes dans payment_date au format "mois/jour"
-- vous pouvez les migrer avec cette requête :
/*
UPDATE public.partnership_requests 
SET payment_day = CAST(SPLIT_PART(payment_date, '/', 2) AS INTEGER)
WHERE payment_date LIKE '%/%' 
AND payment_day IS NULL;
*/

-- 6. Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'partnership_requests' 
AND column_name = 'payment_day';

-- 7. Vérifier la contrainte
SELECT constraint_name, check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'check_payment_day';

-- 8. Afficher les données existantes (pour vérification)
SELECT id, company_name, payment_date, payment_day 
FROM public.partnership_requests 
LIMIT 10; 