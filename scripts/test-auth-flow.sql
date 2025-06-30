-- Script pour tester le flux d'authentification
-- Exécutez ce script après avoir créé un employé

-- 1. Vérifier que l'employé existe et est actif
SELECT 
  id,
  user_id,
  nom,
  prenom,
  email,
  salaire_net,
  poste,
  actif,
  created_at
FROM employees 
WHERE actif = true
ORDER BY created_at DESC
LIMIT 5;

-- 2. Vérifier les utilisateurs Auth correspondants
SELECT 
  u.id as auth_user_id,
  u.email,
  u.created_at,
  e.id as employee_id,
  e.nom,
  e.prenom,
  e.salaire_net,
  e.actif
FROM auth.users u
LEFT JOIN employees e ON u.id = e.user_id
WHERE e.actif = true
ORDER BY u.created_at DESC
LIMIT 5;

-- 3. Calculer l'avance disponible pour un employé spécifique
-- Remplacez 'user-id-ici' par un vrai user_id
WITH employee_data AS (
  SELECT 
    e.salaire_net,
    e.id as employe_id,
    e.user_id
  FROM employees e
  WHERE e.user_id = 'user-id-ici' AND e.actif = true
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
  ed.user_id,
  ed.employe_id,
  ed.salaire_net,
  wd.working_days_elapsed,
  wd.total_working_days,
  ROUND((wd.working_days_elapsed::float / wd.total_working_days) * 100, 2) as percentage_elapsed,
  FLOOR(ed.salaire_net * (wd.working_days_elapsed::float / wd.total_working_days)) as avance_disponible
FROM employee_data ed
CROSS JOIN working_days wd; 