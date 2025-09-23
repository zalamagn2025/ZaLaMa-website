/**
 * Test direct de l'Edge Function pour diagnostiquer le problème
 */

const fetch = require('node-fetch');

async function testEdgeFunction() {
  console.log('🔍 Test direct de l\'Edge Function...');
  
  const EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/account-management';
  
  try {
    console.log('\n📡 Test 1: get_accounts');
    const response1 = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'get_accounts',
        data: { deviceId: 'test-device-123' }
      })
    });
    
    console.log(`Status: ${response1.status}`);
    console.log(`Headers:`, Object.fromEntries(response1.headers.entries()));
    
    const result1 = await response1.text();
    console.log('Response body:', result1);
    
    try {
      const json1 = JSON.parse(result1);
      console.log('Parsed JSON:', json1);
    } catch (e) {
      console.log('❌ Response is not valid JSON');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  try {
    console.log('\n📡 Test 2: save_account (sans token)');
    const response2 = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'save_account',
        data: {
          deviceId: 'test-device-123',
          email: 'test@example.com',
          nom: 'Test',
          prenom: 'User'
        }
      })
    });
    
    console.log(`Status: ${response2.status}`);
    const result2 = await response2.text();
    console.log('Response body:', result2);
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

testEdgeFunction().catch(console.error);
