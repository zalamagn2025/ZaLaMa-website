const fetch = require('node-fetch').default;

async function testSpecificLink() {
  const specificUrl = 'https://www.zalamagn.com/auth/reset-password?token=72aff606-a096-4509-aea9-ae4f095919e7-1753978840564&email=mamadoubayoula24%40gmail.com';
  
  /*console.log('🔍 Test du lien spécifique reçu')*/
  /*console.log('📍 URL:', specificUrl)*/
  /*console.log('---')*/

  try {
    /*console.log('1️⃣ Test d\'accessibilité de la page...')*/
    const pageResponse = await fetch(specificUrl);
    
    /*console.log(`📄 Statut de la page: ${pageResponse.status}`)*/
    /*console.log(`📄 Type de contenu: ${pageResponse.headers.get('content-type')*/}`);
    
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      /*console.log('✅ Page accessible')*/
      
      // Vérifier si c'est la bonne page
      if (html.includes('reset-password') || html.includes('Réinitialisation')) {
        /*console.log('✅ Page de réinitialisation détectée')*/
      } else if (html.includes('changement') || html.includes('change-password')) {
        /*console.log('⚠️  Page de changement de mot de passe détectée (pas de réinitialisation)*/');
      } else {
        /*console.log('❓ Type de page non identifié')*/
      }
    } else {
      /*console.log('❌ Page non accessible')*/
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }

  /*console.log('---')*/
  /*console.log('💡 Solutions possibles :')*/
  /*console.log('1. Déployer le site en production')*/
  /*console.log('2. Vérifier que la page /auth/reset-password existe sur le serveur')*/
  /*console.log('3. Vérifier la configuration des routes Next.js')*/
  /*console.log('4. Tester avec le domaine sans www : https://zalamagn.com')*/
}

testSpecificLink(); 