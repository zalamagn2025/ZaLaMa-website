-- Script pour corriger la table employees et ajouter les contraintes nécessaires
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure actuelle de la table employees
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'employees'
ORDER BY ordinal_position;

-- 2. Vérifier les contraintes existantes
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'employees' 
  AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, kcu.column_name;

-- 3. Ajouter une colonne user_id si elle n'existe pas
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Créer un index sur user_id
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);

-- 5. Ajouter une contrainte unique sur email si elle n'existe pas
-- D'abord, supprimer les doublons potentiels
DELETE FROM employees a USING employees b
WHERE a.id > b.id AND a.email = b.email;

-- Ensuite, ajouter la contrainte unique
ALTER TABLE employees 
ADD CONSTRAINT employees_email_unique UNIQUE (email);

-- 6. Vérifier que la contrainte a été ajoutée
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'employees' 
  AND tc.table_schema = 'public'
  AND tc.constraint_type = 'UNIQUE'
ORDER BY kcu.column_name;

-- 7. Maintenant, synchroniser les utilisateurs Auth vers employees
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
  NULL as partner_id,
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

-- 8. Mettre à jour les user_id pour les employés existants qui n'en ont pas
UPDATE employees 
SET user_id = au.id
FROM auth.users au
WHERE employees.email = au.email 
  AND employees.user_id IS NULL;

-- 9. Vérifier le résultat final
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

-- 10. Fonction pour synchroniser automatiquement les nouveaux utilisateurs
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

-- 11. Trigger pour synchroniser automatiquement
DROP TRIGGER IF EXISTS trigger_sync_auth_to_employees ON auth.users;
CREATE TRIGGER trigger_sync_auth_to_employees
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_to_employees(); 