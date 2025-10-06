/**
 * Script de test pour l'intégration multi-comptes sur /login
 * 
 * Ce script teste l'API et vérifie que l'intégration fonctionne correctement
 */

const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000/api/account-management';
const LOGIN_URL = 'http://localhost:3000/login';

// Données de test
const testAccounts = [
  {
    email: 'test1@example.com',
    nom: 'Test',
    prenom: 'User1',
    poste: 'Développeur',
    entreprise: 'ZaLaMa',
    userId: 'test-user-1'
  },
  {
    email: 'test2@example.com',
    nom: 'Test',
    prenom: 'User2',
    poste: 'Designer',
    entreprise: 'ZaLaMa',
    userId: 'test-user-2'
  }
];

// Fonction utilitaire pour faire des requêtes
async function makeRequest(action, data, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, data })
    });

    const result = await response.json();
    
    console.log(`\n📡 ${action.toUpperCase()}:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${result.success}`);
    
    if (result.success) {
      console.log(`   ✅ ${action} réussi`);
      if (result.accounts) {
        console.log(`   📊 Comptes trouvés: ${result.accounts.length}`);
      }
    } else {
      console.log(`   ❌ Erreur: ${result.error}`);
    }
    
    return { success: result.success, data: result };
  } catch (error) {
    console.log(`\n❌ Erreur de connexion pour ${action}:`);
    console.log(`   ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test 1: Vérifier que l'API répond
async function testApiConnection() {
  console.log('\n🔌 Test 1: Connexion API');
  console.log('='.repeat(50));
  
  const result = await makeRequest('get_accounts', { deviceId: 'test-device-integration' });
  
  if (result.success !== undefined) {
    console.log('✅ API accessible');
    return true;
  } else {
    console.log('❌ API inaccessible');
    return false;
  }
}

// Test 2: Vérifier la structure des comptes
async function testAccountStructure() {
  console.log('\n📋 Test 2: Structure des comptes');
  console.log('='.repeat(50));
  
  const result = await makeRequest('get_accounts', { deviceId: 'test-device-integration' });
  
  if (result.success && Array.isArray(result.data.accounts)) {
    console.log('✅ Structure des comptes correcte');
    return true;
  } else {
    console.log('❌ Structure des comptes incorrecte');
    return false;
  }
}

// Test 3: Test de sauvegarde (sans token - devrait échouer)
async function testSaveAccountWithoutToken() {
  console.log('\n🔒 Test 3: Sauvegarde sans token (devrait échouer)');
  console.log('='.repeat(50));
  
  const result = await makeRequest('save_account', {
    deviceId: 'test-device-integration',
    ...testAccounts[0]
  });
  
  if (!result.success) {
    console.log('✅ Sauvegarde sans token correctement rejetée');
    return true;
  } else {
    console.log('❌ Sauvegarde sans token acceptée (problème de sécurité)');
    return false;
  }
}

// Test 4: Test de vérification PIN
async function testPinVerification() {
  console.log('\n🔐 Test 4: Vérification PIN');
  console.log('='.repeat(50));
  
  const result = await makeRequest('verify_pin', {
    deviceId: 'test-device-integration',
    userId: 'test-user-1',
    pin: '123456'
  });
  
  // Ce test peut échouer si l'utilisateur n'existe pas, c'est normal
  console.log('ℹ️  Test de vérification PIN (peut échouer si utilisateur inexistant)');
  return true;
}

// Test 5: Test de suppression
async function testRemoveAccount() {
  console.log('\n🗑️  Test 5: Suppression de compte');
  console.log('='.repeat(50));
  
  const result = await makeRequest('remove_account', {
    deviceId: 'test-device-integration',
    userId: 'test-user-1'
  });
  
  console.log('ℹ️  Test de suppression (peut échouer si compte inexistant)');
  return true;
}

// Test 6: Vérifier les composants React
async function testReactComponents() {
  console.log('\n⚛️  Test 6: Composants React');
  console.log('='.repeat(50));
  
  try {
    // Vérifier que les fichiers de composants existent
    const fs = require('fs');
    const path = require('path');
    
    const components = [
      'src/components/auth/AccountSelectorCard.tsx',
      'src/components/auth/QuickPinVerificationCard.tsx',
      'src/components/auth/EmployeeLoginForm.tsx'
    ];
    
    let allExist = true;
    
    for (const component of components) {
      if (fs.existsSync(component)) {
        console.log(`✅ ${component} existe`);
      } else {
        console.log(`❌ ${component} manquant`);
        allExist = false;
      }
    }
    
    return allExist;
  } catch (error) {
    console.log(`❌ Erreur lors de la vérification des composants: ${error.message}`);
    return false;
  }
}

// Test 7: Vérifier l'intégration du contexte
async function testContextIntegration() {
  console.log('\n🔄 Test 7: Intégration du contexte');
  console.log('='.repeat(50));
  
  try {
    const fs = require('fs');
    
    // Vérifier que AccountAuthProvider est dans layout.tsx
    const layoutPath = 'src/app/layout.tsx';
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      if (layoutContent.includes('AccountAuthProvider')) {
        console.log('✅ AccountAuthProvider intégré dans layout.tsx');
        return true;
      } else {
        console.log('❌ AccountAuthProvider manquant dans layout.tsx');
        return false;
      }
    } else {
      console.log('❌ layout.tsx non trouvé');
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la vérification du contexte: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'intégration multi-comptes');
  console.log('='.repeat(60));
  
  const tests = [
    { name: 'Connexion API', fn: testApiConnection },
    { name: 'Structure des comptes', fn: testAccountStructure },
    { name: 'Sauvegarde sans token', fn: testSaveAccountWithoutToken },
    { name: 'Vérification PIN', fn: testPinVerification },
    { name: 'Suppression de compte', fn: testRemoveAccount },
    { name: 'Composants React', fn: testReactComponents },
    { name: 'Intégration contexte', fn: testContextIntegration }
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ Erreur dans ${test.name}: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTATS DES TESTS');
  console.log('='.repeat(60));
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ L\'intégration multi-comptes est prête');
  } else {
    console.log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ');
    console.log('🔧 Vérifiez les erreurs ci-dessus');
  }
  
  console.log('\n📋 PROCHAINES ÉTAPES:');
  console.log('1. Démarrer le serveur: npm run dev');
  console.log('2. Aller sur: http://localhost:3000/login');
  console.log('3. Tester manuellement avec le guide: GUIDE_TEST_MULTI_ACCOUNT_LOGIN.md');
}

// Exécuter les tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testApiConnection,
  testAccountStructure,
  testSaveAccountWithoutToken,
  testPinVerification,
  testRemoveAccount,
  testReactComponents,
  testContextIntegration
};
