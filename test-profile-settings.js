// Test des paramètres du profil utilisateur
// Ce fichier permet de tester les fonctionnalités de mise à jour du profil

console.log('🧪 Test des paramètres du profil utilisateur');

// Test 1: Vérification de l'authentification
async function testAuthentication() {
  console.log('🔐 Test 1: Vérification de l\'authentification');
  
  const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
  
  if (!accessToken) {
    console.error('❌ Aucun token d\'accès trouvé');
    return false;
  }
  
  console.log('✅ Token d\'accès trouvé:', accessToken.substring(0, 20) + '...');
  return true;
}

// Test 2: Test de mise à jour du profil
async function testProfileUpdate() {
  console.log('📝 Test 2: Test de mise à jour du profil');
  
  const testData = {
    nom: 'Test',
    prenom: 'Utilisateur',
    telephone: '+224123456789',
    adresse: 'Adresse de test'
  };
  
  try {
    const response = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Mise à jour du profil réussie:', result);
      return true;
    } else {
      console.error('❌ Erreur lors de la mise à jour du profil:', result);
      return false;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test de mise à jour:', error);
    return false;
  }
}

// Test 3: Test de récupération du profil
async function testProfileRetrieval() {
  console.log('👤 Test 3: Test de récupération du profil');
  
  try {
    const response = await fetch('/api/auth/getme', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')}`,
      },
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Profil récupéré avec succès:', result);
      return true;
    } else {
      console.error('❌ Erreur lors de la récupération du profil:', result);
      return false;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test de récupération:', error);
    return false;
  }
}

// Test 4: Test de l'upload de photo (simulation)
async function testPhotoUpload() {
  console.log('📸 Test 4: Test de l\'upload de photo (simulation)');
  
  // Créer un fichier de test
  const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  
  try {
    const formData = new FormData();
    formData.append('photo', testFile);
    
    const response = await fetch('/api/auth/upload-photo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    
    console.log('📥 Réponse upload photo:', {
      status: response.status,
      success: result.success,
      error: result.error
    });
    
    if (response.ok) {
      console.log('✅ Upload de photo réussi:', result);
      return true;
    } else {
      console.error('❌ Erreur lors de l\'upload de photo:', result);
      return false;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test d\'upload:', error);
    return false;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests des paramètres du profil...\n');
  
  const results = {
    authentication: await testAuthentication(),
    profileUpdate: await testProfileUpdate(),
    profileRetrieval: await testProfileRetrieval(),
    photoUpload: await testPhotoUpload(),
  };
  
  console.log('\n📊 Résultats des tests:');
  console.log('🔐 Authentification:', results.authentication ? '✅ Réussi' : '❌ Échec');
  console.log('📝 Mise à jour profil:', results.profileUpdate ? '✅ Réussi' : '❌ Échec');
  console.log('👤 Récupération profil:', results.profileRetrieval ? '✅ Réussi' : '❌ Échec');
  console.log('📸 Upload photo:', results.photoUpload ? '✅ Réussi' : '❌ Échec');
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Score: ${successCount}/${totalTests} tests réussis`);
  
  if (successCount === totalTests) {
    console.log('🎉 Tous les tests sont passés avec succès !');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }
}

// Exécuter les tests si le script est appelé directement
if (typeof window !== 'undefined') {
  // Dans le navigateur
  window.testProfileSettings = runAllTests;
  console.log('🧪 Tests prêts. Exécutez window.testProfileSettings() dans la console pour lancer les tests.');
} else {
  // Dans Node.js
  runAllTests();
}

