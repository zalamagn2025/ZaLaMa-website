// Script de test pour les emails de partenariat
require('dotenv').config();

console.log('🧪 TEST DES EMAILS DE PARTENARIAT');
console.log('==================================');

// Données de test pour une demande de partenariat
const testPartnershipData = {
  company_name: "Test Entreprise SARL",
  legal_status: "SARL",
  rccm: "GN-2023-B-12345",
  nif: "123456789",
  activity_domain: "Informatique",
  headquarters_address: "123 Avenue de la République, Conakry",
  phone: "+224123456789",
  email: "contact@testentreprise.com", // Email de test
  employees_count: 50,
  payroll: "50000000 GNF",
  cdi_count: 30,
  cdd_count: 20,
  payment_day: 25,
  rep_full_name: "Mamadou Diallo",
  rep_position: "Directeur Général",
  rep_email: "directeur@testentreprise.com",
  rep_phone: "+224123456789",
  hr_full_name: "Fatou Camara",
  hr_email: "rh@testentreprise.com",
  hr_phone: "+224123456789",
  agreement: true,
  status: 'pending'
};

async function testPartnershipEmails() {
  try {
    // Importer le service email
    const { emailService } = require('./src/services/emailService.ts');
    
    console.log('\n📧 Test d\'envoi des emails de partenariat...');
    console.log('Données de test:', {
      company: testPartnershipData.company_name,
      adminEmail: process.env.ADMIN_EMAIL || 'admin@zalamagn.com',
      userEmail: testPartnershipData.email
    });

    // Test d'envoi des emails
    const result = await emailService.sendPartnershipEmails(testPartnershipData);
    
    console.log('\n📊 RÉSULTATS :');
    console.log('Email Admin:', result.adminEmail.success ? '✅ Succès' : '❌ Échec');
    if (!result.adminEmail.success) {
      console.log('  Erreur:', result.adminEmail.error);
      console.log('  Type:', result.adminEmail.errorType);
    }
    
    console.log('Email Utilisateur:', result.userEmail.success ? '✅ Succès' : '❌ Échec');
    if (!result.userEmail.success) {
      console.log('  Erreur:', result.userEmail.error);
      console.log('  Type:', result.userEmail.errorType);
      console.log('  Destinataire:', result.userEmail.recipient);
    }
    
    console.log('Succès global:', result.overallSuccess ? '✅' : '❌');
    
    return result;
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    return null;
  }
}

// Test direct avec Resend
async function testDirectResend() {
  try {
    const { Resend } = require('resend');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('\n❌ RESEND_API_KEY manquante');
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('\n📤 Test direct avec Resend...');
    
    // Email de test simple
    const testEmail = {
      from: 'ZaLaMa <noreply@zalama.com>',
      to: ['test@example.com'], // Remplacer par un email valide
      subject: 'Test ZaLaMa - Partenariat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #3B82F6;">Test Email ZaLaMa</h2>
          <p>Ceci est un test d'envoi d'email pour ZaLaMa.</p>
          <p><strong>Entreprise:</strong> ${testPartnershipData.company_name}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `Test Email ZaLaMa - ${testPartnershipData.company_name}`
    };

    const result = await resend.emails.send(testEmail);
    
    if (result.error) {
      console.log('❌ Erreur Resend:', result.error);
    } else {
      console.log('✅ Email de test envoyé via Resend');
      console.log('ID:', result.data?.id);
    }
    
  } catch (error) {
    console.log('\n❌ ERREUR Resend:', error.message);
  }
}

// Vérifier la configuration
function checkConfiguration() {
  console.log('\n🔍 VÉRIFICATION DE LA CONFIGURATION :');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅' : '❌');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'noreply@zalama.com');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'admin@zalamagn.com');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('\n⚠️  ATTENTION: RESEND_API_KEY non configurée');
    console.log('   Ajoutez RESEND_API_KEY=re_xxxxxxxxx dans votre .env');
  }
}

// Exécuter les tests
async function runAllTests() {
  checkConfiguration();
  await testDirectResend();
  await testPartnershipEmails();
  
  console.log('\n📝 INSTRUCTIONS :');
  console.log('1. Configurez RESEND_API_KEY dans votre .env');
  console.log('2. Remplacez test@example.com par un email valide');
  console.log('3. Vérifiez que le domaine zalama.com est configuré dans Resend');
  console.log('4. Relancez les tests après configuration');
}

runAllTests().catch(console.error); 