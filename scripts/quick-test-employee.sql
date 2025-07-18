-- Script rapide pour tester l'insertion d'employé
-- Remplacez 'votre-user-id-ici' par votre vrai user_id

-- Insérer avec le minimum de champs requis
INSERT INTO employees (
  user_id,
  nom,
  prenom,
  salaire_net,
  poste,
  actif
) VALUES 
('votre-user-id-ici', 'Test', 'User', 750000, 'Développeur', true)
ON CONFLICT (user_id) DO UPDATE SET
  salaire_net = 750000,
  actif = true;

-- Vérifier immédiatement
SELECT 
  user_id,
  nom,
  prenom,
  salaire_net,
  poste,
  actif
FROM employees 
WHERE user_id = 'votre-user-id-ici'; 