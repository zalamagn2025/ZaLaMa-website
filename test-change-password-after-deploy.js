const http = require('http');

// Configuration
const BASE_URL = 'localhost';
const PORT = 3000; // Ajuster selon le port utilisé
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

// Test de la route de changement de mot de passe après déploiement
async function testChangePasswordAfterDeploy() {
  console.log('🧪 Test de la route change-password après déploiement...\n');

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
    
    if (response1.status === 401) {
      console.log('   ✅ Test réussi - Erreur 401 attendue\n');
    } else {
      console.log('   ⚠️ Statut inattendu\n');
    }

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
    
    if (response2.status === 401) {
      console.log('   ✅ Test réussi - Erreur 401 attendue\n');
    } else {
      console.log('   ⚠️ Statut inattendu\n');
    }

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
    
    if (response3.status === 400) {
      console.log('   ✅ Test réussi - Erreur 400 attendue\n');
    } else {
      console.log('   ⚠️ Statut inattendu\n');
    }

    // Test 4: CORS preflight (OPTIONS)
    console.log('4️⃣ Test CORS preflight (OPTIONS):');
    const response4 = await makeRequest({
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

    console.log(`   Status: ${response4.status}`);
    console.log(`   Access-Control-Allow-Origin: ${response4.headers['access-control-allow-origin']}`);
    console.log(`   Access-Control-Allow-Methods: ${response4.headers['access-control-allow-methods']}`);
    console.log(`   Access-Control-Allow-Headers: ${response4.headers['access-control-allow-headers']}`);
    
    if (response4.status === 200) {
      console.log('   ✅ Test CORS réussi\n');
    } else {
      console.log('   ⚠️ Test CORS échoué\n');
    }

    // Test 5: Vérifier que la route n'est plus "non trouvée"
    console.log('5️⃣ Test de la route Edge Function:');
    const response5 = await makeRequest({
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

    console.log(`   Status: ${response5.status}`);
    console.log(`   Response:`, response5.body);
    
    // Vérifier que la réponse ne contient plus "Route non trouvée"
    if (response5.body && typeof response5.body === 'object' && response5.body.error) {
      if (response5.body.error.includes('Route non trouvée')) {
        console.log('   ❌ La route change-password n\'est toujours pas implémentée dans l\'Edge Function');
        console.log('   💡 Exécutez: npm run edge:deploy-employee-auth-change-password');
      } else {
        console.log('   ✅ La route change-password est maintenant implémentée !');
        console.log('   📝 L\'erreur actuelle est normale (token invalide)');
      }
    } else {
      console.log('   ⚠️ Réponse inattendue');
    }

    console.log('\n🎉 Tests de base terminés !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Si la route n\'est pas implémentée, exécutez: npm run edge:deploy-employee-auth-change-password');
    console.log('2. Connectez-vous via l\'interface web pour obtenir un token valide');
    console.log('3. Testez la page de changement de mot de passe avec un vrai token');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter les tests
testChangePasswordAfterDeploy();
