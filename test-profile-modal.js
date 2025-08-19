// Script de test pour la modal de modification du profil
console.log('🧪 Test de la modal de modification du profil...');

// 1. Vérifier que la modal s'ouvre
function testModalOpening() {
  console.log('🔍 Test 1: Ouverture de la modal');
  
  // Vérifier que le bouton "Modifier" existe
  const modifyButton = document.querySelector('button[onclick*="handleOpenProfileEdit"]') || 
                      document.querySelector('button:contains("Modifier")');
  
  if (modifyButton) {
    console.log('✅ Bouton "Modifier" trouvé');
    
    // Simuler un clic sur le bouton
    modifyButton.click();
    
    // Vérifier que la modal s'ouvre
    setTimeout(() => {
      const modal = document.querySelector('.fixed.inset-0.flex.items-center.justify-center.z-50');
      if (modal) {
        console.log('✅ Modal ouverte avec succès');
        return true;
      } else {
        console.error('❌ Modal non trouvée après clic');
        return false;
      }
    }, 100);
  } else {
    console.error('❌ Bouton "Modifier" non trouvé');
    return false;
  }
}

// 2. Vérifier les champs de la modal
function testModalFields() {
  console.log('🔍 Test 2: Vérification des champs de la modal');
  
  const modal = document.querySelector('.fixed.inset-0.flex.items-center.justify-center.z-50');
  if (!modal) {
    console.error('❌ Modal non trouvée');
    return false;
  }
  
  const fields = {
    nom: modal.querySelector('input[placeholder="Nom"]'),
    prenom: modal.querySelector('input[placeholder="Prénom"]'),
    telephone: modal.querySelector('input[placeholder*="224"]'),
    adresse: modal.querySelector('textarea[placeholder*="adresse"]'),
    photo: modal.querySelector('input[type="file"]')
  };
  
  let allFieldsPresent = true;
  
  Object.entries(fields).forEach(([name, field]) => {
    if (field) {
      console.log(`✅ Champ ${name} trouvé`);
    } else {
      console.error(`❌ Champ ${name} manquant`);
      allFieldsPresent = false;
    }
  });
  
  return allFieldsPresent;
}

// 3. Tester la saisie dans les champs
function testFieldInput() {
  console.log('🔍 Test 3: Test de saisie dans les champs');
  
  const modal = document.querySelector('.fixed.inset-0.flex.items-center.justify-center.z-50');
  if (!modal) {
    console.error('❌ Modal non trouvée');
    return false;
  }
  
  const testData = {
    nom: 'TestNom',
    prenom: 'TestPrenom',
    telephone: '+224123456789',
    adresse: 'Adresse de test pour la modal'
  };
  
  let allInputsWork = true;
  
  // Tester la saisie dans le champ nom
  const nomField = modal.querySelector('input[placeholder="Nom"]');
  if (nomField) {
    nomField.value = testData.nom;
    nomField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Saisie dans le champ nom réussie');
  } else {
    console.error('❌ Champ nom non trouvé');
    allInputsWork = false;
  }
  
  // Tester la saisie dans le champ prénom
  const prenomField = modal.querySelector('input[placeholder="Prénom"]');
  if (prenomField) {
    prenomField.value = testData.prenom;
    prenomField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Saisie dans le champ prénom réussie');
  } else {
    console.error('❌ Champ prénom non trouvé');
    allInputsWork = false;
  }
  
  // Tester la saisie dans le champ téléphone
  const telephoneField = modal.querySelector('input[placeholder*="224"]');
  if (telephoneField) {
    telephoneField.value = testData.telephone;
    telephoneField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Saisie dans le champ téléphone réussie');
  } else {
    console.error('❌ Champ téléphone non trouvé');
    allInputsWork = false;
  }
  
  // Tester la saisie dans le champ adresse
  const adresseField = modal.querySelector('textarea[placeholder*="adresse"]');
  if (adresseField) {
    adresseField.value = testData.adresse;
    adresseField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Saisie dans le champ adresse réussie');
  } else {
    console.error('❌ Champ adresse non trouvé');
    allInputsWork = false;
  }
  
  return allInputsWork;
}

