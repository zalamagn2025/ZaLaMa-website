-- Script pour créer un partenaire de test
-- Exécutez ce script avant d'insérer l'employé

-- 1. Insérer un partenaire de test
INSERT INTO partenaires (
  id,
  nom,
  email,
  telephone,
  adresse,
  secteur_activite,
  statut
) VALUES 
('partner-test-uuid', 'Entreprise Test', 'contact@test.com', '+224 123 456 789', 'Conakry, Guinée', 'Technologie', 'Actif')
ON CONFLICT (id) DO UPDATE SET
  nom = EXCLUDED.nom,
  statut = EXCLUDED.statut;

-- 2. Vérifier l'insertion
SELECT 
  id,
  nom,
  email,
  statut
FROM partenaires 
WHERE id = 'partner-test-uuid';

-- 3. Maintenant vous pouvez utiliser 'partner-test-uuid' dans le script d'insertion d'employé 