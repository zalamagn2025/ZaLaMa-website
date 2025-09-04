// Script pour déboguer les informations de l'utilisateur connecté
// Exécuter avec: node debug-user-info.js

const SUPABASE_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Script de débogage des informations utilisateur\n');

async function debugUserInfo() {
  try {
    // Récupérer le token depuis localStorage (simulation)
    console.log('📋 Instructions pour déboguer :');
    console.log('1. Ouvrez la console du navigateur (F12)');
    console.log('2. Tapez cette commande :');
    console.log('   localStorage.getItem("employee_access_token")');
    console.log('3. Copiez le token et remplacez-le dans ce script\n');

    // Pour l'instant, on va utiliser une approche différente
    console.log('🔧 Vérification de la base de données :');
    console.log('1. Allez dans Supabase Dashboard');
    console.log('2. Table "employees" - vérifiez que l\'utilisateur existe');
    console.log('3. Table "admin_users" - vérifiez que l\'utilisateur a un rôle');
    console.log('4. Le rôle doit être "rh" ou "responsable"\n');

    console.log('📝 Requête SQL pour vérifier :');
    console.log(`
SELECT 
  e.id as employee_id,
  e.user_id,
  e.email,
  e.nom,
  e.prenom,
  e.salaire_net,
  au.role,
  au.partner_id,
  p.company_name
FROM employees e
LEFT JOIN admin_users au ON e.user_id = au.user_id
LEFT JOIN partners p ON au.partner_id = p.id
WHERE e.email = 'votre-email-rh@example.com';
    `);

    console.log('🔧 Pour assigner un rôle, exécutez cette requête SQL :');
    console.log(`
-- 1. D'abord, trouvez l'ID de l'utilisateur
SELECT id, user_id, email FROM employees WHERE email = 'votre-email-rh@example.com';

-- 2. Ensuite, insérez ou mettez à jour dans admin_users
INSERT INTO admin_users (user_id, role, partner_id) 
VALUES ('user-id-trouvé', 'rh', 'partner-id')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'rh', partner_id = 'partner-id';

-- 3. Mettez à jour le salaire à 0 si nécessaire
UPDATE employees 
SET salaire_net = 0 
WHERE email = 'votre-email-rh@example.com';
    `);

  } catch (error) {
    console.error('Erreur:', error);
  }
}

debugUserInfo();
