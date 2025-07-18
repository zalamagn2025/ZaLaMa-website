const fetch = require('node-fetch');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Données de test pour une demande de partenariat
const testPartnershipData = {
  companyName: "Tech Solutions SARL",
  legalStatus: "SARL",
  rccm: "RCCM2024-001",
  nif: "NIF2024-001",
  activityDomain: "Technologie et Services Numériques",
  headquartersAddress: "123 Avenue de la République, Conakry",
  phone: "+224 123 456 789",
  email: "contact@techsolutions.gn",
  employeesCount: "75",
  payroll: "75 000 000 GNF",
  cdiCount: "65",
  cddCount: "10",
  paymentDay: "25",
  agreement: true,
  repFullName: "Moussa Diallo",
  repEmail: "moussa.diallo@techsolutions.gn",
  repPhone: "+224 987 654 321",
  repPosition: "Directeur Général",
  hrFullName: "Fatoumata Camara",
  hrEmail: "fatoumata.camara@techsolutions.gn",
  hrPhone: "+224 555 123 456",
  motivationLetterText: "Nous souhaitons devenir partenaire de Zalama pour améliorer la gestion de notre masse salariale et offrir des avances sur salaire à nos employés. Notre entreprise compte 75 employés et nous cherchons une solution fiable et transparente."
};

async function testPartnershipSubmission() {
  console.log('🚀 Test de soumission de partenariat complet (SMS + E-mails)...\n');
  
  try {
    console.log('📤 Envoi de la demande de partenariat...');
    console.log('🏢 Entreprise:', testPartnershipData.companyName);
    console.log('👤 Représentant:', testPartnershipData.repFullName);
    console.log('📧 E-mail RH:', testPartnershipData.hrEmail);
    console.log('📱 Téléphone RH:', testPartnershipData.hrPhone);
    
    const response = await fetch(`${BASE_URL}/api/partnership`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPartnershipData)
    });
    
    const result = await response.json();
    
    console.log('\n📊 Résultat de la soumission:');
    console.log('✅ Succès:', result.success);
    console.log('📝 Message:', result.message);
    console.log('🆔 ID Demande:', result.data?.id);
    console.log('🏢 Entreprise:', result.data?.companyName);
    console.log('📊 Statut:', result.data?.status);
    console.log('📱 Statut SMS:', result.smsStatus);
    console.log('📧 Statut E-mail:', result.emailStatus);
    
    if (result.success) {
      console.log('\n✅ Demande enregistrée avec succès!');
      console.log('📱 SMS en cours d\'envoi au RH et représentant');
      console.log('📧 E-mails en cours d\'envoi (admin + confirmation)');
      
      // Simulation d'attente pour voir les logs
      console.log('\n⏳ Attente de 3 secondes pour observer les logs...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('\n📋 Vérifications à effectuer:');
      console.log('   1. ✅ Vérifiez les logs de l\'application');
      console.log('   2. 📱 Vérifiez la réception des SMS');
      console.log('   3. 📧 Vérifiez la réception des e-mails');
      console.log('   4. 🗄️ Vérifiez l\'insertion dans Supabase');
      
    } else {
      console.error('❌ Erreur lors de la soumission:', result.error);
      if (result.details) {
        console.error('📋 Détails:', result.details);
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solution: Assurez-vous que votre serveur Next.js est démarré');
      console.log('   Commande: npm run dev');
    } else if (error.message.includes('fetch')) {
      console.log('💡 Solution: Vérifiez l\'URL de base dans votre configuration');
    }
  }
}

async function testEmailServiceDirectly() {
  console.log('\n🧪 Test direct du service e-mail...\n');
  
  try {
    // Simulation des données de partenariat comme elles seraient stockées en base
    const partnershipData = {
      id: 999,
      company_name: testPartnershipData.companyName,
      legal_status: testPartnershipData.legalStatus,
      rccm: testPartnershipData.rccm,
      nif: testPartnershipData.nif,
      activity_domain: testPartnershipData.activityDomain,
      headquarters_address: testPartnershipData.headquartersAddress,
      phone: testPartnershipData.phone,
      email: testPartnershipData.email,
      employees_count: parseInt(testPartnershipData.employeesCount),
      payroll: testPartnershipData.payroll,
      cdi_count: parseInt(testPartnershipData.cdiCount),
      cdd_count: parseInt(testPartnershipData.cddCount),
      payment_date: new Date().toISOString().split('T')[0],
      payment_day: parseInt(testPartnershipData.paymentDay),
      rep_full_name: testPartnershipData.repFullName,
      rep_position: testPartnershipData.repPosition,
      rep_email: testPartnershipData.repEmail,
      rep_phone: testPartnershipData.repPhone,
      hr_full_name: testPartnershipData.hrFullName,
      hr_email: testPartnershipData.hrEmail,
      hr_phone: testPartnershipData.hrPhone,
      status: 'pending'
    };
    
    console.log('📧 Test d\'envoi d\'e-mails avec données simulées...');
    
    // Note: Ce test nécessiterait d'être exécuté dans le contexte Next.js
    // avec les variables d'environnement configurées
    console.log('⚠️ Ce test nécessite l\'exécution dans le contexte Next.js');
    console.log('📝 Pour tester directement, utilisez le script test-email-configuration.js');
    
  } catch (error) {
    console.error('❌ Erreur test direct e-mail:', error);
  }
}

async function runCompleteTest() {
  console.log('🎯 Test complet du système de partenariat\n');
  
  // Test 1: Soumission via API
  await testPartnershipSubmission();
  
  // Test 2: Service e-mail direct (informations)
  await testEmailServiceDirectly();
  
  console.log('\n✨ Test terminé!');
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. Vérifiez les logs de votre application');
  console.log('   2. Testez avec de vraies données');
  console.log('   3. Surveillez les analytics Resend');
  console.log('   4. Vérifiez la réception des notifications');
}

// Vérification des variables d'environnement
function checkEnvironment() {
  console.log('🔍 Vérification de l\'environnement...');
  
  const requiredVars = [
    'RESEND_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Variables d\'environnement manquantes:', missingVars);
    console.log('📝 Assurez-vous que votre fichier .env est configuré');
  } else {
    console.log('✅ Variables d\'environnement configurées');
  }
  
  console.log('🌐 URL de base:', BASE_URL);
  console.log('');
}

// Exécution
if (require.main === module) {
  checkEnvironment();
  runCompleteTest().catch(console.error);
}

module.exports = {
  testPartnershipSubmission,
  testEmailServiceDirectly,
  testPartnershipData
}; 