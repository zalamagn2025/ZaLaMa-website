// Script de test pour l'API avis
const fetch = require('node-fetch');

async function testAPI() {
  console.log('🔍 Test de l\'API /api/avis...');
  
  try {
    // Test GET
    console.log('📡 Test GET /api/avis...');
    const getResponse = await fetch('http://localhost:3002/api/avis', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📊 Status GET:', getResponse.status);
    console.log('📊 Status Text GET:', getResponse.statusText);
    
    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('✅ GET réussi:', getData);
    } else {
      console.log('❌ GET échoué');
    }
    
    // Test POST
    console.log('\n📡 Test POST /api/avis...');
    const postResponse = await fetch('http://localhost:3002/api/avis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note: 5,
        commentaire: 'Test API',
        type_retour: 'positif'
      }),
    });
    
    console.log('📊 Status POST:', postResponse.status);
    console.log('📊 Status Text POST:', postResponse.statusText);
    
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log('✅ POST réussi:', postData);
    } else {
      const errorText = await postResponse.text();
      console.log('❌ POST échoué:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
  }
}

testAPI(); 