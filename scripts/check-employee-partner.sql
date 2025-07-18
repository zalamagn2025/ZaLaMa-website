-- Script pour vérifier et corriger les employés sans partner_id
-- Exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier les employés sans partner_id
SELECT 
  id,
  user_id,
  email,
  nom,
  prenom,
  partner_id,
  poste,
  actif,
  created_at
FROM employees 
WHERE partner_id IS NULL 
  AND actif = true
ORDER BY created_at DESC;

-- 2. Voir les partenaires disponibles
SELECT 
  id,
  nom,
  type,
  secteur,
  actif,
  created_at
FROM partners
WHERE actif = true
ORDER BY nom;

-- 3. Ajouter un partner_id par défaut aux employés qui n'en ont pas
-- Remplacez 'PARTNER_ID_DEFAUT' par l'ID d'un partenaire existant
UPDATE employees 
SET partner_id = 'PARTNER_ID_DEFAUT'
WHERE partner_id IS NULL 
  AND actif = true;

-- 4. Vérifier le résultat après mise à jour
SELECT 
  e.id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.partner_id,
  p.nom as nom_partenaire,
  e.poste,
  e.actif
FROM employees e
LEFT JOIN partners p ON e.partner_id = p.id
WHERE e.actif = true
ORDER BY e.created_at DESC;

-- 5. Statistiques des employés par partenaire
SELECT 
  p.nom as nom_partenaire,
  COUNT(e.id) as nombre_employes,
  COALESCE(SUM(e.salaire_net), 0) as total_salaires
FROM employees e
LEFT JOIN partners p ON e.partner_id = p.id
WHERE e.actif = true
GROUP BY p.id, p.nom
ORDER BY nombre_employes DESC;

-- 6. Vérifier les employés sans partenaire (doit retourner 0 lignes)
SELECT 
  COUNT(*) as employes_sans_partenaire
FROM employees 
WHERE partner_id IS NULL 
  AND actif = true; 