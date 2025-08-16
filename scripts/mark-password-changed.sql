-- Marquer qu'un utilisateur a changé son mot de passe
-- Remplacez 'email_utilisateur@example.com' par l'email réel de l'utilisateur

UPDATE admin_users 
SET require_password_change = FALSE 
WHERE email = 'email_utilisateur@example.com';

-- Pour voir tous les utilisateurs qui doivent encore changer leur mot de passe
SELECT email, require_password_change 
FROM admin_users 
WHERE require_password_change = TRUE;

-- Pour voir tous les utilisateurs
SELECT email, require_password_change, created_at 
FROM admin_users 
ORDER BY created_at DESC;
