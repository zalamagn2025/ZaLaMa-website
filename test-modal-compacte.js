// Test de la modal compacte de modification du profil
console.log('🧪 Test de la modal compacte de modification du profil...');

// Fonction de test complète
function testModalCompacte() {
  console.log('🔍 Début du test de la modal compacte...');
  
  // 1. Vérifier que le bouton "Modifier" existe
  const boutonModifier = document.querySelector('button:contains("Modifier")') || 
                        document.querySelector('button[onclick*="handleOpenProfileEdit"]');
  
  if (!boutonModifier) {
    console.error('❌ Bouton "Modifier" non trouvé');
    return false;
  }
  
  console.log('✅ Bouton "Modifier" trouvé');
  
  // 2. Cliquer sur le bouton pour ouvrir la modal
  boutonModifier.click();
  console.log('🖱️ Clic sur "Modifier" effectué');
  
  // 3. Attendre que la modal s'ouvre
  setTimeout(() => {
    const modal = document.querySelector('.fixed.inset-0.flex.items-center.justify-center.z-50');
    
    if (!modal) {
      console.error('❌ Modal non trouvée après le clic');
      return false;
    }
    
    console.log('✅ Modal ouverte avec succès');
    
    // 4. Vérifier la taille de la modal (doit être compacte)
    const modalContent = modal.querySelector('.max-w-xs');
    if (modalContent) {
      console.log('✅ Modal compacte détectée (max-w-xs)');
    } else {
      console.warn('⚠️ Modal peut ne pas être assez compacte');
    }
    
    // 5. Vérifier les champs de saisie
    const inputs = modal.querySelectorAll('input, textarea');
    console.log(`✅ ${inputs.length} champs de saisie trouvés`);
    
    // 6. Vérifier les boutons
    const boutons = modal.querySelectorAll('button');
    console.log(`✅ ${boutons.length} boutons trouvés`);
    
    // 7. Vérifier la section photo
    const sectionPhoto = modal.querySelector('label:contains("Photo de profil")');
    if (sectionPhoto) {
      console.log('✅ Section photo de profil trouvée');
    }
    
    // 8. Tester la fermeture de la modal
    const boutonFermer = modal.querySelector('button[aria-label="Fermer le formulaire"]');
    if (boutonFermer) {
      console.log('✅ Bouton de fermeture trouvé');
      
      // Fermer la modal
      boutonFermer.click();
      console.log('🖱️ Modal fermée');
    }
    
    console.log('🎉 Test de la modal compacte terminé avec succès !');
    return true;
    
  }, 500);
}

// Fonction de test rapide
function testRapideModal() {
  console.log('⚡ Test rapide de la modal...');
  
  // Vérifier que le bouton existe
  const bouton = document.querySelector('button:contains("Modifier")');
  if (bouton) {
    console.log('✅ Bouton "Modifier" trouvé - Test réussi !');
    return true;
  } else {
    console.error('❌ Bouton "Modifier" non trouvé');
    return false;
  }
}

// Exposer les fonctions globalement
window.testModalCompacte = testModalCompacte;
window.testRapideModal = testRapideModal;

// Auto-exécution du test rapide
console.log('🚀 Exécution automatique du test rapide...');
testRapideModal();

console.log('📋 Commandes disponibles :');
console.log('- window.testModalCompacte() : Test complet de la modal');
console.log('- window.testRapideModal() : Test rapide');
