// Script de test pour le flux update-password
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/*console.log('🧪 Test du flux update-password')*/
/*console.log('================================')*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUpdatePasswordFlow() {
  try {
    // 1. Vérifier la configuration
    /*console.log('\n🔧 Test 1: Vérification de la configuration')*/
    /*console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')*/
    /*console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌')*/
    /*console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)*/

    // 2. Test de connexion Supabase
    /*console.log('\n🔗 Test 2: Test de connexion Supabase')*/
    const { data, error } = await supabase
      .from('employees')
      .select('count')
      .limit(1);
    
    if (error) {
      /*console.log('❌ Erreur connexion Supabase:', error.message)*/
      return;
    }
    /*console.log('✅ Connexion Supabase réussie')*/

    // 3. Test de l'API forgot-password
    /*console.log('\n🌐 Test 3: Test de l\'API forgot-password')*/
    const testEmail = 'test@example.com';
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail
        })
      });
      
      const data = await response.json();
      
      /*console.log('📊 Réponse API:')*/
      /*console.log(`   - Status: ${response.status}`)*/
      /*console.log(`   - Success: ${data.success}`)*/
      /*console.log(`   - Message: ${data.message || data.error}`)*/
      
      if (response.ok && data.success) {
        /*console.log('✅ API forgot-password fonctionne')*/
      } else {
        /*console.log('❌ Erreur API forgot-password')*/
      }
    } catch (error) {
      /*console.log('❌ Erreur test API:', error.message)*/
      /*console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)*/');
    }

    // 4. Simulation du flux complet
    /*console.log('\n🔄 Test 4: Simulation du flux complet')*/
    /*console.log('📋 Étapes du flux:')*/
    /*console.log('1. Utilisateur clique sur "Mot de passe oublié"')*/
    /*console.log('2. Email de réinitialisation envoyé')*/
    /*console.log('3. Utilisateur clique sur le lien dans l\'email')*/
    /*console.log('4. Redirection vers /update-password avec token')*/
    /*console.log('5. Page traite automatiquement le token')*/
    /*console.log('6. Formulaire de nouveau mot de passe affiché')*/
    /*console.log('7. Utilisateur soumet le nouveau mot de passe')*/
    /*console.log('8. Redirection vers /login avec message de succès')*/

    // 5. URLs de configuration
    /*console.log('\n🔗 Test 5: URLs de configuration')*/
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    /*console.log('📋 URLs à configurer dans Supabase Dashboard:')*/
    /*console.log('   Authentication → URL Configuration')*/
    /*console.log('   Site URL:', appUrl)*/
    /*console.log('   Redirect URLs:')*/
    /*console.log(`     - ${appUrl}/update-password`)*/
    /*console.log(`     - ${appUrl}/reset-password`)*/
    /*console.log(`     - http://localhost:3000/update-password`)*/
    /*console.log(`     - http://localhost:3000/reset-password`)*/

    // 6. Test de la page update-password
    /*console.log('\n📄 Test 6: Test de la page update-password')*/
    /*console.log('🌐 URL de test: http://localhost:3000/update-password')*/
    /*console.log('📝 Pour tester avec un token:')*/
    /*console.log('   http://localhost:3000/update-password#access_token=test&type=recovery')*/

    // 7. Diagnostic de l'erreur actuelle
    /*console.log('\n🚨 Test 7: Diagnostic de l\'erreur actuelle')*/
    /*console.log('🔍 URL reçue:', 'http://localhost:3000/#access_token=...&type=recovery')*/
    /*console.log('📋 Analyse:')*/
    /*console.log('   ✅ Token présent dans l\'URL')*/
    /*console.log('   ✅ Type=recovery correct')*/
    /*console.log('   ✅ Hash format correct')*/
    /*console.log('   ⚠️  URL pointe vers /# au lieu de /update-password#')*/
    
    /*console.log('\n🛠️ Solution:')*/
    /*console.log('1. Vérifiez que l\'URL de redirection dans Supabase pointe vers /update-password')*/
    /*console.log('2. Assurez-vous que la page /update-password existe')*/
    /*console.log('3. Testez avec un nouvel email de réinitialisation')*/

    /*console.log('\n✅ Test terminé !')*/
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Fonction pour tester la page directement
async function testPageDirectly() {
  /*console.log('\n🧪 Test direct de la page update-password')*/
  
  try {
    const response = await fetch('http://localhost:3000/update-password');
    /*console.log('📊 Status de la page:', response.status)*/
    
    if (response.ok) {
      /*console.log('✅ Page update-password accessible')*/
    } else {
      /*console.log('❌ Page update-password non accessible')*/
    }
  } catch (error) {
    /*console.log('❌ Erreur accès page:', error.message)*/
    /*console.log('💡 Assurez-vous que le serveur Next.js est démarré')*/
  }
}

// Exécution des tests
if (require.main === module) {
  testUpdatePasswordFlow().then(() => {
    return testPageDirectly();
  }).then(() => {
    /*console.log('\n🎯 Tests terminés !')*/
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  });
}

module.exports = { testUpdatePasswordFlow, testPageDirectly }; 