/**
 * Test de l'API Route locale pour diagnostiquer le problème
 */

const http = require('http');

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/account-management',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
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
            headers: res.headers,
            body: result
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
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

async function testApiRoute() {
  console.log('🔍 Test de l\'API Route locale...');
  
  try {
    console.log('\n📡 Test 1: get_accounts');
    const result1 = await makeRequest({
      action: 'get_accounts',
      data: { deviceId: 'test-device-123' }
    });
    
    console.log(`Status: ${result1.status}`);
    console.log('Response:', JSON.stringify(result1.body, null, 2));
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)');
  }
  
  try {
    console.log('\n📡 Test 2: save_account (sans token)');
    const result2 = await makeRequest({
      action: 'save_account',
      data: {
        deviceId: 'test-device-123',
        email: 'test@example.com',
        nom: 'Test',
        prenom: 'User'
      }
    });
    
    console.log(`Status: ${result2.status}`);
    console.log('Response:', JSON.stringify(result2.body, null, 2));
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
}

testApiRoute().catch(console.error);
