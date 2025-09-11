// Test pour la fonctionnalité d'annulation des demandes d'avance
// Ce fichier teste l'intégration avec l'edge function employee-demands

const BASE_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co';
const FUNCTION_URL = `${BASE_URL}/functions/v1/employee-demands`;

// Token d'authentification (remplacer par un token valide)
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkMvUHpxSEtWamc5L0JTRHUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL21zcG1yemxxaHdwZGtrYnVyaml3LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MzQ4NDE3Ny0wNzNmLTQ0YjMtYTZmMi0wODgzYzhjMGNiNzYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3NTE3Njc1LCJpYXQiOjE3NTc1MTQwNzUsImVtYWlsIjoibW9yeWtvdWxpYmFseTIwMjNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiTW9yeSBLb3VsaWJhbHkiLCJwYXJ0ZW5haXJlX2lkIjoiMDdlMWFjNDItOWExNi00ODNjLWEyZTAtYzZhYTU3ODQ0NDI0Iiwicm9sZSI6InJoIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTc1MTQwNzV9XSwic2Vzc2lvbl9pZCI6IjM4MzdjYWEyLWI1MGUtNGViMy1hMjViLTkxODRhYWVkZWNiOSIsImlzX2Fub255bW91cyI6ZmFsc2V9.9VJAKALe_MVCNK1e4SmuczzIdeB4JDVgM1H0133t67s';

// ID de demande de test (remplacer par un ID valide)
const DEMAND_ID = '495f0800-6cc7-4dea-8b6a-384bf9217935';

/**
 * Test d'annulation d'une demande avec motif
 */
async function testCancelWithReason() {
  console.log('🧪 Test d\'annulation avec motif...');
  
  try {
    const response = await fetch(`${FUNCTION_URL}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: DEMAND_ID,
        reason: 'Changement de situation personnelle'
      })
    });

    const result = await response.json();
    
    console.log('📊 Statut de la réponse:', response.status);
    console.log('📋 Réponse:', result);
    
    if (response.ok) {
      console.log('✅ Test d\'annulation avec motif réussi !');
    } else {
      console.log('❌ Test d\'annulation avec motif échoué');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test d\'annulation avec motif:', error);
  }
}

/**
 * Test d'annulation d'une demande sans motif
 */
async function testCancelWithoutReason() {
  console.log('🧪 Test d\'annulation sans motif...');
  
  try {
    const response = await fetch(`${FUNCTION_URL}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: DEMAND_ID
      })
    });

    const result = await response.json();
    
    console.log('📊 Statut de la réponse:', response.status);
    console.log('📋 Réponse:', result);
    
    if (response.ok) {
      console.log('✅ Test d\'annulation sans motif réussi !');
    } else {
      console.log('❌ Test d\'annulation sans motif échoué');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test d\'annulation sans motif:', error);
  }
}

/**
 * Test avec ID de demande invalide
 */
async function testCancelWithInvalidId() {
  console.log('🧪 Test avec ID invalide...');
  
  try {
    const response = await fetch(`${FUNCTION_URL}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: 'invalid-uuid-here',
        reason: 'Test avec ID invalide'
      })
    });

    const result = await response.json();
    
    console.log('📊 Statut de la réponse:', response.status);
    console.log('📋 Réponse:', result);
    
    if (response.status === 400 || response.status === 404) {
      console.log('✅ Test avec ID invalide réussi (erreur attendue) !');
    } else {
      console.log('❌ Test avec ID invalide échoué (réponse inattendue)');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test avec ID invalide:', error);
  }
}

/**
 * Test sans token d'authentification
 */
async function testCancelWithoutAuth() {
  console.log('🧪 Test sans authentification...');
  
  try {
    const response = await fetch(`${FUNCTION_URL}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: DEMAND_ID,
        reason: 'Test sans auth'
      })
    });

    const result = await response.json();
    
    console.log('📊 Statut de la réponse:', response.status);
    console.log('📋 Réponse:', result);
    
    if (response.status === 401) {
      console.log('✅ Test sans authentification réussi (erreur attendue) !');
    } else {
      console.log('❌ Test sans authentification échoué (réponse inattendue)');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test sans authentification:', error);
  }
}

/**
 * Fonction principale pour exécuter tous les tests
 */
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'annulation des demandes d\'avance...\n');
  
  await testCancelWithReason();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testCancelWithoutReason();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testCancelWithInvalidId();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testCancelWithoutAuth();
  console.log('\n' + '='.repeat(50) + '\n');
  
  console.log('🏁 Tests terminés !');
}

// Exécuter les tests si le fichier est exécuté directement
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testCancelWithReason,
    testCancelWithoutReason,
    testCancelWithInvalidId,
    testCancelWithoutAuth,
    runAllTests
  };
}

