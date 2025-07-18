-- Script pour créer la table employes et synchroniser avec Auth
-- Exécuter dans l'éditeur SQL de Supabase

-- Créer la table employes si elle n'existe pas
CREATE TABLE IF NOT EXISTS employes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  genre employee_gender NOT NULL DEFAULT 'Homme',
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(20),
  adresse TEXT,
  poste VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  type_contrat employee_contract_type NOT NULL DEFAULT 'CDI',
  salaire_net DECIMAL(10,2),
  date_embauche DATE,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index nécessaires
CREATE INDEX IF NOT EXISTS idx_employes_user_id ON employes(user_id);
CREATE INDEX IF NOT EXISTS idx_employes_partner_id ON employes(partner_id);
CREATE INDEX IF NOT EXISTS idx_employes_email ON employes(email);
CREATE INDEX IF NOT EXISTS idx_employes_actif ON employes(actif);

-- Activer RLS
ALTER TABLE employes ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour les employés (peuvent voir leurs propres données)
CREATE POLICY "Employés peuvent voir leurs propres données" ON employes
  FOR SELECT USING (auth.uid() = user_id);

-- Politique RLS pour les admins (peuvent voir toutes les données)
CREATE POLICY "Admins peuvent voir toutes les données employés" ON employes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.type = 'Entreprise'
    )
  );

-- Fonction pour synchroniser les données Auth vers employes
CREATE OR REPLACE FUNCTION sync_auth_to_employes()
RETURNS TRIGGER AS $$
BEGIN
  -- Si c'est un nouvel utilisateur dans Auth
  IF TG_OP = 'INSERT' THEN
    -- Vérifier si c'est un employé (basé sur l'email ou metadata)
    IF NEW.raw_user_meta_data->>'type' = 'employe' OR 
       NEW.email LIKE '%@entreprise%' OR
       EXISTS (
         SELECT 1 FROM employes WHERE email = NEW.email
       ) THEN
      
      -- Insérer dans la table employes
      INSERT INTO employes (
        user_id,
        email,
        nom,
        prenom,
        poste,
        actif
      ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nom', ''),
        COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
        COALESCE(NEW.raw_user_meta_data->>'poste', 'Employé'),
        true
      )
      ON CONFLICT (email) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        nom = EXCLUDED.nom,
        prenom = EXCLUDED.prenom,
        poste = EXCLUDED.poste,
        updated_at = NOW();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour synchroniser automatiquement
DROP TRIGGER IF EXISTS trigger_sync_auth_to_employes ON auth.users;
CREATE TRIGGER trigger_sync_auth_to_employes
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_auth_to_employes();

-- Fonction pour mettre à jour la dernière connexion
CREATE OR REPLACE FUNCTION update_employe_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE employes 
  SET updated_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour la dernière connexion
DROP TRIGGER IF EXISTS trigger_update_employe_last_login ON auth.users;
CREATE TRIGGER trigger_update_employe_last_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_employe_last_login();

-- Synchroniser les utilisateurs existants dans Auth vers employes
INSERT INTO employes (
  user_id,
  email,
  nom,
  prenom,
  poste,
  actif
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'nom', ''),
  COALESCE(au.raw_user_meta_data->>'prenom', ''),
  COALESCE(au.raw_user_meta_data->>'poste', 'Employé'),
  true
FROM auth.users au
WHERE au.email IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM employes e WHERE e.email = au.email
  )
  AND (
    au.raw_user_meta_data->>'type' = 'employe' OR
    au.email LIKE '%@entreprise%' OR
    au.email NOT IN (SELECT email FROM users)
  )
ON CONFLICT (email) DO NOTHING;

-- Afficher les employés synchronisés
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.poste,
  e.actif,
  e.created_at
FROM employes e
ORDER BY e.created_at DESC; 