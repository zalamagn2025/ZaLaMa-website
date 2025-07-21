-- Script pour créer la table admin_users
-- Cette table gère les utilisateurs administrateurs et le statut de première connexion

-- Créer la table admin_users si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid not null,
  email character varying(255) not null,
  display_name character varying(200) not null,
  role public.admin_role not null default 'user'::admin_role,
  partenaire_id uuid null,
  active boolean null default true,
  last_login timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  require_password_change boolean null default true,
  constraint admin_users_pkey primary key (id),
  constraint admin_users_email_key unique (email)
) TABLESPACE pg_default;

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users USING btree (role) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON public.admin_users USING btree (active) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_partenaire_id ON public.admin_users USING btree (partenaire_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_require_password_change ON public.admin_users USING btree (require_password_change) TABLESPACE pg_default;

-- Créer le type enum admin_role s'il n'existe pas
DO $$ BEGIN
    CREATE TYPE public.admin_role AS ENUM ('admin', 'user', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Activer RLS (Row Level Security)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour admin_users
-- Permettre aux utilisateurs de voir leurs propres données
CREATE POLICY "Users can view their own admin data" ON public.admin_users
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Permettre aux admins de gérer tous les utilisateurs admin
CREATE POLICY "Admins can manage all admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = 'admin'
    )
  );

-- Permettre aux utilisateurs de mettre à jour leur propre statut de mot de passe
CREATE POLICY "Users can update their own password status" ON public.admin_users
  FOR UPDATE USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger pour admin_users
DROP TRIGGER IF EXISTS trigger_update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trigger_update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Insérer un utilisateur admin de test (optionnel)
-- INSERT INTO public.admin_users (
--   id,
--   email,
--   display_name,
--   role,
--   active,
--   require_password_change
-- ) VALUES (
--   gen_random_uuid(),
--   'admin@zalamagn.com',
--   'Administrateur ZaLaMa',
--   'admin',
--   true,
--   true
-- ) ON CONFLICT (email) DO NOTHING;

-- Afficher les informations de la table créée
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position; 