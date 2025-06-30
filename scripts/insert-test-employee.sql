-- Script pour insérer des données de test d'employé
-- Remplacez 'votre-user-id-ici' par votre vrai user_id de Supabase Auth

-- 1. Vérifier votre user_id actuel
-- Allez dans votre dashboard Supabase > Authentication > Users
-- Copiez votre user_id et remplacez-le ci-dessous

-- 2. Insérer des données d'employé de test
INSERT INTO employees (
  user_id,
  partner_id,
  nom,
  prenom,
  genre,
  email,
  telephone,
  adresse,
  poste,
  role,
  type_contrat,
  salaire_net,
  date_embauche,
  actif
) VALUES 
-- Remplacez 'votre-user-id-ici' par votre vrai user_id
('votre-user-id-ici', 'partner-test-uuid', 'Dupont', 'Jean', 'HOMME', 'jean.dupont@example.com', '+224 123 456 789', 'Conakry, Guinée', 'Développeur', 'Développeur Full Stack', 'CDI', 750000, '2024-01-15', true)
ON CONFLICT (user_id) DO UPDATE SET
  salaire_net = EXCLUDED.salaire_net,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  poste = EXCLUDED.poste,
  actif = EXCLUDED.actif;

-- 3. Vérifier que l'insertion a fonctionné
SELECT 
  id,
  user_id,
  nom,
  prenom,
  salaire_net,
  partner_id,
  poste,
  actif,
  created_at
FROM employees 
WHERE user_id = 'votre-user-id-ici';

-- 4. Calculer l'avance disponible pour ce mois
WITH user_data AS (
  SELECT 
    e.salaire_net,
    e.id as employe_id
  FROM employees e
  WHERE e.user_id = 'votre-user-id-ici'
),
working_days AS (
  SELECT 
    -- Calculer les jours ouvrables écoulés ce mois
    (SELECT COUNT(*) 
     FROM generate_series(1, EXTRACT(DAY FROM CURRENT_DATE)::int) AS day
     WHERE EXTRACT(DOW FROM DATE_TRUNC('month', CURRENT_DATE) + (day - 1) * INTERVAL '1 day') NOT IN (0, 6)
    ) as working_days_elapsed,
    -- Calculer le total des jours ouvrables du mois
    (SELECT COUNT(*) 
     FROM generate_series(1, EXTRACT(DAY FROM DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day')::int) AS day
     WHERE EXTRACT(DOW FROM DATE_TRUNC('month', CURRENT_DATE) + (day - 1) * INTERVAL '1 day') NOT IN (0, 6)
    ) as total_working_days
)
SELECT 
  ud.salaire_net,
  ud.employe_id,
  wd.working_days_elapsed,
  wd.total_working_days,
  ROUND((wd.working_days_elapsed::float / wd.total_working_days) * 100, 2) as percentage_elapsed,
  FLOOR(ud.salaire_net * (wd.working_days_elapsed::float / wd.total_working_days)) as avance_disponible
FROM user_data ud
CROSS JOIN working_days wd; 