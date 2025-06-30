-- Script simple pour ajouter les services financiers
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les politiques RLS existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'services';

-- 2. Supprimer les anciennes politiques RLS pour les services
DROP POLICY IF EXISTS "Anyone can view available services" ON services;
DROP POLICY IF EXISTS "Admins can manage services" ON services;

-- 3. Créer une politique RLS permissive pour les services
CREATE POLICY "Allow read for all services" ON services
  FOR SELECT USING (true);

-- 4. Supprimer les anciens services qui ne sont pas financiers (optionnel)
DELETE FROM services WHERE categorie NOT IN ('Avance', 'Prêt', 'Conseil', 'Financier');

-- 5. Insérer les services financiers (sans ON CONFLICT)
INSERT INTO services (nom, description, categorie, frais_attribues, pourcentage_max, duree, disponible) VALUES
('Avance sur salaire', 'Accès rapide à une partie de votre salaire avant la date de paie officielle pour les imprévus et urgences financières', 'Avance', 0, 25, 'Immédiat', true),
('Prêt personnel', 'Prêt personnel avec des conditions avantageuses pour vos projets personnels ou professionnels', 'Prêt', 0, 0, '6-24 mois', true),
('Conseil financier', 'Accompagnement personnalisé par IA pour la gestion de vos finances et la planification de votre avenir financier', 'Conseil', 0, 0, 'Sur mesure', true);

-- 6. Vérifier que les services ont été insérés
SELECT id, nom, description, categorie, disponible, pourcentage_max 
FROM services 
ORDER BY categorie, nom;

-- 7. Compter le nombre total de services
SELECT COUNT(*) as total_services FROM services; 