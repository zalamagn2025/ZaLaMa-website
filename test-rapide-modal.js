// Test rapide de la modal de modification du profil
console.log('⚡ Test rapide de la modal...');

// Fonction de test rapide
function testRapideModal() {
  console.log('🔍 Vérification rapide...');
  
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
      console.error('❌ Modal non ouverte');
      return false;
    }
    
    console.log('✅ Modal ouverte avec succès');
    
    // 4. Vérifier les champs principaux
    const champs = {
      nom: modal.querySelector('input[placeholder="Nom"]'),
      prenom: modal.querySelector('input[placeholder="Prénom"]'),
      telephone: modal.querySelector('input[placeholder*="224"]'),
      adresse: modal.querySelector('textarea'),
      photo: modal.querySelector('input[type="file"]')
    };
    
    let champsOk = true;
    Object.entries(champs).forEach(([nom, champ]) => {
      if (champ) {
        console.log(`✅ Champ ${nom} trouvé`);
      } else {
        console.error(`❌ Champ ${nom} manquant`);
        champsOk = false;
      }
    });
    
    if (champsOk) {
      console.log('🎉 Tous les champs sont présents !');
      
      // 5. Fermer la modal
      const boutonFermer = modal.querySelector('button svg') || 
                          modal.querySelector('button:contains("Annuler")');
      
      if (boutonFermer) {
        boutonFermer.click();
        console.log('✅ Modal fermée');
      }
      
      console.log('🎯 Test rapide réussi ! La modal fonctionne correctement.');
      return true;
    } else {
      console.error('❌ Certains champs sont manquants');
      return false;
    }
  }, 200);
}

// Exposer la fonction globalement
window.testRapideModal = testRapideModal;

console.log('🔧 Test rapide disponible:');
console.log('- window.testRapideModal() : Lancer le test rapide');

// Lancer automatiquement le test
setTimeout(() => {
  console.log('🚀 Lancement automatique du test rapide...');
  testRapideModal();
}, 1000);
