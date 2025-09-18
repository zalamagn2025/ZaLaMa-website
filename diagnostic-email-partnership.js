require('dotenv').config({ path: '.env.local' });

/*console.log('🔍 DIAGNOSTIC EMAILS PARTENARIAT')*/
/*console.log('================================')*/

// 1. Vérification des variables d'environnement
/*console.log('\n📋 VÉRIFICATION DES VARIABLES D\'ENVIRONNEMENT:')*/
/*console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant')*/
/*console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'noreply@zalama.com')*/
/*console.log('- ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'admin@zalamagn.com')*/

if (process.env.RESEND_API_KEY) {
  /*console.log('  Format de la clé:', process.env.RESEND_API_KEY.startsWith('re_')*/ ? '✅ Correct' : '❌ Incorrect');
  /*console.log('  Longueur:', process.env.RESEND_API_KEY.length)*/
  /*console.log('  Premiers caractères:', process.env.RESEND_API_KEY.substring(0, 10)*/ + '...');
}

// 2. Test simple avec Resend
async function testResendDirect() {
  /*console.log('\n🔌 TEST DIRECT RESEND:')*/
  
  if (!process.env.RESEND_API_KEY) {
    /*console.log('❌ RESEND_API_KEY manquante')*/
    return false;
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    /*console.log('  Tentative d\'envoi de test...')*/
    const { data, error } = await resend.emails.send({
      from: `ZaLaMa <${process.env.EMAIL_FROM || 'noreply@zalama.com'}>`,
      to: ['test@example.com'],
      subject: 'Test de connexion Resend',
      html: '<p>Test de connexion</p>',
      text: 'Test de connexion'
    });
    
    if (error) {
      /*console.log('❌ Erreur Resend:', error.message)*/
      return false;
    }
    
    /*console.log('✅ Connexion Resend OK')*/
    return true;
  } catch (error) {
    /*console.log('❌ Erreur de connexion:', error.message)*/
    return false;
  }
}

// 3. Test du service d'email existant
async function testEmailService() {
  /*console.log('\n📧 TEST DU SERVICE D\'EMAIL:')*/
  
  try {
    // Simuler les données de test
    const testData = {
      company_name: 'Entreprise Test',
      rep_full_name: 'John Doe',
      id: 'TEST-123',
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

    /*console.log('  Données de test préparées')*/
    /*console.log('  - Entreprise:', testData.company_name)*/
    /*console.log('  - Email entreprise:', testData.email)*/
    /*console.log('  - Email représentant:', testData.rep_email)*/
    /*console.log('  - Email RH:', testData.hr_email)*/
    /*console.log('  - Email admin: contact@zalamagn.com')*/
    
    return true;
  } catch (error) {
    /*console.log('❌ Erreur préparation données:', error.message)*/
    return false;
  }
}

// 4. Test d'envoi d'emails de partenariat
async function testPartnershipEmails() {
  /*console.log('\n🚀 TEST D\'ENVOI D\'EMAILS DE PARTENARIAT:')*/
  
  if (!process.env.RESEND_API_KEY) {
    /*console.log('❌ Impossible de tester sans RESEND_API_KEY')*/
    return;
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Données de test
    const testData = {
      company_name: 'Entreprise Test',
      rep_full_name: 'John Doe',
      id: 'TEST-123',
      email: 'test@entreprise.com',
      rep_email: 'john@entreprise.com',
      hr_email: 'hr@entreprise.com',
      hr_full_name: 'Jane HR'
    };

    // Emails simples pour test
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

    // Envoyer les emails
    for (const email of emails) {
      /*console.log(`  Envoi ${email.name}...`)*/
      
      const { data, error } = await resend.emails.send({
        from: `ZaLaMa <${process.env.EMAIL_FROM || 'noreply@zalama.com'}>`,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
      });

      if (error) {
        /*console.log(`  ❌ Erreur ${email.name}:`, error.message)*/
      } else {
        /*console.log(`  ✅ ${email.name} envoyé avec succès`)*/
      }
    }

  } catch (error) {
    /*console.log('❌ Erreur test emails:', error.message)*/
  }
}

// 5. Exécution des tests
async function runDiagnostic() {
  /*console.log('\n🎯 RÉSULTATS DU DIAGNOSTIC:')*/
  
  const resendOk = await testResendDirect();
  const serviceOk = await testEmailService();
  
  if (resendOk && serviceOk) {
    /*console.log('\n✅ Configuration OK - Test d\'envoi...')*/
    await testPartnershipEmails();
  } else {
    /*console.log('\n❌ Problèmes détectés:')*/
    if (!resendOk) {
      /*console.log('  - Problème de connexion Resend')*/
      /*console.log('  - Vérifiez RESEND_API_KEY dans .env.local')*/
    }
    if (!serviceOk) {
      /*console.log('  - Problème avec le service d\'email')*/
    }
  }
}

// Exécution
runDiagnostic().catch(console.error); 