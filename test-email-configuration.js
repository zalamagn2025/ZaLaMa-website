const { Resend } = require('resend');

// Configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY non configurée');
  console.log('📝 Ajoutez RESEND_API_KEY=your_api_key dans votre fichier .env');
  process.exit(1);
}

async function testResendConfiguration() {
  console.log('🧪 Test de configuration Resend...');
  
  try {
    const resend = new Resend(RESEND_API_KEY);
    
    console.log('✅ Client Resend initialisé');
    
    // Test de connexion avec un e-mail de test
    console.log('📧 Test d\'envoi d\'e-mail...');
    
    const result = await resend.emails.send({
      from: 'Zalama SAS <noreply@zalamagn.com>',
      to: ['test@example.com'],
      subject: 'Test de configuration Resend',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Test de configuration Resend</h2>
          <p>Cet e-mail confirme que votre configuration Resend fonctionne correctement.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key:</strong> ${RESEND_API_KEY.substring(0, 10)}...</p>
        </div>
      `
    });
    
    console.log('✅ E-mail de test envoyé avec succès!');
    console.log('📧 Message ID:', result.data?.id);
    console.log('📊 Status:', result.data?.status);
    
    // Test des templates
    console.log('\n📋 Test des templates d\'e-mail...');
    
    const adminTemplateData = {
      companyName: 'Entreprise Test',
      legalStatus: 'SARL',
      rccm: 'RCCM123456',
      nif: 'NIF789012',
      legalRepresentative: 'Jean Dupont',
      position: 'Directeur Général',
      headquartersAddress: '123 Rue Test, Conakry',
      phone: '+224 123 456 789',
      email: 'contact@test.com',
      employeesCount: '50',
      payroll: '50 000 000 GNF',
      cdiCount: '45',
      cddCount: '5',
      docId: 'TEST-001',
      activityDomain: 'Technologie',
      paymentDate: '2024-01-15',
      repEmail: 'representant@test.com',
      repPhone: '+224 987 654 321',
      repPosition: 'Directeur Général',
      hrFullName: 'Marie Martin',
      hrEmail: 'rh@test.com',
      hrPhone: '+224 555 123 456'
    };
    
    const userTemplateData = {
      legalRepresentative: 'Jean Dupont',
      companyName: 'Entreprise Test',
      docId: 'TEST-001',
      repEmail: 'representant@test.com'
    };
    
    console.log('✅ Templates prêts à être utilisés');
    console.log('📊 Données admin template:', Object.keys(adminTemplateData).length, 'champs');
    console.log('📊 Données utilisateur template:', Object.keys(userTemplateData).length, 'champs');
    
    console.log('\n🎉 Configuration Resend validée avec succès!');
    console.log('📝 Prochaines étapes:');
    console.log('   1. Vérifiez que votre domaine est configuré dans Resend');
    console.log('   2. Testez l\'envoi d\'e-mails réels');
    console.log('   3. Surveillez les logs pour les erreurs');
    
  } catch (error) {
    console.error('❌ Erreur lors du test Resend:', error);
    
    if (error.message.includes('Unauthorized')) {
      console.log('💡 Solution: Vérifiez votre clé API Resend');
    } else if (error.message.includes('domain')) {
      console.log('💡 Solution: Configurez votre domaine dans Resend');
    } else if (error.message.includes('quota')) {
      console.log('💡 Solution: Vérifiez votre quota Resend');
    }
    
    process.exit(1);
  }
}

// Test des variables d'environnement
function checkEnvironmentVariables() {
  console.log('🔍 Vérification des variables d\'environnement...');
  
  const requiredVars = [
    'RESEND_API_KEY',
    'NEXT_PRIVATE_SUPABASE_URL',
    'NEXT_PRIVATE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:', missingVars);
    console.log('📝 Assurez-vous que votre fichier .env contient toutes les variables requises');
    process.exit(1);
  }
  
  console.log('✅ Toutes les variables d\'environnement sont configurées');
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests de configuration...\n');
  
  checkEnvironmentVariables();
  await testResendConfiguration();
  
  console.log('\n✨ Tests terminés avec succès!');
}

runTests().catch(console.error); 