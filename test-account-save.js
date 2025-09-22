/**
 * Test de la sauvegarde automatique des comptes
 */

const http = require('http');

function testApiRoute(action, data, userToken = null) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ action, data });
    
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/account-management',
      method: 'POST',
      headers
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({
            status: res.statusCode,
            body: result
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body
          });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

async function testAccountSave() {
  console.log('🧪 Test de la sauvegarde automatique des comptes');
  console.log('='.repeat(60));
  
  const deviceId = 'test-device-save';
  
  // Test 1: Vérifier qu'il n'y a pas de comptes initialement
  console.log('\n📡 Test 1: Vérifier les comptes initiaux');
  try {
    const result1 = await testApiRoute('get_accounts', { deviceId });
    console.log(`Status: ${result1.status}`);
    console.log(`Comptes trouvés: ${result1.body.accounts?.length || 0}`);
    console.log('Response:', JSON.stringify(result1.body, null, 2));
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  // Test 2: Simuler la sauvegarde d'un compte (avec un token fictif)
  console.log('\n📡 Test 2: Sauvegarder un compte de test');
  try {
    // Note: Ce test échouera probablement car nous n'avons pas de vrai token
    // Mais cela nous permettra de voir si l'API fonctionne
    const fakeToken = 'fake-token-for-testing';
    const result2 = await testApiRoute('save_account', {
      deviceId,
      email: 'test@example.com',
      nom: 'Test',
      prenom: 'User',
      poste: 'Développeur',
      entreprise: 'ZaLaMa',
      userId: 'test-user-123'
    }, fakeToken);
    
    console.log(`Status: ${result2.status}`);
    console.log('Response:', JSON.stringify(result2.body, null, 2));
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  // Test 3: Vérifier les comptes après tentative de sauvegarde
  console.log('\n📡 Test 3: Vérifier les comptes après sauvegarde');
  try {
    const result3 = await testApiRoute('get_accounts', { deviceId });
    console.log(`Status: ${result3.status}`);
    console.log(`Comptes trouvés: ${result3.body.accounts?.length || 0}`);
    console.log('Response:', JSON.stringify(result3.body, null, 2));
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  console.log('\n📋 Instructions pour tester manuellement:');
  console.log('1. Démarrer le serveur: npm run dev');
  console.log('2. Aller sur: http://localhost:3000/login');
  console.log('3. Se connecter avec un compte existant');
  console.log('4. Se déconnecter');
  console.log('5. Retourner sur /login');
  console.log('6. Vérifier que le compte apparaît dans la sélection');
  
  console.log('\n🔍 Vérifications à faire:');
  console.log('- Ouvrir la console du navigateur (F12)');
  console.log('- Chercher les messages: "💾 Sauvegarde automatique du compte"');
  console.log('- Chercher les messages: "✅ Compte sauvegardé avec succès"');
  console.log('- Vérifier que le compte apparaît dans l\'interface');
}

testAccountSave().catch(console.error);
