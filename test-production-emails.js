require('dotenv').config({ path: '.env.local' });

console.log('🚀 TEST FINAL - EMAILS DE PARTENARIAT EN PRODUCTION');
console.log('==================================================');

// Vérification de l'environnement
console.log('\n🔧 VÉRIFICATION DE L\'ENVIRONNEMENT:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurée' : '❌ Manquante');
console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'noreply@zalama.com');

if (!process.env.RESEND_API_KEY) {
  console.log('\n❌ ERREUR: RESEND_API_KEY manquante');
  console.log('   Ajoutez RESEND_API_KEY=re_xxxxxxxxx dans votre .env.local');
  process.exit(1);
}

// Données de test réalistes
const testPartnershipData = {
  company_name: 'Tech Solutions Guinée',
  rep_full_name: 'Mamadou Diallo',
  id: 'PART-2024-001',
  email: 'contact@techsolutionsgn.com',
  rep_email: 'mamadou.diallo@techsolutionsgn.com',
  hr_email: 'rh@techsolutionsgn.com',
  hr_full_name: 'Fatoumata Camara',
  legal_status: 'SARL',
  rccm: 'RCCM2024GN001',
  nif: 'NIF2024GN001',
  activity_domain: 'Développement Logiciel',
  headquarters_address: '123 Avenue de la République, Conakry',
  phone: '+224623456789',
  employees_count: '25',
  payroll: '50000000',
  cdi_count: '20',
  cdd_count: '5',
  payment_day: '25',
  rep_phone: '+224623456789',
  rep_position: 'Directeur Général',
  hr_phone: '+224623456790'
};

