// Script de test pour vérifier la configuration des emails
require('dotenv').config();

console.log('🔍 VÉRIFICATION DE LA CONFIGURATION EMAIL');
console.log('==========================================');

// Vérifier les variables d'environnement
console.log('\n📋 Variables d\'environnement :');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'noreply@zalama.com');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'admin@zalamagn.com (par défaut)');

// Test de connexion Resend
async function testResendConnection() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('\n❌ ERREUR: RESEND_API_KEY non configurée');
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test simple de connexion
    console.log('\n🧪 Test de connexion Resend...');
    
    // Vérifier les domaines configurés
    const domains = await resend.domains.list();
    console.log('📧 Domaines configurés:', domains.data?.length || 0);
    
    if (domains.data && domains.data.length > 0) {
      domains.data.forEach(domain => {
        console.log(`  - ${domain.name} (${domain.status})`);
      });
    }

    console.log('\n✅ Connexion Resend réussie');
    
  } catch (error) {
    console.log('\n❌ ERREUR Connexion Resend:', error.message);
  }
}

// Test d'envoi d'email
async function testEmailSending() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('\n❌ Impossible de tester l\'envoi: RESEND_API_KEY manquante');
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('\n📤 Test d\'envoi d\'email...');
    
    const testEmail = {
      from: 'ZaLaMa <noreply@zalama.com>',
      to: ['test@example.com'],
      subject: 'Test ZaLaMa - Configuration Email',
      html: '<p>Ceci est un test de configuration email pour ZaLaMa.</p>',
      text: 'Test de configuration email ZaLaMa'
    };

    const result = await resend.emails.send(testEmail);
    
    if (result.error) {
      console.log('❌ Erreur envoi test:', result.error);
    } else {
      console.log('✅ Email de test envoyé avec succès');
      console.log('ID:', result.data?.id);
    }
    
  } catch (error) {
    console.log('\n❌ ERREUR Test envoi:', error.message);
  }
}

// Exécuter les tests
async function runTests() {
  await testResendConnection();
  await testEmailSending();
  
  console.log('\n📝 RECOMMANDATIONS :');
  console.log('1. Vérifiez que RESEND_API_KEY est configurée dans votre .env');
  console.log('2. Vérifiez que le domaine zalama.com est configuré dans Resend');
  console.log('3. Vérifiez que ADMIN_EMAIL est configuré si nécessaire');
  console.log('4. Testez avec un email valide au lieu de test@example.com');
}

runTests().catch(console.error); 