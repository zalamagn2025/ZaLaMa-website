-- Script pour insérer des données de test dans salary_advance_requests
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les employés disponibles
SELECT 
  id,
  nom,
  prenom,
  email,
  user_id
FROM employees 
WHERE actif = true 
LIMIT 5;

-- 2. Vérifier les partenaires disponibles
SELECT 
  id,
  nom,
  email
FROM partners 
WHERE actif = true 
LIMIT 5;

-- 3. Insérer des demandes de test
-- Remplacez les UUIDs par les vrais IDs de vos employés et partenaires

INSERT INTO salary_advance_requests (
  employe_id,
  partenaire_id,
  montant_demande,
  type_motif,
  motif,
  numero_reception,
  frais_service,
  montant_total,
  salaire_disponible,
  avance_disponible,
  statut,
  date_creation
) VALUES 
-- Demande 1: En attente
(
  (SELECT id FROM employees WHERE actif = true LIMIT 1),
  (SELECT id FROM partners WHERE actif = true LIMIT 1),
  500000,
  'TRANSPORT',
  'Réparation véhicule - Urgence familiale',
  '+224123456789',
  32500,
  532500,
  1500000,
  375000,
  'En attente',
  NOW() - INTERVAL '2 days'
),
-- Demande 2: Validée
(
  (SELECT id FROM employees WHERE actif = true LIMIT 1),
  (SELECT id FROM partners WHERE actif = true LIMIT 1),
  300000,
  'SANTE',
  'Frais médicaux - Consultation spécialiste',
  '+224987654321',
  19500,
  319500,
  1500000,
  375000,
  'Validé',
  NOW() - INTERVAL '5 days'
),
-- Demande 3: Rejetée
(
  (SELECT id FROM employees WHERE actif = true LIMIT 1),
  (SELECT id FROM partners WHERE actif = true LIMIT 1),
  800000,
  'EDUCATION',
  'Frais scolaires - Inscription université',
  '+224555666777',
  52000,
  852000,
  1500000,
  375000,
  'Rejeté',
  NOW() - INTERVAL '1 week'
),
-- Demande 4: En attente (récente)
(
  (SELECT id FROM employees WHERE actif = true LIMIT 1),
  (SELECT id FROM partners WHERE actif = true LIMIT 1),
  200000,
  'LOGEMENT',
  'Loyer - Avance sur salaire',
  '+224111222333',
  13000,
  213000,
  1500000,
  375000,
  'En attente',
  NOW() - INTERVAL '1 hour'
),
-- Demande 5: Validée (ancienne)
(
  (SELECT id FROM employees WHERE actif = true LIMIT 1),
  (SELECT id FROM partners WHERE actif = true LIMIT 1),
  400000,
  'ALIMENTATION',
  'Courses alimentaires - Mois difficile',
  '+224444555666',
  26000,
  426000,
  1500000,
  375000,
  'Validé',
  NOW() - INTERVAL '2 weeks'
);

-- 4. Vérifier les données insérées
SELECT 
  sar.id,
  sar.montant_demande,
  sar.type_motif,
  sar.motif,
  sar.statut,
  sar.date_creation,
  e.nom || ' ' || e.prenom as employe_nom,
  p.nom as partenaire_nom
FROM salary_advance_requests sar
LEFT JOIN employees e ON sar.employe_id = e.id
LEFT JOIN partners p ON sar.partenaire_id = p.id
ORDER BY sar.date_creation DESC
LIMIT 10;

-- 5. Statistiques
SELECT 
  statut,
  COUNT(*) as nombre_demandes,
  SUM(montant_demande) as total_montant,
  AVG(montant_demande) as moyenne_montant
FROM salary_advance_requests
GROUP BY statut
ORDER BY nombre_demandes DESC; 