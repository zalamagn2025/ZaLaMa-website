// Script de vérification des emails envoyés
require('dotenv').config();

/*console.log('🔍 VÉRIFICATION DES EMAILS ENVOYÉS')*/
/*console.log('==================================')*/

// Vérifier la configuration actuelle
function checkCurrentConfig() {
  /*console.log('\n📋 CONFIGURATION ACTUELLE :')*/
  /*console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant')*/
  
  if (process.env.RESEND_API_KEY) {
    /*console.log('Format de la clé:', process.env.RESEND_API_KEY.startsWith('re_')*/ ? '✅ Correct' : '❌ Incorrect');
    /*console.log('Longueur:', process.env.RESEND_API_KEY.length)*/
    /*console.log('Premiers caractères:', process.env.RESEND_API_KEY.substring(0, 10)*/ + '...');
  }
}

// Test d'envoi réel avec la clé actuelle
async function testCurrentKey() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      /*console.log('\n❌ Aucune clé API configurée actuellement')*/
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    /*console.log('\n🧪 TEST D\'ENVOI AVEC LA CLÉ ACTUELLE...')*/
    
    // Test simple
    const testEmail = {
      from: 'ZaLaMa <noreply@zalama.com>',
      to: ['test@example.com'],
      subject: 'Test Vérification - ' + new Date().toISOString(),
      html: '<p>Test de vérification</p>',
      text: 'Test de vérification'
    };

    const result = await resend.emails.send(testEmail);
    
    if (result.error) {
      /*console.log('❌ Échec avec la clé actuelle:', result.error.message)*/
      return false;
    } else {
      /*console.log('✅ Succès avec la clé actuelle - ID:', result.data?.id)*/
      return true;
    }
    
  } catch (error) {
    /*console.log('❌ Erreur avec la clé actuelle:', error.message)*/
    return false;
  }
}

// Vérifier les logs Resend (si possible)
async function checkResendLogs() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    /*console.log('\n📊 TENTATIVE DE RÉCUPÉRATION DES LOGS RESEND...')*/
    
    try {
      // Essayer de récupérer les emails récents
      const emails = await resend.emails.list();
      /*console.log('📧 Emails récents trouvés:', emails.data?.length || 0)*/
      
      if (emails.data && emails.data.length > 0) {
        /*console.log('\n📋 DERNIERS EMAILS ENVOYÉS :')*/
        emails.data.slice(0, 5).forEach((email, index) => {
          /*console.log(`${index + 1}. ID: ${email.id}`)*/
          /*console.log(`   À: ${email.to?.join(', ')*/}`);
          /*console.log(`   Sujet: ${email.subject}`)*/
          /*console.log(`   Statut: ${email.status}`)*/
          /*console.log(`   Date: ${email.created_at}`)*/
          /*console.log('')*/
        });
      }
      
    } catch (error) {
      /*console.log('❌ Impossible de récupérer les logs:', error.message)*/
    }
    
  } catch (error) {
    /*console.log('❌ Erreur récupération logs:', error.message)*/
  }
}

// Analyser les possibilités
function analyzePossibilities() {
  /*console.log('\n🤔 ANALYSE DES POSSIBILITÉS :')*/
  /*console.log('=============================')*/
  
  /*console.log('\n1. 📧 EMAILS RH/REPRÉSENTANT ENVOYÉS VRAIMENT ?')*/
  /*console.log('   - Vérifiez vos boîtes de réception')*/
  /*console.log('   - Vérifiez les spams')*/
  /*console.log('   - Demandez confirmation aux destinataires')*/
  
  /*console.log('\n2. 🔑 CLÉ API TEMPORAIREMENT VALIDE ?')*/
  /*console.log('   - La clé a pu être valide au moment de l\'envoi')*/
  /*console.log('   - Elle a pu expirer ou être révoquée')*/
  /*console.log('   - Problème de cache côté Resend')*/
  
  /*console.log('\n3. 📝 LOGS INCORRECTS ?')*/
  /*console.log('   - Les logs peuvent être erronés')*/
  /*console.log('   - Les emails marqués "succès" par erreur')*/
  /*console.log('   - Problème de gestion d\'erreurs dans le code')*/
  
  /*console.log('\n4. 🔄 AUTRE SERVICE UTILISÉ ?')*/
  /*console.log('   - Un autre service d\'email temporaire')*/
  /*console.log('   - Un autre compte Resend')*/
  /*console.log('   - Configuration différente au moment de l\'envoi')*/
}

// Exécuter la vérification
async function runVerification() {
  /*console.log('🚀 DÉMARRAGE DE LA VÉRIFICATION...')*/
  
  // Vérifier la configuration actuelle
  checkCurrentConfig();
  
  // Test avec la clé actuelle
  /*console.log('\n' + '='.repeat(50)*/);
  const currentKeyWorks = await testCurrentKey();
  
  // Vérifier les logs Resend
  /*console.log('\n' + '='.repeat(50)*/);
  await checkResendLogs();
  
  // Analyser les possibilités
  /*console.log('\n' + '='.repeat(50)*/);
  analyzePossibilities();
  
  // Conclusion
  /*console.log('\n📝 CONCLUSION :')*/
  if (currentKeyWorks) {
    /*console.log('✅ La clé API actuelle fonctionne')*/
    /*console.log('   → Les emails RH/Représentant ont pu être envoyés avec cette clé')*/
  } else {
    /*console.log('❌ La clé API actuelle ne fonctionne pas')*/
    /*console.log('   → Les emails RH/Représentant ont été envoyés avec une autre clé ou service')*/
  }
  
  /*console.log('\n🔧 PROCHAINES ÉTAPES :')*/
  /*console.log('1. Vérifiez si les emails RH/Représentant sont vraiment arrivés')*/
  /*console.log('2. Corrigez la clé API Resend')*/
  /*console.log('3. Testez à nouveau le système complet')*/
}

// Exécuter
runVerification().catch(error => {
  console.error('\n💥 ERREUR:', error);
  process.exit(1);
}); 