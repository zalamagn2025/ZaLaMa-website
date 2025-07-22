// Test script pour vérifier la fonctionnalité de mot de passe oublié
console.log('Test script loaded');

// Simuler un clic sur le bouton
function testForgotPasswordButton() {
  console.log('Testing forgot password button...');
  
  // Chercher le bouton
  const button = document.querySelector('button[onclick*="switchToForgotPassword"]') || 
                 document.querySelector('button:contains("Mot de passe oublié")');
  
  if (button) {
    console.log('Button found:', button);
    button.click();
  } else {
    console.log('Button not found');
    // Lister tous les boutons pour debug
    const allButtons = document.querySelectorAll('button');
    console.log('All buttons:', allButtons);
  }
}

// Exécuter le test après 2 secondes
setTimeout(testForgotPasswordButton, 2000); 