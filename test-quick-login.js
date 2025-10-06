/**
 * Test de la connexion rapide
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

async function testQuickLogin() {
  console.log('🧪 Test de la connexion rapide');
  console.log('='.repeat(50));
  
  const deviceId = 'test-device-quick-login';
  
  // Test 1: Vérifier les comptes
  console.log('\n📡 Test 1: Vérifier les comptes');
  try {
    const result1 = await testApiRoute('get_accounts', { deviceId });
    console.log(`Status: ${result1.status}`);
    console.log(`Comptes trouvés: ${result1.body.accounts?.length || 0}`);
    
    if (result1.body.accounts && result1.body.accounts.length > 0) {
      console.log('Comptes disponibles:');
      result1.body.accounts.forEach((account, index) => {
        console.log(`  ${index + 1}. ${account.email} (${account.prenom} ${account.nom})`);
      });
    } else {
      console.log('ℹ️  Aucun compte trouvé. Vous devez d\'abord vous connecter avec un compte pour le sauvegarder.');
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  // Test 2: Tester la vérification PIN (si des comptes existent)
  console.log('\n📡 Test 2: Tester la vérification PIN');
  try {
    const result2 = await testApiRoute('verify_pin', {
      deviceId,
      userId: 'test-user',
      pin: '123456'
    });
    console.log(`Status: ${result2.status}`);
    console.log('Response:', JSON.stringify(result2.body, null, 2));
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  console.log('\n📋 Instructions pour tester manuellement:');
  console.log('1. Démarrer le serveur: npm run dev');
  console.log('2. Aller sur: http://localhost:3000/login');
  console.log('3. Se connecter avec un compte existant (pour le sauvegarder)');
  console.log('4. Se déconnecter');
  console.log('5. Retourner sur /login');
  console.log('6. Cliquer sur le compte "Dernière connexion"');
  console.log('7. Entrer le PIN et cliquer sur "Se connecter"');
  
  console.log('\n🔍 Vérifications à faire:');
  console.log('- Ouvrir la console du navigateur (F12)');
  console.log('- Chercher les messages: "🚀 Connexion rapide pour:"');
  console.log('- Chercher les messages: "✅ Connexion rapide réussie"');
  console.log('- Vérifier que la redirection vers /dashboard fonctionne');
  
  console.log('\n🐛 Si ça ne fonctionne pas:');
  console.log('- Vérifier les erreurs dans la console');
  console.log('- Vérifier que le PIN est correct');
  console.log('- Vérifier que l\'API /api/auth/verify-password fonctionne');
  console.log('- Vérifier que employeeLogin fonctionne');
}

testQuickLogin().catch(console.error);
