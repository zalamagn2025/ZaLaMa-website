// Script de test final pour les emails de partenariat (4 emails)
require('dotenv').config();

console.log('🚀 TEST FINAL - EMAILS DE PARTENARIAT (4 EMAILS)');
console.log('================================================');

// Données de test selon l'interface CreatePartnershipRequest
const testPartnershipData = {
  id: 'TEST-' + Date.now(),
  company_name: "Tech Solutions SARL",
  legal_status: "SARL",
  rccm: "GN-2023-B-12345",
  nif: "123456789",
  activity_domain: "Informatique",
  headquarters_address: "123 Avenue de la République, Conakry",
  phone: "+224123456789",
  email: "contact@techsolutions.com", // Email de test
  employees_count: 50,
  payroll: "50000000 GNF",
  cdi_count: 30,
  cdd_count: 20,
  payment_date: new Date().toISOString().split('T')[0],
  payment_day: 25,
  rep_full_name: "Mamadou Diallo",
  rep_position: "Directeur Général",
  rep_email: "directeur@techsolutions.com",
  rep_phone: "+224123456789",
  hr_full_name: "Fatou Camara",
  hr_email: "rh@techsolutions.com",
  hr_phone: "+224123456789",
  agreement: true,
  status: 'pending'
};

// Test complet du service email
async function testEmailService() {
  try {
    console.log('\n📧 Test du service email...');
    
    // Importer le service email
    const { emailService } = require('./src/services/emailService.ts');
    
    console.log('✅ Service email importé avec succès');
    
    // Test d'envoi des emails
    console.log('\n📤 Envoi des 4 emails de partenariat...');
    const result = await emailService.sendPartnershipEmails(testPartnershipData);
    
    return result;
    
  } catch (error) {
    console.error('\n❌ ERREUR Service Email:', error.message);
    return null;
  }
}

