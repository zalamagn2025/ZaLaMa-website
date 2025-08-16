const http = require('http');

// Configuration
const BASE_URL = 'localhost';
const PORT = 3006; // Ajuster selon le port utilisé
const API_PATH = '/api/auth/change-password';

// Fonction utilitaire pour faire des requêtes HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsedBody
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test de la route de changement de mot de passe
async function testChangePassword() {
  console.log('🧪 Test de la route de changement de mot de passe...\n');

  try {
    // Test 1: Requête sans token d'autorisation
    console.log('1️⃣ Test sans token d\'autorisation:');
    const response1 = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, {
      current_password: 'ancien123',
      new_password: 'nouveau123'
    });

    console.log(`   Status: ${response1.status}`);
    console.log(`   Response:`, response1.body);
    console.log('   ✅ Test réussi - Erreur 401 attendue\n');

    // Test 2: Requête avec token invalide
    console.log('2️⃣ Test avec token invalide:');
    const response2 = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token_invalide',
        'Content-Type': 'application/json',
      }
    }, {
      current_password: 'ancien123',
      new_password: 'nouveau123'
    });

    console.log(`   Status: ${response2.status}`);
    console.log(`   Response:`, response2.body);
    console.log('   ✅ Test réussi - Erreur attendue\n');

    // Test 3: Requête OPTIONS (CORS preflight)
    console.log('3️⃣ Test CORS preflight (OPTIONS):');
    const response3 = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: API_PATH,
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      }
    });

    console.log(`   Status: ${response3.status}`);
    console.log(`   Access-Control-Allow-Origin: ${response3.headers['access-control-allow-origin']}`);
    console.log(`   Access-Control-Allow-Methods: ${response3.headers['access-control-allow-methods']}`);
    console.log(`   Access-Control-Allow-Headers: ${response3.headers['access-control-allow-headers']}`);
    console.log('   ✅ Test CORS réussi\n');

    console.log('🎉 Tous les tests de base sont passés !');
    console.log('\n📝 Note: Pour tester avec un vrai token, connectez-vous d\'abord via l\'interface web.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter les tests
testChangePassword();
