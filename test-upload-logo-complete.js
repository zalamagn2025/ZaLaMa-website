/**
 * Script de test complet pour l'Edge Function upload-logo
 * Teste l'upload, la suppression et la validation
 */

const fs = require('fs');
const path = require('path');

// Configuration
const EDGE_FUNCTION_URL = 'https://hbwwbfmwwimsdfhxppwd.supabase.co/functions/v1/upload-logo';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Créer un fichier de test (image PNG simple)
function createTestImage() {
  try {
    // Image PNG 1x1 pixel transparente en base64
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const buffer = Buffer.from(pngBase64, 'base64');
    const testFilePath = path.join(__dirname, 'test-logo.png');
    
    fs.writeFileSync(testFilePath, buffer);
    log('✅ Fichier de test créé: test-logo.png', 'green');
    
    return testFilePath;
  } catch (error) {
    log(`❌ Erreur création fichier de test: ${error.message}`, 'red');
    return null;
  }
}

// Test d'upload
async function testUpload(filePath) {
  try {
    log('🚀 Test d\'upload...', 'blue');
    
    const FormData = require('form-data');
    const form = new FormData();
    
    form.append('file', fs.createReadStream(filePath), {
      filename: 'test-logo.png',
      contentType: 'image/png'
    });
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });
    
    const result = await response.json();
    
    log('📥 Réponse upload:', 'cyan');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      log('✅ Upload réussi!', 'green');
      log(`📁 Nom du fichier: ${result.data.fileName}`, 'green');
      log(`🔗 URL publique: ${result.data.publicUrl}`, 'green');
      log(`📏 Taille: ${(result.data.fileSize / 1024).toFixed(2)} KB`, 'green');
      log(`📄 Type: ${result.data.fileType}`, 'green');
      return result.data.fileName;
    } else {
      log(`❌ Upload échoué: ${result.error}`, 'red');
      if (result.details) {
        log(`📋 Détails: ${result.details}`, 'yellow');
      }
      return null;
    }
    
  } catch (error) {
    log(`❌ Erreur lors du test d'upload: ${error.message}`, 'red');
    return null;
  }
}

// Test de suppression
async function testDelete(fileName) {
  if (!fileName) {
    log('⚠️ Pas de fichier à supprimer', 'yellow');
    return false;
  }
  
  try {
    log('🗑️ Test de suppression...', 'blue');
    
    const url = `${EDGE_FUNCTION_URL}?fileName=${encodeURIComponent(fileName)}`;
    
    const response = await fetch(url, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    log('📥 Réponse suppression:', 'cyan');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      log('✅ Suppression réussie!', 'green');
      log(`🗑️ Fichier supprimé: ${result.data.fileName}`, 'green');
      return true;
    } else {
      log(`❌ Suppression échouée: ${result.error}`, 'red');
      if (result.details) {
        log(`📋 Détails: ${result.details}`, 'yellow');
      }
      return false;
    }
    
  } catch (error) {
    log(`❌ Erreur lors du test de suppression: ${error.message}`, 'red');
    return false;
  }
}

// Test de validation (fichier invalide)
async function testValidation() {
  try {
    log('🔍 Test de validation (fichier invalide)...', 'blue');
    
    // Créer un fichier texte (type invalide)
    const invalidFilePath = path.join(__dirname, 'test-invalid.txt');
    fs.writeFileSync(invalidFilePath, 'Ceci est un fichier texte invalide');
    
    const FormData = require('form-data');
    const form = new FormData();
    
    form.append('file', fs.createReadStream(invalidFilePath), {
      filename: 'test-invalid.txt',
      contentType: 'text/plain'
    });
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });
    
    const result = await response.json();
    
    log('📥 Réponse validation:', 'cyan');
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success) {
      log('✅ Validation fonctionne correctement (rejet du fichier invalide)', 'green');
    } else {
      log('❌ Validation échouée (fichier invalide accepté)', 'red');
    }
    
    // Nettoyer
    if (fs.existsSync(invalidFilePath)) {
      fs.unlinkSync(invalidFilePath);
    }
    
    return !result.success;
    
  } catch (error) {
    log(`❌ Erreur lors du test de validation: ${error.message}`, 'red');
    return false;
  }
}

