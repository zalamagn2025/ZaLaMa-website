// Script de test pour vérifier l'authentification de l'edge function
// Exécutez ce script avec : node test-edge-function-auth.js

const edgeFunctionUrl = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/upload-partner-logo';

async function testEdgeFunctionAuth() {
  /*console.log('🧪 Test d\'authentification de l\'edge function...\n')*/
  
  // Test 1: Sans authentification
  /*console.log('📡 Test 1: Sans en-tête d\'authentification')*/
  try {
    const response = await fetch(edgeFunctionUrl, { method: 'OPTIONS' });
    /*console.log(`   Status: ${response.status} ${response.statusText}`)*/
    /*console.log(`   Headers:`, Object.fromEntries(response.headers.entries()*/));
  } catch (error) {
    /*console.log(`   ❌ Erreur: ${error.message}`)*/
  }

  // Test 2: Avec en-tête d'authentification vide
  /*console.log('\n📡 Test 2: Avec en-tête d\'authentification vide')*/
  try {
    const response = await fetch(edgeFunctionUrl, { 
      method: 'OPTIONS',
      headers: { 'Authorization': 'Bearer ' }
    });
    /*console.log(`   Status: ${response.status} ${response.statusText}`)*/
    /*console.log(`   Headers:`, Object.fromEntries(response.headers.entries()*/));
  } catch (error) {
    /*console.log(`   ❌ Erreur: ${error.message}`)*/
  }

  // Test 3: Avec en-tête d'authentification invalide
  /*console.log('\n📡 Test 3: Avec en-tête d\'authentification invalide')*/
  try {
    const response = await fetch(edgeFunctionUrl, { 
      method: 'OPTIONS',
      headers: { 'Authorization': 'Bearer invalid-key' }
    });
    /*console.log(`   Status: ${response.status} ${response.statusText}`)*/
    /*console.log(`   Headers:`, Object.fromEntries(response.headers.entries()*/));
  } catch (error) {
    /*console.log(`   ❌ Erreur: ${error.message}`)*/
  }

  // Test 4: Vérifier les variables d'environnement
  /*console.log('\n🔧 Vérification des variables d\'environnement:')*/
  /*console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || 'Non définie'}`)*/
  /*console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Définie (' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)*/ + '...)' : 'Non définie'}`);

  // Test 5: Test avec la vraie clé si disponible
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    /*console.log('\n📡 Test 4: Avec la vraie clé d\'authentification')*/
    try {
      const response = await fetch(edgeFunctionUrl, { 
        method: 'OPTIONS',
        headers: { 
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      /*console.log(`   Status: ${response.status} ${response.statusText}`)*/
      /*console.log(`   Headers:`, Object.fromEntries(response.headers.entries()*/));
      
      if (response.ok) {
        /*console.log('   ✅ Authentification réussie !')*/
      } else {
        /*console.log('   ❌ Authentification échouée')*/
      }
    } catch (error) {
      /*console.log(`   ❌ Erreur: ${error.message}`)*/
    }
  }

  /*console.log('\n📋 Résumé des tests:')*/
  /*console.log('   - Status 200-299: ✅ Succès')*/
  /*console.log('   - Status 401: ❌ Non autorisé (clé invalide ou manquante)*/');
  /*console.log('   - Status 403: ❌ Interdit (permissions insuffisantes)*/');
  /*console.log('   - Status 404: ❌ Non trouvé (URL incorrecte)*/');
  /*console.log('   - Status 500+: ❌ Erreur serveur')*/
}

// Exécuter les tests
testEdgeFunctionAuth().catch(console.error);











