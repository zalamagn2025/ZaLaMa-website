require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

console.log('🧪 TEST DIRECT D\'ENVOI D\'EMAILS AVEC DÉLAI');
console.log('==========================================');

// Vérification de la configuration
console.log('\n📋 CONFIGURATION:');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant');
console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'noreply@zalama.com');

if (!process.env.RESEND_API_KEY) {
  console.log('❌ RESEND_API_KEY manquante');
  process.exit(1);
}

// Données de test
const testData = {
  company_name: 'Entreprise Test Direct',
  rep_full_name: 'John Doe',
  id: 'TEST-DIRECT-123',
  email: 'test@entreprise.com',
  rep_email: 'john@entreprise.com',
  hr_email: 'hr@entreprise.com',
  hr_full_name: 'Jane HR'
};

async function sendEmailWithDelay(resend, emailData, delay = 500) {
  console.log(`  Envoi ${emailData.name}...`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: `ZaLaMa <${process.env.EMAIL_FROM || 'noreply@zalama.com'}>`,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    if (error) {
      console.log(`    ❌ Erreur:`, error.message);
      return false;
    } else {
      console.log(`    ✅ Envoyé avec succès`);
      return true;
    }
  } catch (error) {
    console.log(`    ❌ Exception:`, error.message);
    return false;
  }
}

async function testEmailsWithDelay() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    console.log('\n📧 PRÉPARATION DES EMAILS:');
    console.log('  - Entreprise:', testData.email);
    console.log('  - Représentant:', testData.rep_email);
    console.log('  - RH:', testData.hr_email);
    console.log('  - Admin: contact@zalamagn.com');
    
    // Préparer les emails
    const emails = [
      {
        name: 'Email entreprise',
        to: testData.email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: `<p>Bonjour ${testData.rep_full_name},</p><p>Nous confirmons la réception de votre demande de partenariat pour ${testData.company_name}.</p>`,
        text: `Confirmation de reception de votre demande de partenariat pour ${testData.company_name} - ID: ${testData.id}`
      },
      {
        name: 'Email représentant',
        to: testData.rep_email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: `<p>Bonjour ${testData.rep_full_name},</p><p>Nous confirmons la réception de votre demande de partenariat pour ${testData.company_name}.</p>`,
        text: `Confirmation de reception de votre demande de partenariat pour ${testData.company_name} - ID: ${testData.id}`
      },
      {
        name: 'Email RH',
        to: testData.hr_email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: `<p>Bonjour ${testData.hr_full_name},</p><p>Nous confirmons la réception de votre demande de partenariat pour ${testData.company_name}.</p>`,
        text: `Confirmation de reception de votre demande de partenariat pour ${testData.company_name} - ID: ${testData.id}`
      },
      {
        name: 'Email admin',
        to: 'contact@zalamagn.com',
        subject: `Nouvelle demande de partenariat - ${testData.company_name}`,
        html: `<p>Nouvelle demande de partenariat reçue de ${testData.company_name}.</p><p>Représentant: ${testData.rep_full_name}</p>`,
        text: `Nouvelle demande de partenariat de ${testData.company_name} - ID: ${testData.id}`
      }
    ];

    console.log('\n🚀 ENVOI DES EMAILS AVEC DÉLAI:');
    const startTime = Date.now();
    const results = [];

    // Envoyer les emails avec délai
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const success = await sendEmailWithDelay(resend, email);
      results.push({ name: email.name, success, recipient: email.to });
      
      // Délai entre les emails (sauf pour le dernier)
      if (i < emails.length - 1) {
        console.log(`  ⏳ Attente de 500ms...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const duration = Date.now() - startTime;
    
    console.log('\n📊 RÉSULTATS:');
    console.log('  Durée totale:', duration + 'ms');
    
    let successCount = 0;
    results.forEach(result => {
      console.log(`  - ${result.name}: ${result.success ? '✅' : '❌'}`);
      if (result.success) successCount++;
    });
    
    console.log(`\n🎯 RÉSUMÉ: ${successCount}/${results.length} emails envoyés avec succès`);
    
    if (successCount === results.length) {
      console.log('🎉 TOUS LES EMAILS ONT ÉTÉ ENVOYÉS AVEC SUCCÈS !');
    } else {
      console.log('⚠️  CERTAINS EMAILS ONT ÉCHOUÉ');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécution du test
testEmailsWithDelay(); 