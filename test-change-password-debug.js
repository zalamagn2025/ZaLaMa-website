const http = require('http');

// Configuration
const BASE_URL = 'localhost';
const PORT = 3000;
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

// Test de debug pour la route change-password
async function testChangePasswordDebug() {
  console.log('🔍 Debug de la route change-password...\n');

  try {
    // Test 1: Requête avec données complètes mais token invalide
    console.log('1️⃣ Test avec données complètes (token invalide):');
    const response1 = await makeRequest({
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

    console.log(`   Status: ${response1.status}`);
    console.log(`   Response:`, response1.body);
    console.log('');

    // Test 2: Requête avec données complètes mais SANS token
    console.log('2️⃣ Test avec données complètes (SANS token):');
    const response2 = await makeRequest({
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

    console.log(`   Status: ${response2.status}`);
    console.log(`   Response:`, response2.body);
    console.log('');

    // Test 3: Requête avec données manquantes
    console.log('3️⃣ Test avec données manquantes:');
    const response3 = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token_invalide',
        'Content-Type': 'application/json',
      }
    }, {
      current_password: 'ancien123'
      // new_password manquant
    });

    console.log(`   Status: ${response3.status}`);
    console.log(`   Response:`, response3.body);
    console.log('');

    // Test 4: Requête avec données vides
    console.log('4️⃣ Test avec données vides:');
    const response4 = await makeRequest({
      hostname: BASE_URL,
      port: PORT,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer token_invalide',
        'Content-Type': 'application/json',
      }
    }, {
      current_password: '',
      new_password: ''
    });

    console.log(`   Status: ${response4.status}`);
    console.log(`   Response:`, response4.body);
    console.log('');

    console.log('📋 Analyse des résultats:');
    console.log('- Si vous voyez "Route non trouvée", l\'Edge Function n\'a pas la route change-password');
    console.log('- Si vous voyez "Token invalide", l\'Edge Function a la route mais le token est invalide');
    console.log('- Si vous voyez "Ancien et nouveau mot de passe requis", l\'Edge Function fonctionne mais valide les données');
    console.log('');
    console.log('💡 Pour tester avec un vrai token:');
    console.log('1. Connectez-vous sur http://localhost:3000/login');
    console.log('2. Ouvrez les DevTools (F12) → Console');
    console.log('3. Tapez: localStorage.getItem("employee_access_token")');
    console.log('4. Copiez le token et utilisez-le dans un test manuel');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter les tests
testChangePasswordDebug();
