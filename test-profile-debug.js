// Script de diagnostic pour les paramètres du profil
console.log('🔍 Diagnostic des paramètres du profil...');

// 1. Vérifier l'authentification
function checkAuth() {
  const token = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token');
  console.log('🔐 Token présent:', !!token);
  if (token) {
    console.log('🔐 Token (premiers caractères):', token.substring(0, 20) + '...');
  }
  return token;
}

// 2. Vérifier les données utilisateur
function checkUserData() {
  console.log('👤 Données utilisateur dans le contexte:');
  
  // Essayer de récupérer les données depuis différents endroits
  const userData = window.employeeData || window.userData || window.currentUserData;
  console.log('👤 userData:', userData);
  
  if (userData) {
    console.log('👤 Propriétés disponibles:', Object.keys(userData));
    console.log('👤 Nom:', userData.nom);
    console.log('👤 Prénom:', userData.prenom);
    console.log('👤 Téléphone:', userData.telephone);
    console.log('👤 Adresse:', userData.adresse);
    console.log('👤 Photo URL:', userData.photo_url || userData.photoURL);
  }
  
  return userData;
}

// 3. Tester l'API de mise à jour
async function testUpdateAPI() {
  const token = checkAuth();
  if (!token) {
    console.error('❌ Pas de token, impossible de tester l\'API');
    return false;
  }
  
  console.log('📝 Test de l\'API de mise à jour...');
  
  const testData = {
    nom: 'Test_' + Date.now(),
    prenom: 'Debug',
    telephone: '+224123456789',
    adresse: 'Adresse de test'
  };
  
  try {
    const response = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    console.log('📥 Réponse API:', {
      status: response.status,
      ok: response.ok,
      result: result
    });
    
    if (response.ok) {
      console.log('✅ API de mise à jour fonctionne');
      return true;
    } else {
      console.error('❌ Erreur API:', result);
      return false;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test API:', error);
    return false;
  }
}

// 4. Tester l'API de récupération
async function testGetAPI() {
  const token = checkAuth();
  if (!token) {
    console.error('❌ Pas de token, impossible de tester l\'API');
    return false;
  }
  
  console.log('👤 Test de l\'API de récupération...');
  
  try {
    const response = await fetch('/api/auth/getme', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();
    
    console.log('📥 Réponse API getme:', {
      status: response.status,
      ok: response.ok,
      result: result
    });
    
    if (response.ok) {
      console.log('✅ API de récupération fonctionne');
      return true;
    } else {
      console.error('❌ Erreur API getme:', result);
      return false;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test API getme:', error);
    return false;
  }
}

// 5. Tester l'upload de photo
async function testPhotoUpload() {
  const token = checkAuth();
  if (!token) {
    console.error('❌ Pas de token, impossible de tester l\'upload');
    return false;
  }
  
  console.log('📸 Test de l\'upload de photo...');
  
  // Créer un fichier de test
  const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('photo', testFile);
  
  try {
    const response = await fetch('/api/auth/upload-photo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    
    console.log('📥 Réponse API upload:', {
      status: response.status,
      ok: response.ok,
      result: result
    });
    
    if (response.ok) {
      console.log('✅ API d\'upload fonctionne');
      return true;
    } else {
      console.error('❌ Erreur API upload:', result);
      return false;
    }
  } catch (error) {
    console.error('💥 Erreur lors du test API upload:', error);
    return false;
  }
}

// 6. Vérifier les fonctions globales
function checkGlobalFunctions() {
  console.log('🔧 Vérification des fonctions globales...');
  
  const functions = [
    'refreshProfile',
    'handleSaveProfile',
    'handleUpdateProfile',
    'handleUploadPhoto'
  ];
  
  functions.forEach(funcName => {
    const exists = typeof window[funcName] === 'function';
    console.log(`🔧 ${funcName}:`, exists ? '✅ Présent' : '❌ Absent');
  });
}

// Fonction principale
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic...\n');
  
  const results = {
    auth: !!checkAuth(),
    userData: !!checkUserData(),
    updateAPI: await testUpdateAPI(),
    getAPI: await testGetAPI(),
    photoUpload: await testPhotoUpload(),
  };
  
  checkGlobalFunctions();
  
  console.log('\n📊 Résultats du diagnostic:');
  console.log('🔐 Authentification:', results.auth ? '✅ OK' : '❌ ÉCHEC');
  console.log('👤 Données utilisateur:', results.userData ? '✅ OK' : '❌ ÉCHEC');
  console.log('📝 API mise à jour:', results.updateAPI ? '✅ OK' : '❌ ÉCHEC');
  console.log('👤 API récupération:', results.getAPI ? '✅ OK' : '❌ ÉCHEC');
  console.log('📸 API upload photo:', results.photoUpload ? '✅ OK' : '❌ ÉCHEC');
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Score: ${successCount}/${totalTests} tests réussis`);
  
  if (successCount === totalTests) {
    console.log('🎉 Tous les tests sont passés ! Le problème pourrait être dans l\'interface utilisateur.');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }
  
  return results;
}

// Exposer les fonctions globalement
window.profileDebug = {
  runDiagnostic,
  checkAuth,
  checkUserData,
  testUpdateAPI,
  testGetAPI,
  testPhotoUpload,
  checkGlobalFunctions
};

console.log('🔧 Fonctions de diagnostic disponibles:');
console.log('- window.profileDebug.runDiagnostic() : Lancer tous les tests');
console.log('- window.profileDebug.checkAuth() : Vérifier l\'authentification');
console.log('- window.profileDebug.checkUserData() : Vérifier les données utilisateur');
console.log('- window.profileDebug.testUpdateAPI() : Tester l\'API de mise à jour');
console.log('- window.profileDebug.testGetAPI() : Tester l\'API de récupération');
console.log('- window.profileDebug.testPhotoUpload() : Tester l\'upload de photo');

