const fetch = require('node-fetch').default;

async function testPasswordReset() {
  const testEmail = 'mamadoubayoula24@gmail.com';
  const baseUrl = 'https://zalamagn.com';
  
  console.log('🧪 Test du système de réinitialisation de mot de passe');
  console.log('📍 Domaine de production:', baseUrl);
  console.log('📧 Email de test:', testEmail);
  console.log('---');

  try {
    // 1. Tester l'API de demande de réinitialisation
    console.log('1️⃣ Demande de réinitialisation...');
    const resetResponse = await fetch(`${baseUrl}/api/auth/send-reset-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail })
    });

    const resetData = await resetResponse.json();
    
    if (resetResponse.ok) {
      console.log('✅ Demande envoyée avec succès');
      console.log('📝 Réponse:', resetData.message);
    } else {
      console.log('❌ Erreur lors de la demande');
      console.log('📝 Erreur:', resetData.error);
    }

    console.log('---');
    console.log('📋 Instructions pour tester :');
    console.log('1. Vérifiez votre email (spam inclus)');
    console.log('2. Cliquez sur le lien de réinitialisation');
    console.log('3. Le lien devrait vous rediriger vers :');
    console.log(`   ${baseUrl}/auth/reset-password?token=...&email=${testEmail}`);
    console.log('4. Testez la réinitialisation du mot de passe');

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('💡 Assurez-vous que le site est déployé et accessible');
  }
}

// Exécuter le test
testPasswordReset(); 