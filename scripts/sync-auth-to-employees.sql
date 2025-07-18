-- Script pour synchroniser les utilisateurs Auth avec la table employees
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure de la table employees
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'employees'
ORDER BY ordinal_position;

-- 2. Voir les utilisateurs dans Auth
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email IS NOT NULL
ORDER BY created_at DESC;

-- 3. Voir les employés existants dans la table employees
SELECT 
  id,
  partner_id,
  nom,
  prenom,
  email,
  poste,
  actif,
  created_at
FROM employees
ORDER BY created_at DESC;

-- 4. Ajouter une colonne user_id à la table employees si elle n'existe pas
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. Créer un index sur user_id si il n'existe pas
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);

-- 6. Synchroniser les utilisateurs Auth vers employees
-- Pour chaque utilisateur Auth qui n'est pas dans la table users, créer un employé
INSERT INTO employees (
  user_id,
  partner_id,
  nom,
  prenom,
  email,
  poste,
  genre,
  type_contrat,
  actif
)
SELECT 
  au.id as user_id,
  NULL as partner_id, -- À remplir manuellement si nécessaire
  COALESCE(au.raw_user_meta_data->>'nom', 'Nom') as nom,
  COALESCE(au.raw_user_meta_data->>'prenom', 'Prénom') as prenom,
  au.email,
  COALESCE(au.raw_user_meta_data->>'poste', 'Employé') as poste,
  COALESCE(au.raw_user_meta_data->>'genre', 'Homme')::employee_gender as genre,
  COALESCE(au.raw_user_meta_data->>'type_contrat', 'CDI')::employee_contract_type as type_contrat,
  true as actif
FROM auth.users au
WHERE au.email IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM employees e WHERE e.email = au.email
  )
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.email = au.email
  )
ON CONFLICT (email) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  poste = EXCLUDED.poste,
  genre = EXCLUDED.genre,
  type_contrat = EXCLUDED.type_contrat,
  updated_at = NOW();

-- 7. Mettre à jour les user_id pour les employés existants qui n'en ont pas
UPDATE employees 
SET user_id = au.id
FROM auth.users au
WHERE employees.email = au.email 
  AND employees.user_id IS NULL;

-- 8. Vérifier le résultat
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif,
  e.created_at,
  CASE 
    WHEN e.user_id IS NOT NULL THEN '✅ Synchronisé'
    ELSE '❌ Pas de user_id'
  END as statut_sync
FROM employees e
ORDER BY e.created_at DESC;

-- 9. Fonction pour synchroniser automatiquement les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION sync_auth_to_employees()
RETURNS TRIGGER AS $$
BEGIN
  -- Si c'est un nouvel utilisateur dans Auth
  IF TG_OP = 'INSERT' THEN
    -- Vérifier si c'est un employé (pas dans la table users)
    IF NOT EXISTS (
      SELECT 1 FROM users WHERE email = NEW.email
    ) THEN
      
      -- Insérer dans la table employees
      INSERT INTO employees (
        user_id,
        partner_id,
        nom,
        prenom,
        email,
        poste,
        genre,
        type_contrat,
        actif
      ) VALUES (
        NEW.id,
        NULL,
        COALESCE(NEW.raw_user_meta_data->>'nom', 'Nom'),
        COALESCE(NEW.raw_user_meta_data->>'prenom', 'Prénom'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'poste', 'Employé'),
        COALESCE(NEW.raw_user_meta_data->>'genre', 'Homme')::employee_gender,
        COALESCE(NEW.raw_user_meta_data->>'type_contrat', 'CDI')::employee_contract_type,
        true
      )
      ON CONFLICT (email) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        nom = EXCLUDED.nom,
        prenom = EXCLUDED.prenom,
        poste = EXCLUDED.poste,
        genre = EXCLUDED.genre,
        type_contrat = EXCLUDED.type_contrat,
        updated_at = NOW();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Trigger pour synchroniser automatiquement
DROP TRIGGER IF EXISTS trigger_sync_auth_to_employees ON auth.users;
CREATE TRIGGER trigger_sync_auth_to_employees
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_to_employees(); 