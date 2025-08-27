/**
 * Script de test pour l'Edge Function upload-logo
 * 
 * Usage:
 * node test-upload-logo.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/upload-logo';

// Créer un fichier de test (image PNG simple)
function createTestImage() {
  // Image PNG 1x1 pixel transparente en base64
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  const buffer = Buffer.from(pngBase64, 'base64');
  const testFilePath = path.join(__dirname, 'test-logo.png');
  
  fs.writeFileSync(testFilePath, buffer);
  console.log('✅ Fichier de test créé:', testFilePath);
  
  return testFilePath;
}

// Test d'upload
async function testUpload(filePath) {
  try {
    console.log('🚀 Test d\'upload...');
    
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
    console.log('📥 Réponse upload:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Upload réussi!');
      console.log('📁 Nom du fichier:', result.data.fileName);
      console.log('🔗 URL publique:', result.data.publicUrl);
      return result.data.fileName;
    } else {
      console.log('❌ Upload échoué:', result.error);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'upload:', error.message);
    return null;
  }
}

// Test de suppression
async function testDelete(fileName) {
  if (!fileName) {
    console.log('⚠️ Pas de fichier à supprimer');
    return;
  }
  
  try {
    console.log('🗑️ Test de suppression...');
    
    const url = `${EDGE_FUNCTION_URL}?fileName=${encodeURIComponent(fileName)}`;
    
    const response = await fetch(url, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    console.log('📥 Réponse suppression:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Suppression réussie!');
    } else {
      console.log('❌ Suppression échouée:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de suppression:', error.message);
  }
}

// Test de validation
async function testValidation() {
  console.log('🔍 Test de validation...');
  
  // Test avec un fichier texte (type non autorisé)
  try {
    const FormData = require('form-data');
    const form = new FormData();
    
    // Créer un fichier texte temporaire
    const textFilePath = path.join(__dirname, 'test.txt');
    fs.writeFileSync(textFilePath, 'Ceci est un fichier texte');
    
    form.append('file', fs.createReadStream(textFilePath), {
      filename: 'test.txt',
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
    console.log('📥 Réponse validation (fichier texte):', JSON.stringify(result, null, 2));
    
    // Nettoyer
    fs.unlinkSync(textFilePath);
    
  } catch (error) {
    console.error('❌ Erreur lors du test de validation:', error.message);
  }
}

// Test sans fichier
async function testNoFile() {
  console.log('🔍 Test sans fichier...');
  
  try {
    const FormData = require('form-data');
    const form = new FormData();
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });
    
    const result = await response.json();
    console.log('📥 Réponse sans fichier:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur lors du test sans fichier:', error.message);
  }
}

// Test de méthode non autorisée
async function testInvalidMethod() {
  console.log('🔍 Test méthode non autorisée...');
  
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'PUT'
    });
    
    const result = await response.json();
    console.log('📥 Réponse méthode PUT:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur lors du test de méthode:', error.message);
  }
}

// Fonction principale
async function runTests() {
  console.log('🧪 Démarrage des tests pour l\'Edge Function upload-logo\n');
  
  // Test 1: Validation
  await testValidation();
  console.log('');
  
  // Test 2: Sans fichier
  await testNoFile();
  console.log('');
  
  // Test 3: Méthode non autorisée
  await testInvalidMethod();
  console.log('');
  
  // Test 4: Upload et suppression
  const testFilePath = createTestImage();
  const fileName = await testUpload(testFilePath);
  console.log('');
  
  if (fileName) {
    await testDelete(fileName);
  }
  
  // Nettoyer
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
    console.log('🧹 Fichier de test supprimé');
  }
  
  console.log('\n✅ Tests terminés!');
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testUpload,
  testDelete,
  testValidation,
  testNoFile,
  testInvalidMethod,
  runTests
};

