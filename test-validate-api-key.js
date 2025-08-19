const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testValidateApiKey() {
  console.log('🧪 Test de l\'API de validation de clé API\n');

  const tests = [
    {
      name: 'Test 1: Clé API valide',
      api_key: 'partner_c19af714-1d3a-495c-a0db-b3357e00de3c_1755560524503',
      expectedSuccess: true
    },
    {
      name: 'Test 2: Clé API invalide',
      api_key: 'invalid_api_key',
      expectedSuccess: false
    },
    {
      name: 'Test 3: Clé API vide',
      api_key: '',
      expectedSuccess: false
    },
    {
      name: 'Test 4: Clé API existante',
      api_key: 'zalama_partner_key_2024',
      expectedSuccess: true
    },
    {
      name: 'Test 5: Sans clé API',
      api_key: null,
      expectedSuccess: false
    }
  ];

  for (const test of tests) {
    console.log(`\n📋 ${test.name}`);
    console.log(`🔑 Clé API: ${test.api_key ? '***' + test.api_key.slice(-4) : 'null'}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/validate-api-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: test.api_key
        })
      });

      const result = await response.json();
      
      console.log(`📊 Status: ${response.status}`);
      console.log(`✅ Success: ${result.success}`);
      
      if (result.success) {
        console.log(`🏢 Entreprise: ${result.data?.company_name || 'N/A'}`);
        console.log(`🆔 Partner ID: ${result.data?.partner_id || 'N/A'}`);
        console.log(`🖼️ Logo: ${result.data?.logo_url || 'N/A'}`);
        console.log(`🟢 Actif: ${result.data?.is_active || 'N/A'}`);
      } else {
        console.log(`❌ Erreur: ${result.error || 'N/A'}`);
        console.log(`💬 Message: ${result.message || 'N/A'}`);
      }

      // Vérification du test
      if (result.success === test.expectedSuccess) {
        console.log('✅ Test réussi');
      } else {
        console.log('❌ Test échoué');
      }

    } catch (error) {
      console.error('💥 Erreur lors du test:', error.message);
    }
  }

  console.log('\n🎯 Tests terminés');
}

// Test CORS
async function testCors() {
  console.log('\n🌐 Test CORS');
  
  try {
    const response = await fetch(`${BASE_URL}/api/validate-api-key`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });

    console.log(`📊 Status CORS: ${response.status}`);
    console.log(`🔗 Access-Control-Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
    console.log(`🔗 Access-Control-Allow-Methods: ${response.headers.get('Access-Control-Allow-Methods')}`);
    console.log(`🔗 Access-Control-Allow-Headers: ${response.headers.get('Access-Control-Allow-Headers')}`);
    
  } catch (error) {
    console.error('💥 Erreur CORS:', error.message);
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🚀 Démarrage des tests de validation de clé API\n');
  
  await testValidateApiKey();
  await testCors();
  
  console.log('\n✨ Tous les tests sont terminés');
}

runTests().catch(console.error);