// 4. Tester la fermeture de la modal
function testModalClosing() {
  console.log('🔍 Test 4: Test de fermeture de la modal');
  
  const modal = document.querySelector('.fixed.inset-0.flex.items-center.justify-center.z-50');
  if (!modal) {
    console.error('❌ Modal non trouvée');
    return false;
  }
  
  // Trouver le bouton de fermeture
  const closeButton = modal.querySelector('button[onclick*="handleCloseProfileEdit"]') ||
                     modal.querySelector('button:contains("Annuler")') ||
                     modal.querySelector('button svg');
  
  if (closeButton) {
    closeButton.click();
    console.log('✅ Bouton de fermeture cliqué');
    
    // Vérifier que la modal se ferme
    setTimeout(() => {
      const modalAfterClose = document.querySelector('.fixed.inset-0.flex.items-center.justify-center.z-50');
      if (!modalAfterClose) {
        console.log('✅ Modal fermée avec succès');
        return true;
      } else {
        console.error('❌ Modal toujours présente après fermeture');
        return false;
      }
    }, 100);
  } else {
    console.error('❌ Bouton de fermeture non trouvé');
    return false;
  }
}

// 5. Vérifier l'affichage des informations en lecture seule
function testReadOnlyDisplay() {
  console.log('🔍 Test 5: Vérification de l\'affichage en lecture seule');
  
  // Vérifier que les informations sont affichées en lecture seule
  const infoSections = document.querySelectorAll('.text-white.text-sm');
  let infoDisplayed = false;
  
  infoSections.forEach(section => {
    if (section.textContent && section.textContent.trim() !== '') {
      console.log('✅ Informations affichées:', section.textContent.trim());
      infoDisplayed = true;
    }
  });
  
  if (infoDisplayed) {
    console.log('✅ Affichage en lecture seule fonctionne');
    return true;
  } else {
    console.error('❌ Aucune information affichée');
    return false;
  }
}

// Fonction principale de test
async function runModalTests() {
  console.log('🚀 Démarrage des tests de la modal...\n');
  
  const results = {
    modalOpening: testModalOpening(),
    modalFields: testModalFields(),
    fieldInput: testFieldInput(),
    modalClosing: testModalClosing(),
    readOnlyDisplay: testReadOnlyDisplay()
  };
  
  // Attendre un peu pour les tests asynchrones
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('\n📊 Résultats des tests:');
  console.log('🔓 Ouverture modal:', results.modalOpening ? '✅ OK' : '❌ ÉCHEC');
  console.log('📝 Champs modal:', results.modalFields ? '✅ OK' : '❌ ÉCHEC');
  console.log('⌨️ Saisie champs:', results.fieldInput ? '✅ OK' : '❌ ÉCHEC');
  console.log('🔒 Fermeture modal:', results.modalClosing ? '✅ OK' : '❌ ÉCHEC');
  console.log('📖 Affichage lecture seule:', results.readOnlyDisplay ? '✅ OK' : '❌ ÉCHEC');
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Score: ${successCount}/${totalTests} tests réussis`);
  
  if (successCount === totalTests) {
    console.log('🎉 Tous les tests de la modal sont passés !');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }
  
  return results;
}

// Exposer les fonctions globalement
window.profileModalTest = {
  runModalTests,
  testModalOpening,
  testModalFields,
  testFieldInput,
  testModalClosing,
  testReadOnlyDisplay
};

console.log('🔧 Tests de la modal disponibles:');
console.log('- window.profileModalTest.runModalTests() : Lancer tous les tests');
console.log('- window.profileModalTest.testModalOpening() : Tester l\'ouverture de la modal');
console.log('- window.profileModalTest.testModalFields() : Vérifier les champs de la modal');
console.log('- window.profileModalTest.testFieldInput() : Tester la saisie dans les champs');
console.log('- window.profileModalTest.testModalClosing() : Tester la fermeture de la modal');
console.log('- window.profileModalTest.testReadOnlyDisplay() : Vérifier l\'affichage en lecture seule');