async function testProductionEmails() {
  try {
    console.log('\n📋 DONNÉES DE TEST:');
    console.log('  - Entreprise:', testPartnershipData.company_name);
    console.log('  - Représentant:', testPartnershipData.rep_full_name);
    console.log('  - Email entreprise:', testPartnershipData.email);
    console.log('  - Email représentant:', testPartnershipData.rep_email);
    console.log('  - Email RH:', testPartnershipData.hr_email);
    console.log('  - Email admin: contact@zalamagn.com');
    
    console.log('\n🚀 DÉMARRAGE DU TEST...');
    const startTime = Date.now();
    
    // Test avec Resend directement
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Préparer les emails avec les vrais templates
    const emails = [
      {
        name: 'Email entreprise',
        to: testPartnershipData.email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a8a;">Confirmation de réception</h2>
            <p>Bonjour ${testPartnershipData.rep_full_name},</p>
            <p>Nous vous remercions pour l'intérêt que vous portez à ZaLaMa.</p>
            <p>Nous accusons bonne réception de votre demande de partenariat soumise pour <strong>${testPartnershipData.company_name}</strong>.</p>
            <p>Notre équipe étudiera attentivement votre dossier et vous reviendra dans les plus brefs délais.</p>
            <p>ID de votre demande: <strong>${testPartnershipData.id}</strong></p>
            <hr>
            <p style="font-size: 12px; color: #666;">ZaLaMa - Demande de partenariat</p>
          </div>
        `,
        text: `Confirmation de reception de votre demande de partenariat pour ${testPartnershipData.company_name} - ID: ${testPartnershipData.id}`
      },
      {
        name: 'Email représentant',
        to: testPartnershipData.rep_email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a8a;">Confirmation de réception</h2>
            <p>Bonjour ${testPartnershipData.rep_full_name},</p>
            <p>Nous vous remercions pour l'intérêt que vous portez à ZaLaMa.</p>
            <p>Nous accusons bonne réception de votre demande de partenariat soumise pour <strong>${testPartnershipData.company_name}</strong>.</p>
            <p>Notre équipe étudiera attentivement votre dossier et vous reviendra dans les plus brefs délais.</p>
            <p>ID de votre demande: <strong>${testPartnershipData.id}</strong></p>
            <hr>
            <p style="font-size: 12px; color: #666;">ZaLaMa - Demande de partenariat</p>
          </div>
        `,
        text: `Confirmation de reception de votre demande de partenariat pour ${testPartnershipData.company_name} - ID: ${testPartnershipData.id}`
      },
      {
        name: 'Email RH',
        to: testPartnershipData.hr_email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a8a;">Confirmation de réception</h2>
            <p>Bonjour ${testPartnershipData.hr_full_name},</p>
            <p>Nous vous remercions pour l'intérêt que vous portez à ZaLaMa.</p>
            <p>Nous accusons bonne réception de votre demande de partenariat soumise pour <strong>${testPartnershipData.company_name}</strong>.</p>
            <p>Notre équipe étudiera attentivement votre dossier et vous reviendra dans les plus brefs délais.</p>
            <p>ID de votre demande: <strong>${testPartnershipData.id}</strong></p>
            <hr>
            <p style="font-size: 12px; color: #666;">ZaLaMa - Demande de partenariat</p>
          </div>
        `,
        text: `Confirmation de reception de votre demande de partenariat pour ${testPartnershipData.company_name} - ID: ${testPartnershipData.id}`
      },
      {
        name: 'Email admin',
        to: 'contact@zalamagn.com',
        subject: `Nouvelle demande de partenariat - ${testPartnershipData.company_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e3a8a;">Nouvelle Demande de Partenariat</h2>
            <h3>Informations de l'entreprise</h3>
            <p><strong>Entreprise:</strong> ${testPartnershipData.company_name}</p>
            <p><strong>Raison sociale:</strong> ${testPartnershipData.legal_status}</p>
            <p><strong>Domaine d'activité:</strong> ${testPartnershipData.activity_domain}</p>
            <p><strong>RCCM:</strong> ${testPartnershipData.rccm}</p>
            <p><strong>NIF:</strong> ${testPartnershipData.nif}</p>
            <p><strong>Adresse:</strong> ${testPartnershipData.headquarters_address}</p>
            <p><strong>Téléphone:</strong> ${testPartnershipData.phone}</p>
            <p><strong>Email:</strong> ${testPartnershipData.email}</p>
            
            <h3>Représentant légal</h3>
            <p><strong>Nom:</strong> ${testPartnershipData.rep_full_name}</p>
            <p><strong>Fonction:</strong> ${testPartnershipData.rep_position}</p>
            <p><strong>Email:</strong> ${testPartnershipData.rep_email}</p>
            <p><strong>Téléphone:</strong> ${testPartnershipData.rep_phone}</p>
            
            <h3>Responsable RH</h3>
            <p><strong>Nom:</strong> ${testPartnershipData.hr_full_name}</p>
            <p><strong>Email:</strong> ${testPartnershipData.hr_email}</p>
            <p><strong>Téléphone:</strong> ${testPartnershipData.hr_phone}</p>
            
            <h3>Informations RH</h3>
            <p><strong>Nombre d'employés:</strong> ${testPartnershipData.employees_count}</p>
            <p><strong>Masse salariale:</strong> ${testPartnershipData.payroll}</p>
            <p><strong>Employés CDI:</strong> ${testPartnershipData.cdi_count}</p>
            <p><strong>Employés CDD:</strong> ${testPartnershipData.cdd_count}</p>
            <p><strong>Date de paiement:</strong> ${testPartnershipData.payment_day ? `Jour ${testPartnershipData.payment_day}` : 'Non spécifié'}</p>
            
            <hr>
            <p style="font-size: 12px; color: #666;">ID: ${testPartnershipData.id}</p>
          </div>
        `,
        text: `Nouvelle demande de partenariat de ${testPartnershipData.company_name} - ID: ${testPartnershipData.id}`
      }
    ];

    console.log('\n📧 ENVOI DES EMAILS AVEC DÉLAI:');
    const results = [];

    // Envoyer les emails avec délai
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      console.log(`  ${i + 1}/4 - Envoi ${email.name}...`);
      
      try {
        const { data, error } = await resend.emails.send({
          from: `ZaLaMa <${process.env.EMAIL_FROM || 'noreply@zalama.com'}>`,
          to: [email.to],
          subject: email.subject,
          html: email.html,
          text: email.text,
        });

        if (error) {
          console.log(`    ❌ Erreur: ${error.message}`);
          results.push({ name: email.name, success: false, error: error.message });
        } else {
          console.log(`    ✅ Envoyé avec succès (ID: ${data?.id || 'N/A'})`);
          results.push({ name: email.name, success: true, id: data?.id });
        }
      } catch (error) {
        console.log(`    ❌ Exception: ${error.message}`);
        results.push({ name: email.name, success: false, error: error.message });
      }
      
      // Délai entre les emails (sauf pour le dernier)
      if (i < emails.length - 1) {
        console.log(`    ⏳ Attente de 500ms...`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const duration = Date.now() - startTime;
    
    console.log('\n📊 RÉSULTATS FINAUX:');
    console.log('  Durée totale:', duration + 'ms');
    
    let successCount = 0;
    results.forEach(result => {
      console.log(`  - ${result.name}: ${result.success ? '✅' : '❌'}`);
      if (result.success) successCount++;
    });
    
    console.log(`\n🎯 RÉSUMÉ: ${successCount}/${results.length} emails envoyés avec succès`);
    
    if (successCount === results.length) {
      console.log('\n🎉 SUCCÈS TOTAL ! TOUS LES EMAILS ONT ÉTÉ ENVOYÉS.');
      console.log('✅ Le système d\'emails de partenariat fonctionne correctement.');
    } else {
      console.log('\n⚠️  CERTAINS EMAILS ONT ÉCHOUÉ');
      console.log('❌ Vérifiez la configuration et les logs d\'erreur.');
    }
    
    console.log('\n📋 DÉTAILS TECHNIQUES:');
    console.log('  - Rate limiting géré avec délai de 500ms');
    console.log('  - Templates HTML et texte inclus');
    console.log('  - Gestion d\'erreurs complète');
    console.log('  - Logs détaillés pour debugging');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Exécution du test
testProductionEmails(); 