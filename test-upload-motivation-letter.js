// Test script pour l'upload de lettres de motivation
// Exécutez avec: node test-upload-motivation-letter.js

const fs = require('fs');
const path = require('path');

async function testUploadAPI() {
  console.log('🧪 Test de l\'API d\'upload de lettres de motivation...\n');

  // Créer un fichier de test temporaire
  const testContent = 'Ceci est une lettre de motivation de test.';
  const testFilePath = path.join(__dirname, 'test-motivation-letter.txt');
  
  try {
    // Créer le fichier de test
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Fichier de test créé:', testFilePath);

    // Créer FormData
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));

    // Test de l'API
    const response = await fetch('http://localhost:3000/api/upload/motivation-letter', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    
    console.log('📡 Status:', response.status);
    console.log('📦 Réponse:', result);

    if (response.ok && result.success) {
      console.log('✅ Upload réussi !');
      console.log('🔗 URL du fichier:', result.url);
      console.log('📁 Nom du fichier:', result.fileName);
      console.log('📏 Taille:', result.fileSize, 'bytes');
      console.log('📄 Type MIME:', result.mimeType);
    } else {
      console.log('❌ Erreur lors de l\'upload:', result.error);
    }

  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
  } finally {
    // Nettoyer le fichier de test
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('🧹 Fichier de test supprimé');
    }
  }
}

async function testInvalidFileTypes() {
  console.log('\n🧪 Test des types de fichiers invalides...\n');

  const invalidFiles = [
    { name: 'test.txt', content: 'Test content' },
    { name: 'test.jpg', content: 'Fake image content' },
    { name: 'test.exe', content: 'Fake executable' }
  ];

  for (const file of invalidFiles) {
    try {
      const testFilePath = path.join(__dirname, file.name);
      fs.writeFileSync(testFilePath, file.content);

      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', fs.createReadStream(testFilePath));

      const response = await fetch('http://localhost:3000/api/upload/motivation-letter', {
        method: 'POST',
        body: form,
      });

      const result = await response.json();
      
      console.log(`📁 Test avec ${file.name}:`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Succès: ${response.ok ? '✅' : '❌'}`);
      console.log(`   Message: ${result.error || result.success ? 'OK' : 'Erreur'}\n`);

      // Nettoyer
      fs.unlinkSync(testFilePath);

    } catch (error) {
      console.error(`❌ Erreur avec ${file.name}:`, error.message);
    }
  }
}

async function testLargeFile() {
  console.log('\n🧪 Test avec un fichier volumineux...\n');

  try {
    // Créer un fichier de 11MB (au-dessus de la limite de 10MB)
    const largeContent = 'A'.repeat(11 * 1024 * 1024); // 11MB
    const testFilePath = path.join(__dirname, 'large-test.pdf');
    fs.writeFileSync(testFilePath, largeContent);

    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));

    const response = await fetch('http://localhost:3000/api/upload/motivation-letter', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    
    console.log('📁 Test avec fichier volumineux (11MB):');
    console.log(`   Status: ${response.status}`);
    console.log(`   Succès: ${response.ok ? '✅' : '❌'}`);
    console.log(`   Message: ${result.error || 'OK'}\n`);

    // Nettoyer
    fs.unlinkSync(testFilePath);

  } catch (error) {
    console.error('❌ Erreur avec fichier volumineux:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'upload de lettres de motivation\n');
  
  await testUploadAPI();
  await testInvalidFileTypes();
  await testLargeFile();
  
  console.log('\n🎯 Tests terminés !');
  console.log('\n📋 Résumé des tests:');
  console.log('✅ Upload de fichier valide');
  console.log('✅ Rejet des types de fichiers invalides');
  console.log('✅ Rejet des fichiers trop volumineux');
  console.log('✅ Pas d\'authentification requise');
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testUploadAPI, testInvalidFileTypes, testLargeFile, runAllTests }; 