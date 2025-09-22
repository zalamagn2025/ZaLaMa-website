/**
 * Test simple pour diagnostiquer le problème
 */

const http = require('http');

function testApiRoute(action, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ action, data });
    
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
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

async function debugTest() {
  console.log('🔍 Test de diagnostic...');
  
  // Test 1: Action invalide
  console.log('\n📡 Test 1: Action invalide');
  try {
    const result1 = await testApiRoute('invalid_action', {});
    console.log(`Status: ${result1.status}`);
    console.log('Response:', result1.body);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  // Test 2: Action manquante
  console.log('\n📡 Test 2: Action manquante');
  try {
    const result2 = await testApiRoute(null, { deviceId: 'test' });
    console.log(`Status: ${result2.status}`);
    console.log('Response:', result2.body);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  // Test 3: get_accounts avec deviceId
  console.log('\n📡 Test 3: get_accounts');
  try {
    const result3 = await testApiRoute('get_accounts', { deviceId: 'test-device-123' });
    console.log(`Status: ${result3.status}`);
    console.log('Response:', result3.body);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  // Test 4: Vérifier si le serveur Next.js répond
  console.log('\n📡 Test 4: Test de base du serveur');
  try {
    const result4 = await testApiRoute('get_accounts', {});
    console.log(`Status: ${result4.status}`);
    console.log('Response:', result4.body);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

debugTest().catch(console.error);