// Test direct avec Resend
async function testDirectResend() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('\n❌ RESEND_API_KEY manquante');
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('\n📤 Test direct avec Resend...');
    
    // Email de test simple
    const testEmail = {
      from: 'ZaLaMa <noreply@zalama.com>',
      to: ['test@example.com'], // Remplacer par un email valide
      subject: 'Test ZaLaMa - Configuration Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3B82F6; text-align: center;">Test Email ZaLaMa</h2>
          <p>Ceci est un test d'envoi d'email pour ZaLaMa.</p>
          <p><strong>Entreprise:</strong> ${testPartnershipData.company_name}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>ID Test:</strong> ${testPartnershipData.id}</p>
        </div>
      `,
      text: `Test Email ZaLaMa - ${testPartnershipData.company_name} - ${testPartnershipData.id}`
    };

    const result = await resend.emails.send(testEmail);
    
    if (result.error) {
      console.log('❌ Erreur Resend:', result.error);
      return false;
    } else {
      console.log('✅ Email de test envoyé via Resend');
      console.log('ID:', result.data?.id);
      return true;
    }
    
  } catch (error) {
    console.log('\n❌ ERREUR Resend:', error.message);
    return false;
  }
}

// Vérifier la configuration
function checkConfiguration() {
  console.log('\n🔍 VÉRIFICATION DE LA CONFIGURATION :');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'noreply@zalama.com');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('\n⚠️  ATTENTION: RESEND_API_KEY non configurée');
    console.log('   Ajoutez RESEND_API_KEY=re_xxxxxxxxx dans votre .env');
    return false;
  }
  
  return true;
}

// Afficher les résultats
function displayResults(result) {
  if (!result) {
    console.log('\n❌ Aucun résultat à afficher');
    return;
  }

  console.log('\n📊 RÉSULTATS DÉTAILLÉS :');
  console.log('========================');
  
  // Email Entreprise (confirmation)
  console.log('\n📧 Email Entreprise (confirmation):');
  console.log(`  Statut: ${result.companyEmail.success ? '✅ Succès' : '❌ Échec'}`);
  console.log(`  Destinataire: ${result.companyEmail.recipient}`);
  if (!result.companyEmail.success) {
    console.log(`  Erreur: ${result.companyEmail.error}`);
    console.log(`  Type: ${result.companyEmail.errorType}`);
  }
  
  // Email Représentant (confirmation)
  console.log('\n📧 Email Représentant (confirmation):');
  console.log(`  Statut: ${result.repEmail.success ? '✅ Succès' : '❌ Échec'}`);
  console.log(`  Destinataire: ${result.repEmail.recipient}`);
  if (!result.repEmail.success) {
    console.log(`  Erreur: ${result.repEmail.error}`);
    console.log(`  Type: ${result.repEmail.errorType}`);
  }
  
  // Email RH (confirmation)
  console.log('\n📧 Email RH (confirmation):');
  console.log(`  Statut: ${result.hrEmail.success ? '✅ Succès' : '❌ Échec'}`);
  console.log(`  Destinataire: ${result.hrEmail.recipient}`);
  if (!result.hrEmail.success) {
    console.log(`  Erreur: ${result.hrEmail.error}`);
    console.log(`  Type: ${result.hrEmail.errorType}`);
  }
  
  // Email Contact (notification)
  console.log('\n📧 Email Contact (notification):');
  console.log(`  Statut: ${result.contactEmail.success ? '✅ Succès' : '❌ Échec'}`);
  console.log(`  Destinataire: ${result.contactEmail.recipient}`);
  if (!result.contactEmail.success) {
    console.log(`  Erreur: ${result.contactEmail.error}`);
    console.log(`  Type: ${result.contactEmail.errorType}`);
  }
  
  // Résumé global
  console.log('\n🎯 RÉSUMÉ GLOBAL:');
  console.log(`  Succès global: ${result.overallSuccess ? '✅ TOUS LES EMAILS ENVOYÉS' : '❌ CERTAINS EMAILS ÉCHOUÉS'}`);
  
  const successCount = [
    result.companyEmail.success,
    result.repEmail.success,
    result.hrEmail.success,
    result.contactEmail.success
  ].filter(Boolean).length;
  
  console.log(`  Emails réussis: ${successCount}/4`);
  
  // Détail des types d'emails
  console.log('\n📋 DÉTAIL DES EMAILS :');
  console.log('  ✅ 3 emails de confirmation (entreprise, représentant, RH)');
  console.log('  ✅ 1 email de notification (contact@zalamagn.com)');
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 DÉMARRAGE DES TESTS...');
  
  // Vérifier la configuration
  const configOk = checkConfiguration();
  if (!configOk) {
    console.log('\n❌ Configuration incomplète. Arrêt des tests.');
    return;
  }
  
  // Test direct Resend
  console.log('\n' + '='.repeat(50));
  const resendOk = await testDirectResend();
  
  // Test service email
  console.log('\n' + '='.repeat(50));
  const emailResult = await testEmailService();
  
  // Afficher les résultats
  console.log('\n' + '='.repeat(50));
  displayResults(emailResult);
  
  // Recommandations
  console.log('\n📝 RECOMMANDATIONS :');
  if (!resendOk) {
    console.log('❌ Problème de configuration Resend');
    console.log('   - Vérifiez votre clé API');
    console.log('   - Vérifiez le domaine zalama.com dans Resend');
  }
  
  if (emailResult && !emailResult.overallSuccess) {
    console.log('❌ Certains emails ont échoué');
    console.log('   - Vérifiez les logs d\'erreur ci-dessus');
    console.log('   - Vérifiez les adresses email de destination');
  }
  
  if (emailResult && emailResult.overallSuccess) {
    console.log('✅ Tous les tests sont passés avec succès !');
    console.log('🎉 Le système d\'emails fonctionne parfaitement !');
  }
  
  console.log('\n🔧 Pour tester avec de vrais emails :');
  console.log('   - Remplacez les emails de test par de vrais emails');
  console.log('   - Vérifiez vos boîtes de réception et spams');
}

// Exécuter les tests
runAllTests().catch(error => {
  console.error('\n💥 ERREUR CRITIQUE:', error);
  process.exit(1);
}); 