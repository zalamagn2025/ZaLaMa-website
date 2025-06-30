-- Script pour vérifier et corriger les données des employés
-- Exécutez ce script dans votre dashboard Supabase

-- 1. Vérifier la structure de la table employees
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

-- 2. Vérifier les données existantes
SELECT 
  id,
  user_id,
  nom,
  prenom,
  salaire_net,
  entreprise_id,
  created_at
FROM employees 
LIMIT 10;

-- 3. Vérifier les utilisateurs sans données employé
SELECT 
  u.id as user_id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN employees e ON u.id = e.user_id
WHERE e.id IS NULL;

-- 4. Insérer des données de test si nécessaire
-- Remplacez les valeurs par les vraies données de vos utilisateurs
INSERT INTO employees (
  user_id,
  nom,
  prenom,
  salaire_net,
  entreprise_id,
  poste,
  date_embauche,
  statut
) VALUES 
-- Exemple avec un vrai user_id (remplacez par un vrai ID)
('votre-user-id-ici', 'Dupont', 'Jean', 750000, 'entreprise-id-ici', 'Développeur', '2024-01-15', 'Actif')
ON CONFLICT (user_id) DO NOTHING;

-- 5. Vérifier les transactions financières existantes
SELECT 
  id,
  utilisateur_id,
  montant,
  type,
  statut,
  date_transaction,
  description
FROM financial_transactions 
WHERE type = 'Débloqué' 
ORDER BY date_transaction DESC 
LIMIT 10;

-- 6. Calculer l'avance disponible pour un utilisateur spécifique
-- Remplacez 'user-id-ici' par un vrai user_id
WITH user_data AS (
  SELECT 
    e.salaire_net,
    e.id as employe_id
  FROM employees e
  WHERE e.user_id = 'user-id-ici'
),
monthly_advances AS (
  SELECT 
    COALESCE(SUM(montant), 0) as total_avances
  FROM financial_transactions ft
  WHERE ft.utilisateur_id = 'user-id-ici'
    AND ft.type = 'Débloqué'
    AND ft.statut = 'Validé'
    AND DATE_TRUNC('month', ft.date_transaction) = DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
  ud.salaire_net,
  ud.employe_id,
  ma.total_avances,
  FLOOR(ud.salaire_net * 0.25) as max_avance_mensuelle,
  GREATEST(0, FLOOR(ud.salaire_net * 0.25) - ma.total_avances) as avance_disponible
FROM user_data ud
CROSS JOIN monthly_advances ma; 