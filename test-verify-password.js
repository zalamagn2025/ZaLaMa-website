// Script de test pour l'API verify-password
const fetch = require('node-fetch');

async function testVerifyPassword() {
  try {
    // Récupérer le token d'accès depuis localStorage (simulation)
    const accessToken = 'VOTRE_TOKEN_ICI'; // Remplacez par un vrai token
    
    console.log('🧪 Test de l\'API verify-password...');
    
    const response = await fetch('http://localhost:3000/api/auth/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        password: 'VOTRE_MOT_DE_PASSE' // Remplacez par le vrai mot de passe
      })
    });

    const result = await response.json();
    
    console.log('📋 Statut:', response.status);
    console.log('📋 Réponse:', result);
    
    if (result.success) {
      console.log('✅ Vérification réussie !');
    } else {
      console.log('❌ Échec de la vérification:', result.message);
    }
    
  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

// Instructions d'utilisation
console.log('📝 Instructions:');
console.log('1. Remplacez VOTRE_TOKEN_ICI par le token d\'accès de l\'employé');
console.log('2. Remplacez VOTRE_MOT_DE_PASSE par le mot de passe à tester');
console.log('3. Exécutez: node test-verify-password.js');
console.log('');

// Décommenter la ligne suivante pour exécuter le test
// testVerifyPassword();
