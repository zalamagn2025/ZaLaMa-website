// Script de debug pour tester l'annulation des demandes
const BASE_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co';
const FUNCTION_URL = `${BASE_URL}/functions/v1/employee-demands`;

// Token d'authentification
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkMvUHpxSEtWamc5L0JTRHUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL21zcG1yemxxaHdwZGtrYnVyaml3LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MzQ4NDE3Ny0wNzNmLTQ0YjMtYTZmMi0wODgzYzhjMGNiNzYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU3NTE3Njc1LCJpYXQiOjE3NTc1MTQwNzUsImVtYWlsIjoibW9yeWtvdWxpYmFseTIwMjNAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiTW9yeSBLb3VsaWJhbHkiLCJwYXJ0ZW5haXJlX2lkIjoiMDdlMWFjNDItOWExNi00ODNjLWEyZTAtYzZhYTU3ODQ0NDI0Iiwicm9sZSI6InJoIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NTc1MTQwNzV9XSwic2Vzc2lvbl9pZCI6IjM4MzdjYWEyLWI1MGUtNGViMy1hMjViLTkxODRhYWVkZWNiOSIsImlzX2Fub255bW91cyI6ZmFsc2V9.9VJAKALe_MVCNK1e4SmuczzIdeB4JDVgM1H0133t67s';

// ID de demande de test
const DEMAND_ID = '495f0800-6cc7-4dea-8b6a-384bf9217935';

/**
 * Test d'annulation d'une demande
 */
async function testCancelDemand() {
  console.log('🧪 Test d\'annulation de la demande...');
  console.log('📋 ID de la demande:', DEMAND_ID);
  console.log('🔗 URL de l\'API:', `${FUNCTION_URL}/cancel`);
  
  try {
    const response = await fetch(`${FUNCTION_URL}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: DEMAND_ID,
        reason: 'Test d\'annulation depuis le script de debug'
      })
    });

    console.log('📡 Statut de la réponse:', response.status);
    console.log('📡 Headers de la réponse:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 Contenu de la réponse (raw):', responseText);

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Annulation réussie:', data);
      } catch (parseError) {
        console.error('❌ Erreur de parsing JSON:', parseError);
        console.log('📄 Contenu brut:', responseText);
      }
    } else {
      console.error('❌ Erreur HTTP:', response.status, response.statusText);
      try {
        const errorData = JSON.parse(responseText);
        console.error('📄 Détails de l\'erreur:', errorData);
      } catch (parseError) {
        console.error('📄 Erreur brute:', responseText);
      }
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
  }
}

/**
 * Test de récupération des demandes pour vérifier l'état
 */
async function testGetDemands() {
  console.log('📋 Test de récupération des demandes...');
  
  try {
    const response = await fetch(`${FUNCTION_URL}/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Statut de la réponse:', response.status);
    const responseText = await response.text();
    console.log('📄 Contenu de la réponse:', responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Demandes récupérées:', data);
      
      // Chercher la demande spécifique
      const targetDemand = data.data?.demands?.find(d => d.id === DEMAND_ID);
      if (targetDemand) {
        console.log('🎯 Demande trouvée:', {
          id: targetDemand.id,
          statut: targetDemand.statut,
          montant_demande: targetDemand.montant_demande,
          date_creation: targetDemand.date_creation
        });
      } else {
        console.log('❌ Demande non trouvée dans la liste');
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des demandes:', error);
  }
}

// Exécuter les tests
console.log('🚀 Début des tests de debug...');
console.log('=====================================');

// Test 1: Récupérer les demandes
testGetDemands().then(() => {
  console.log('=====================================');
  // Test 2: Tenter l'annulation
  return testCancelDemand();
}).then(() => {
  console.log('=====================================');
  console.log('🏁 Tests terminés');
}).catch(error => {
  console.error('❌ Erreur générale:', error);
});
