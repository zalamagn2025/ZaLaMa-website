const fetch = require('node-fetch');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mspmrzlqhwpdkkburjiw.supabase.co';
const API_BASE_URL = 'http://localhost:3000/api';

// Domaines à tester
const testOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://zalamagn.com',
  'https://www.zalamagn.com',
  'http://zalamagn.com',
  'http://www.zalamagn.com',
];

// Données de test
const TEST_EMPLOYEE = {
  email: 'test@example.com',
  password: 'testpassword123'
};

let accessToken = null;

// Fonction pour se connecter et obtenir un token
async function login() {
  console.log('🔐 Connexion pour obtenir le token...');
  
  try {
    const response = await fetch(`${BASE_URL}/functions/v1/employee-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_EMPLOYEE),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur de connexion: ${result.error}`);
    }

    accessToken = result.access_token;
    console.log('✅ Connexion réussie, token obtenu');
    return accessToken;
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error.message);
    throw error;
  }
}

// Fonction pour tester CORS sur une origine spécifique
async function testCorsForOrigin(origin, endpoint) {
  console.log(`\n🌐 Test CORS pour ${origin} sur ${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Origin': origin,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const corsOrigin = response.headers.get('access-control-allow-origin');
    const corsMethods = response.headers.get('access-control-allow-methods');
    const corsHeaders = response.headers.get('access-control-allow-headers');

    console.log(`📊 Status: ${response.status}`);
    console.log(`🌐 CORS Origin: ${corsOrigin}`);
    console.log(`🔧 CORS Methods: ${corsMethods}`);
    console.log(`📋 CORS Headers: ${corsHeaders}`);

    if (corsOrigin === origin || corsOrigin === '*') {
      console.log('✅ CORS configuré correctement');
      return true;
    } else {
      console.log('❌ CORS mal configuré');
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur lors du test CORS: ${error.message}`);
    return false;
  }
}

// Fonction pour tester les requêtes OPTIONS (preflight)
async function testPreflightForOrigin(origin, endpoint) {
  console.log(`\n🛡️ Test Preflight pour ${origin} sur ${endpoint}`);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization, Content-Type',
      },
    });

    const corsOrigin = response.headers.get('access-control-allow-origin');
    const corsMethods = response.headers.get('access-control-allow-methods');
    const corsHeaders = response.headers.get('access-control-allow-headers');

    console.log(`📊 Status: ${response.status}`);
    console.log(`🌐 CORS Origin: ${corsOrigin}`);
    console.log(`🔧 CORS Methods: ${corsMethods}`);
    console.log(`📋 CORS Headers: ${corsHeaders}`);

    if (response.status === 200) {
      console.log('✅ Preflight réussi');
      return true;
    } else {
      console.log('❌ Preflight échoué');
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur lors du test preflight: ${error.message}`);
    return false;
  }
}

// Fonction pour tester une API spécifique
async function testApiEndpoint(origin, endpoint, method = 'GET', body = null) {
  console.log(`\n🔍 Test API ${method} ${endpoint} pour ${origin}`);
  
  try {
    const options = {
      method,
      headers: {
        'Origin': origin,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    console.log(`📊 Status: ${response.status}`);
    console.log(`🌐 CORS Origin: ${response.headers.get('access-control-allow-origin')}`);
    
    if (response.ok) {
      console.log('✅ API fonctionne correctement');
      return true;
    } else {
      console.log(`❌ Erreur API: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur lors du test API: ${error.message}`);
    return false;
  }
}

// Fonction principale de test
async function runCorsTests() {
  console.log('🚀 Démarrage des tests CORS...\n');
  
  try {
    // 1. Connexion pour obtenir un token
    await login();
    
    const results = {
      cors: [],
      preflight: [],
      api: []
    };

    // 2. Tester CORS pour chaque origine
    for (const origin of testOrigins) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🧪 Test complet pour ${origin}`);
      console.log(`${'='.repeat(60)}`);

      // Test CORS basique
      const corsResult = await testCorsForOrigin(origin, '/auth/login');
      results.cors.push({ origin, success: corsResult });

      // Test Preflight
      const preflightResult = await testPreflightForOrigin(origin, '/auth/login');
      results.preflight.push({ origin, success: preflightResult });

      // Test API réelle (si CORS fonctionne)
      if (corsResult) {
        const apiResult = await testApiEndpoint(origin, '/avis/list');
        results.api.push({ origin, success: apiResult });
      }
    }

    // 3. Résumé des résultats
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 RÉSUMÉ DES TESTS CORS');
    console.log(`${'='.repeat(60)}`);

    console.log('\n🌐 Tests CORS:');
    results.cors.forEach(result => {
      console.log(`  ${result.success ? '✅' : '❌'} ${result.origin}`);
    });

    console.log('\n🛡️ Tests Preflight:');
    results.preflight.forEach(result => {
      console.log(`  ${result.success ? '✅' : '❌'} ${result.origin}`);
    });

    console.log('\n🔍 Tests API:');
    results.api.forEach(result => {
      console.log(`  ${result.success ? '✅' : '❌'} ${result.origin}`);
    });

    // 4. Statistiques
    const corsSuccess = results.cors.filter(r => r.success).length;
    const preflightSuccess = results.preflight.filter(r => r.success).length;
    const apiSuccess = results.api.filter(r => r.success).length;

    console.log(`\n📈 Statistiques:`);
    console.log(`  CORS: ${corsSuccess}/${results.cors.length} (${Math.round(corsSuccess/results.cors.length*100)}%)`);
    console.log(`  Preflight: ${preflightSuccess}/${results.preflight.length} (${Math.round(preflightSuccess/results.preflight.length*100)}%)`);
    console.log(`  API: ${apiSuccess}/${results.api.length} (${Math.round(apiSuccess/results.api.length*100)}%)`);

    if (corsSuccess === results.cors.length && preflightSuccess === results.preflight.length) {
      console.log('\n🎉 Tous les tests CORS ont réussi !');
      console.log('✅ La configuration CORS fonctionne correctement sur tous les domaines');
    } else {
      console.log('\n⚠️ Certains tests CORS ont échoué');
      console.log('🔧 Vérifiez la configuration CORS dans src/lib/cors.ts');
    }

  } catch (error) {
    console.error('\n💥 Erreur lors des tests CORS:', error.message);
    process.exit(1);
  }
}

// Instructions d'utilisation
console.log('📋 Instructions:');
console.log('1. Assurez-vous que le serveur Next.js est démarré (npm run dev)');
console.log('2. Vérifiez que les variables d\'environnement sont configurées');
console.log('3. Mettez à jour les données de test dans ce script');
console.log('4. Exécutez: node test-cors.js\n');

// Configuration des variables d'environnement
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL n\'est pas défini');
  console.log('💡 Ajoutez NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co à votre .env');
  process.exit(1);
}

// Exécuter les tests
runCorsTests();