// Test sans fichier
async function testNoFile() {
  try {
    log('🔍 Test sans fichier...', 'blue');
    
    const FormData = require('form-data');
    const form = new FormData();
    
    // Ne pas ajouter de fichier
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });
    
    const result = await response.json();
    
    log('📥 Réponse test sans fichier:', 'cyan');
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success) {
      log('✅ Test sans fichier fonctionne correctement', 'green');
    } else {
      log('❌ Test sans fichier échoué', 'red');
    }
    
    return !result.success;
    
  } catch (error) {
    log(`❌ Erreur lors du test sans fichier: ${error.message}`, 'red');
    return false;
  }
}

// Test méthode HTTP invalide
async function testInvalidMethod() {
  try {
    log('🔍 Test méthode HTTP invalide (GET)...', 'blue');
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'GET'
    });
    
    const result = await response.json();
    
    log('📥 Réponse méthode invalide:', 'cyan');
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success && response.status === 405) {
      log('✅ Test méthode invalide fonctionne correctement', 'green');
    } else {
      log('❌ Test méthode invalide échoué', 'red');
    }
    
    return !result.success && response.status === 405;
    
  } catch (error) {
    log(`❌ Erreur lors du test méthode invalide: ${error.message}`, 'red');
    return false;
  }
}

// Fonction principale
async function runTests() {
  log('🧪 Démarrage des tests pour l\'Edge Function upload-logo', 'bright');
  log('=' .repeat(60), 'cyan');
  
  let testsPassed = 0;
  let totalTests = 0;
  
  // Test 1: Upload et suppression
  log('\n📋 Test 1: Upload et suppression', 'bright');
  totalTests++;
  const testFilePath = createTestImage();
  if (testFilePath) {
    const fileName = await testUpload(testFilePath);
    if (fileName) {
      const deleteSuccess = await testDelete(fileName);
      if (deleteSuccess) {
        testsPassed++;
        log('✅ Test 1 réussi', 'green');
      }
    }
  }
  
  // Test 2: Validation fichier invalide
  log('\n📋 Test 2: Validation fichier invalide', 'bright');
  totalTests++;
  const validationSuccess = await testValidation();
  if (validationSuccess) {
    testsPassed++;
    log('✅ Test 2 réussi', 'green');
  }
  
  // Test 3: Test sans fichier
  log('\n📋 Test 3: Test sans fichier', 'bright');
  totalTests++;
  const noFileSuccess = await testNoFile();
  if (noFileSuccess) {
    testsPassed++;
    log('✅ Test 3 réussi', 'green');
  }
  
  // Test 4: Méthode HTTP invalide
  log('\n📋 Test 4: Méthode HTTP invalide', 'bright');
  totalTests++;
  const invalidMethodSuccess = await testInvalidMethod();
  if (invalidMethodSuccess) {
    testsPassed++;
    log('✅ Test 4 réussi', 'green');
  }
  
  // Résumé
  log('\n' + '=' .repeat(60), 'cyan');
  log('📊 Résumé des tests:', 'bright');
  log(`✅ Tests réussis: ${testsPassed}/${totalTests}`, testsPassed === totalTests ? 'green' : 'yellow');
  
  if (testsPassed === totalTests) {
    log('🎉 Tous les tests sont passés avec succès!', 'green');
  } else {
    log('⚠️ Certains tests ont échoué', 'yellow');
  }
  
  // Nettoyer
  if (testFilePath && fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
    log('🧹 Fichier de test supprimé', 'cyan');
  }
  
  log('\n✅ Tests terminés!', 'green');
}

// Vérifier les dépendances
function checkDependencies() {
  try {
    require('form-data');
    log('✅ Dépendance form-data disponible', 'green');
    return true;
  } catch (error) {
    log('❌ Dépendance form-data manquante', 'red');
    log('💡 Installez-la avec: npm install form-data', 'yellow');
    return false;
  }
}

// Exécuter les tests
if (checkDependencies()) {
  runTests().catch(error => {
    log(`❌ Erreur fatale: ${error.message}`, 'red');
    process.exit(1);
  });
} else {
  log('❌ Impossible de continuer sans les dépendances', 'red');
  process.exit(1);
}

