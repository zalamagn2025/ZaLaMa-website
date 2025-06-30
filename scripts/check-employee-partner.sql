-- Script pour vérifier et ajouter le partenaireId à un employé
-- Remplacez 'email_de_votre_employe@example.com' par l'email réel

-- 1. Vérifier l'employé actuel
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.partenaire_id,
  e.poste,
  e.actif
FROM employees e
WHERE e.email = 'email_de_votre_employe@example.com';

-- 2. Voir les partenaires disponibles
SELECT 
  id,
  nom,
  type,
  secteur,
  actif
FROM partners
WHERE actif = true
ORDER BY nom;

-- 3. Ajouter le partenaireId à l'employé
-- Remplacez 'PARTNER_ID' par l'ID du partenaire souhaité
UPDATE employees 
SET partenaire_id = 'PARTNER_ID'
WHERE email = 'email_de_votre_employe@example.com';

-- 4. Vérifier le résultat
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.partenaire_id,
  p.nom as nom_partenaire,
  e.poste,
  e.actif
FROM employees e
LEFT JOIN partners p ON e.partenaire_id = p.id
WHERE e.email = 'email_de_votre_employe@example.com'; 