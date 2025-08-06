require('dotenv').config({ path: '.env.local' });

console.log('🧪 TEST DU SERVICE D\'EMAIL CORRIGÉ');
console.log('==================================');

// Simuler les données de test
const testData = {
  company_name: 'Entreprise Test Fix',
  rep_full_name: 'John Doe',
  id: 'TEST-FIX-123',
  email: 'test@entreprise.com',
  rep_email: 'john@entreprise.com',
  hr_email: 'hr@entreprise.com',
  hr_full_name: 'Jane HR',
  legal_status: 'SARL',
  rccm: 'RCCM123456',
  nif: 'NIF123456',
  activity_domain: 'Technologie',
  headquarters_address: '123 Rue Test',
  phone: '+224123456789',
  employees_count: '50',
  payroll: '100000000',
  cdi_count: '40',
  cdd_count: '10',
  payment_day: '25',
  rep_phone: '+224123456789',
  rep_position: 'Directeur',
  hr_phone: '+224123456789'
};

async function testEmailService() {
  try {
    console.log('📧 Test du service d\'email...');
    
    // Importer le service d'email
    const { emailService } = require('./src/services/emailService');
    
    console.log('✅ Service d\'email importé');
    console.log('📋 Données de test:');
    console.log('  - Entreprise:', testData.company_name);
    console.log('  - Email entreprise:', testData.email);
    console.log('  - Email représentant:', testData.rep_email);
    console.log('  - Email RH:', testData.hr_email);
    console.log('  - Email admin: contact@zalamagn.com');
    
    console.log('\n🚀 Envoi des emails...');
    const startTime = Date.now();
    
    const result = await emailService.sendPartnershipEmails(testData);
    
    const duration = Date.now() - startTime;
    
    console.log('\n📊 RÉSULTATS:');
    console.log('  Durée totale:', duration + 'ms');
    console.log('  Succès global:', result.overallSuccess ? '✅' : '❌');
    
    console.log('\n📧 Détails par email:');
    console.log('  - Email entreprise:', result.companyEmail.success ? '✅' : '❌');
    if (!result.companyEmail.success) {
      console.log('    Erreur:', result.companyEmail.error);
    }
    
    console.log('  - Email représentant:', result.repEmail.success ? '✅' : '❌');
    if (!result.repEmail.success) {
      console.log('    Erreur:', result.repEmail.error);
    }
    
    console.log('  - Email RH:', result.hrEmail.success ? '✅' : '❌');
    if (!result.hrEmail.success) {
      console.log('    Erreur:', result.hrEmail.error);
    }
    
    console.log('  - Email admin:', result.contactEmail.success ? '✅' : '❌');
    if (!result.contactEmail.success) {
      console.log('    Erreur:', result.contactEmail.error);
    }
    
    if (result.overallSuccess) {
      console.log('\n🎉 TOUS LES EMAILS ONT ÉTÉ ENVOYÉS AVEC SUCCÈS !');
    } else {
      console.log('\n⚠️  CERTAINS EMAILS ONT ÉCHOUÉ');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Exécution du test
testEmailService(); 