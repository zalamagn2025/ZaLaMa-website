-- Création de la table contacts pour les messages de contact
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sujet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  statut VARCHAR(50) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'repondu', 'archive')),
  ip_address VARCHAR(45), -- Stocker l'IP pour le suivi et la sécurité
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index nécessaires
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON contacts(statut);
CREATE INDEX IF NOT EXISTS idx_contacts_date_creation ON contacts(date_creation);

-- Activer RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour permettre l'insertion publique (formulaire de contact)
CREATE POLICY "Permettre l'insertion publique" ON contacts
  FOR INSERT WITH CHECK (true);

-- Politique RLS pour les admins (peuvent voir toutes les données)
CREATE POLICY "Admins peuvent voir toutes les données contacts" ON contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.type = 'Entreprise'
    )
  );

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- Insérer quelques données de test
INSERT INTO contacts (nom, prenom, email, sujet, message, statut) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'Demande d\'information', 'Bonjour, je souhaiterais avoir plus d\'informations sur vos services.', 'nouveau'),
('Martin', 'Marie', 'marie.martin@example.com', 'Question sur les tarifs', 'Quels sont vos tarifs pour l\'avance sur salaire ?', 'nouveau'),
('Bernard', 'Pierre', 'pierre.bernard@example.com', 'Partenariat', 'Nous sommes intéressés par un partenariat avec ZaLaMa.', 'nouveau')
ON CONFLICT DO NOTHING;

-- Afficher un message de confirmation
SELECT 'Table contacts créée avec succès!' as message; 