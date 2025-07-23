// Test d'intégration Resend pour ZaLaMa
const { Resend } = require('resend');

// Configuration
const resend = new Resend(process.env.RESEND_API_KEY);
const testEmail = 'test@example.com';

console.log('🧪 Test d\'intégration Resend pour ZaLaMa');
console.log('==========================================');

// Test 1: Vérification de la configuration
function testConfiguration() {
  console.log('\n🔧 Test 1: Vérification de la configuration');
  
  const requiredVars = [
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Variables d\'environnement manquantes:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ Toutes les variables d\'environnement sont définies');
  console.log('📧 Configuration Resend:');
  console.log(`   - API Key: ${process.env.RESEND_API_KEY ? '✅ Configurée' : '❌ Manquante'}`);
  console.log(`   - Domaine: zalamagn.com`);
  console.log(`   - From: ZaLaMa <noreply@zalamagn.com>`);
  
  return true;
}

// Test 2: Test de connexion Resend
async function testResendConnection() {
  console.log('\n🔗 Test 2: Test de connexion Resend');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'ZaLaMa <noreply@zalamagn.com>',
      to: [testEmail],
      subject: 'Test de connexion ZaLaMa - Resend',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF671E;">Test de connexion Resend</h1>
          <p>Si vous recevez cet email, la configuration Resend fonctionne correctement.</p>
          <p><strong>ZaLaMa</strong> - Votre partenaire financier de confiance</p>
        </div>
      `,
      text: 'Test de connexion Resend - Si vous recevez cet email, la configuration fonctionne.'
    });

    if (error) {
      console.log('❌ Erreur test de connexion Resend:', error);
      return false;
    }

    console.log('✅ Test de connexion Resend réussi:', {
      messageId: data?.id,
      to: testEmail,
      subject: 'Test de connexion ZaLaMa - Resend'
    });
    
    return true;
  } catch (error) {
    console.log('❌ Erreur test de connexion Resend:', error.message);
    return false;
  }
}

// Test 3: Test du service email personnalisé
async function testEmailService() {
  console.log('\n📧 Test 3: Test du service email personnalisé');
  
  try {
    // Importer le service email
    const { resendEmailService } = require('./src/services/resendEmailService');
    
    // Test de configuration
    const config = resendEmailService.getConfiguration();
    console.log('📋 Configuration du service:');
    console.log(`   - From Email: ${config.fromEmail}`);
    console.log(`   - From Name: ${config.fromName}`);
    console.log(`   - API Key: ${config.apiKeyConfigured ? '✅ Configurée' : '❌ Manquante'}`);
    console.log(`   - Domain: ${config.domain}`);
    
    // Test d'envoi d'email
    const resetLink = 'https://example.com/reset?token=test-token-123';
    const result = await resendEmailService.sendForgotPasswordEmail(
      testEmail,
      resetLink,
      'John Doe'
    );
    
    if (result.success) {
      console.log('✅ Service email fonctionne correctement:', {
        messageId: result.messageId,
        to: testEmail
      });
    } else {
      console.log('❌ Erreur service email:', result.error);
    }
    
    return result.success;
  } catch (error) {
    console.log('❌ Erreur test service email:', error.message);
    return false;
  }
}

// Test 4: Test de l'API send-reset-email
async function testAPIEndpoint() {
  console.log('\n🌐 Test 4: Test de l\'API send-reset-email');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/send-reset-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ API send-reset-email fonctionne:', {
        status: response.status,
        message: data.message
      });
    } else {
      console.log('❌ Erreur API send-reset-email:', {
        status: response.status,
        error: data.error || 'Erreur inconnue'
      });
    }
    
    return response.ok && data.success;
  } catch (error) {
    console.log('❌ Erreur test API:', error.message);
    console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)');
    return false;
  }
}

// Test 5: Test de génération de token
function testTokenGeneration() {
  console.log('\n🔐 Test 5: Test de génération de token');
  
  try {
    const crypto = require('crypto');
    
    // Générer un token de test
    const tokenId = crypto.randomUUID();
    const timestamp = Date.now().toString();
    const resetToken = `${tokenId}-${timestamp}`;
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    console.log('✅ Token généré:', {
      tokenId: tokenId.substring(0, 8) + '...',
      timestamp: timestamp,
      fullToken: resetToken.substring(0, 20) + '...',
      hash: resetTokenHash.substring(0, 16) + '...'
    });
    
    // Test de validation
    const validationHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const isValid = validationHash === resetTokenHash;
    
    console.log('✅ Validation du token:', isValid ? 'OK' : 'ÉCHEC');
    
    return isValid;
  } catch (error) {
    console.log('❌ Erreur génération token:', error.message);
    return false;
  }
}

// Test 6: Vérification des fichiers requis
function testRequiredFiles() {
  console.log('\n📁 Test 6: Vérification des fichiers requis');
  
  const requiredFiles = [
    'src/services/resendEmailService.ts',
    'src/services/emailTemplates/forgotPasswordEmail.ts',
    'src/app/api/auth/send-reset-email/route.ts',
    'src/app/api/auth/reset-password/route.ts',
    'scripts/create-password-reset-tokens-table.sql',
    'scripts/cleanup-expired-tokens.sql'
  ];
  
  const fs = require('fs');
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.log('❌ Fichiers manquants:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    return false;
  }
  
  console.log('✅ Tous les fichiers requis sont présents');
  
  // Vérifier le contenu du service Resend
  try {
    const resendServiceContent = fs.readFileSync('src/services/resendEmailService.ts', 'utf8');
    
    const requiredFeatures = [
      'Resend',
      'noreply@zalamagn.com',
      'ZaLaMa',
      'sendForgotPasswordEmail'
    ];
    
    const missingFeatures = requiredFeatures.filter(feature => 
      !resendServiceContent.includes(feature)
    );
    
    if (missingFeatures.length > 0) {
      console.log('❌ Fonctionnalités manquantes dans resendEmailService.ts:');
      missingFeatures.forEach(feature => console.log(`   - ${feature}`));
      return false;
    }
    
    console.log('✅ Service Resend correctement configuré');
    return true;
  } catch (error) {
    console.log('❌ Erreur vérification service Resend:', error.message);
    return false;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'intégration Resend...\n');
  
  const tests = [
    { name: 'Configuration', fn: testConfiguration },
    { name: 'Connexion Resend', fn: testResendConnection },
    { name: 'Service email', fn: testEmailService },
    { name: 'API endpoint', fn: testAPIEndpoint },
    { name: 'Génération token', fn: testTokenGeneration },
    { name: 'Fichiers requis', fn: testRequiredFiles }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      console.log(`❌ Erreur dans le test "${test.name}":`, error.message);
      results.push({ name: test.name, success: false });
    }
  }
  
  // Résumé des résultats
  console.log('\n📊 Résumé des tests d\'intégration Resend');
  console.log('==========================================');
  
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Résultat: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Tous les tests sont passés ! L\'intégration Resend est prête.');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Configurer les variables d\'environnement en production');
    console.log('2. Tester avec un vrai email');
    console.log('3. Configurer le nettoyage automatique des tokens');
  } else {
    console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }
  
  return passedTests === totalTests;
}

// Exécution des tests
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests }; 