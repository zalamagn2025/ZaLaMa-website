-- Création de la table pour les tokens de réinitialisation de mot de passe
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_used ON password_reset_tokens(used);

-- Contrainte pour s'assurer qu'un utilisateur n'a qu'un seul token actif à la fois
CREATE UNIQUE INDEX IF NOT EXISTS idx_password_reset_tokens_active_user 
ON password_reset_tokens(user_id) 
WHERE used = FALSE;

-- Fonction pour nettoyer automatiquement les tokens expirés
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() OR used = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_password_reset_tokens_updated_at
    BEFORE UPDATE ON password_reset_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Politique RLS pour la sécurité
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'accès aux administrateurs uniquement
CREATE POLICY "password_reset_tokens_admin_policy" ON password_reset_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- Commentaires pour la documentation
COMMENT ON TABLE password_reset_tokens IS 'Table pour stocker les tokens de réinitialisation de mot de passe';
COMMENT ON COLUMN password_reset_tokens.token_hash IS 'Hash SHA256 du token de réinitialisation';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Date d''expiration du token (1 heure par défaut)';
COMMENT ON COLUMN password_reset_tokens.used IS 'Indique si le token a déjà été utilisé';

-- Nettoyage initial des tokens expirés
SELECT cleanup_expired_tokens();

-- Affichage de la structure créée
\d password_reset_tokens; 