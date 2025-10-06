// Script de diagnostic avancé pour les emails
require('dotenv').config();

/*console.log('🔍 DIAGNOSTIC AVANCÉ - EMAILS ZALAMA')*/
/*console.log('=====================================')*/

// Vérifier la configuration
function checkConfiguration() {
  /*console.log('\n📋 VÉRIFICATION DE LA CONFIGURATION :')*/
  
  const config = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@zalama.com',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@zalamagn.com'
  };
  
  /*console.log('RESEND_API_KEY:', config.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant')*/
  /*console.log('EMAIL_FROM:', config.EMAIL_FROM)*/
  /*console.log('ADMIN_EMAIL:', config.ADMIN_EMAIL)*/
  
  if (config.RESEND_API_KEY) {
    /*console.log('Longueur de la clé:', config.RESEND_API_KEY.length)*/
    /*console.log('Format de la clé:', config.RESEND_API_KEY.startsWith('re_')*/ ? '✅ Correct' : '❌ Incorrect');
  }
  
  return config;
}

// Test direct avec Resend
async function testResendConnection() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      /*console.log('\n❌ RESEND_API_KEY manquante')*/
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    /*console.log('\n🔗 Test de connexion Resend...')*/
    
    // Test simple d'envoi
    const testEmail = {
      from: 'ZaLaMa <noreply@zalama.com>',
      to: ['test@example.com'],
      subject: 'Test Diagnostic ZaLaMa',
      html: '<p>Test de diagnostic</p>',
      text: 'Test de diagnostic'
    };

    const result = await resend.emails.send(testEmail);
    
    if (result.error) {
      /*console.log('❌ Erreur Resend:', result.error)*/
      return false;
    } else {
      /*console.log('✅ Connexion Resend réussie')*/
      /*console.log('ID Email:', result.data?.id)*/
      return true;
    }
    
  } catch (error) {
    /*console.log('\n❌ ERREUR Connexion Resend:', error.message)*/
    return false;
  }
}

// Test avec des emails valides
async function testWithValidEmails() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    /*console.log('\n📧 Test avec emails valides...')*/
    
    // Emails de test valides (remplacer par vos vrais emails)
    const testEmails = [
      'contact@zalamagn.com',
      'tresormoneygn@gmail.com' // Email de test
    ];
    
    for (const email of testEmails) {
      try {
        const testEmail = {
          from: 'ZaLaMa <noreply@zalama.com>',
          to: [email],
          subject: `Test Diagnostic - ${new Date().toLocaleString()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #3B82F6;">Test Diagnostic ZaLaMa</h2>
              <p>Ceci est un test de diagnostic pour vérifier l'envoi d'emails.</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
              <p><strong>Email testé:</strong> ${email}</p>
            </div>
          `,
          text: `Test Diagnostic ZaLaMa - ${email} - ${new Date().toLocaleString('fr-FR')}`
        };

        const result = await resend.emails.send(testEmail);
        
        if (result.error) {
          /*console.log(`❌ Échec pour ${email}:`, result.error.message)*/
        } else {
          /*console.log(`✅ Succès pour ${email} - ID: ${result.data?.id}`)*/
        }
        
      } catch (error) {
        /*console.log(`❌ Erreur pour ${email}:`, error.message)*/
      }
    }
    
  } catch (error) {
    /*console.log('\n❌ ERREUR Test emails valides:', error.message)*/
  }
}

// Vérifier les domaines Resend
async function checkResendDomains() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    /*console.log('\n🌐 Vérification des domaines Resend...')*/
    
    try {
      const domains = await resend.domains.list();
      /*console.log('📧 Domaines configurés:', domains.data?.length || 0)*/
      
      if (domains.data && domains.data.length > 0) {
        domains.data.forEach(domain => {
          /*console.log(`  - ${domain.name} (${domain.status})*/`);
        });
      } else {
        /*console.log('  ❌ Aucun domaine configuré')*/
      }
      
    } catch (error) {
      /*console.log('❌ Erreur récupération domaines:', error.message)*/
    }
    
  } catch (error) {
    /*console.log('\n❌ ERREUR Vérification domaines:', error.message)*/
  }
}

// Exécuter tous les diagnostics
async function runDiagnostics() {
  /*console.log('🚀 DÉMARRAGE DES DIAGNOSTICS...')*/
  
  // Vérifier la configuration
  const config = checkConfiguration();
  
  if (!config.RESEND_API_KEY) {
    /*console.log('\n❌ Configuration incomplète. Arrêt des diagnostics.')*/
    return;
  }
  
  // Test connexion Resend
  /*console.log('\n' + '='.repeat(50)*/);
  const resendOk = await testResendConnection();
  
  // Vérifier les domaines
  /*console.log('\n' + '='.repeat(50)*/);
  await checkResendDomains();
  
  // Test avec emails valides
  if (resendOk) {
    /*console.log('\n' + '='.repeat(50)*/);
    await testWithValidEmails();
  }
  
  // Recommandations
  /*console.log('\n📝 RECOMMANDATIONS :')*/
  
  if (!config.RESEND_API_KEY.startsWith('re_')) {
    /*console.log('❌ Clé API Resend invalide')*/
    /*console.log('   - Obtenez une nouvelle clé depuis https://resend.com/api-keys')*/
    /*console.log('   - La clé doit commencer par "re_"')*/
  }
  
  if (!resendOk) {
    /*console.log('❌ Problème de connexion Resend')*/
    /*console.log('   - Vérifiez votre clé API')*/
    /*console.log('   - Vérifiez votre compte Resend')*/
  }
  
  /*console.log('\n🔧 Étapes de résolution :')*/
  /*console.log('1. Vérifiez votre clé API Resend')*/
  /*console.log('2. Configurez le domaine zalama.com dans Resend')*/
  /*console.log('3. Testez avec des emails valides')*/
  /*console.log('4. Vérifiez les spams')*/
}

// Exécuter les diagnostics
runDiagnostics().catch(error => {
  console.error('\n💥 ERREUR CRITIQUE:', error);
  process.exit(1);
}); 