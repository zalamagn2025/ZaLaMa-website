const { Client } = require('nimbasms');

// Configuration de test
const testConfig = {
  SERVICE_ID: process.env.NIMBA_SMS_SERVICE_ID,
  SECRET_TOKEN: process.env.NIMBA_SMS_SECRET_TOKEN,
  TEST_RH_NUMBER: '+224628774573', // Numéro RH de test
  TEST_REPRESENTATIVE: '+224663861866' // Numéro représentant de test
};

async function testPartnershipSMS() {
  console.log('🧪 Test SMS Partenariat ZaLaMa');
  console.log('================================');
  
  // Vérification des variables d'environnement
  console.log('\n📋 Vérification des variables d\'environnement:');
  console.log('SERVICE_ID:', testConfig.SERVICE_ID ? '✅ Configuré' : '❌ Manquant');
  console.log('SECRET_TOKEN:', testConfig.SECRET_TOKEN ? '✅ Configuré' : '❌ Manquant');
  console.log('TEST_RH_NUMBER:', testConfig.TEST_RH_NUMBER);
  console.log('TEST_REPRESENTATIVE:', testConfig.TEST_REPRESENTATIVE);
  
  if (!testConfig.SERVICE_ID || !testConfig.SECRET_TOKEN) {
    console.error('\n❌ Variables d\'environnement manquantes');
    console.log('Ajoutez ces variables dans votre .env:');
    console.log('NIMBA_SMS_SERVICE_ID=votre_service_id');
    console.log('NIMBA_SMS_SECRET_TOKEN=votre_secret_token');
    return;
  }
  
  try {
    // Initialisation du client
    console.log('\n🔧 Initialisation du client SMS...');
    const client = new Client({
      SERVICE_ID: testConfig.SERVICE_ID,
      SECRET_TOKEN: testConfig.SECRET_TOKEN
    });
    
    // Données de test
    const testData = {
      partner_name: 'Entreprise Test SARL',
      representative_phone: testConfig.TEST_REPRESENTATIVE,
      rh_phone: testConfig.TEST_RH_NUMBER, // Numéro RH dynamique
      request_id: 'TEST-' + Date.now(),
      submission_date: new Date()
    };
    
    // Construction du message
    const formattedDate = testData.submission_date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    const message = `🎉 Nouvelle demande de partenariat ZaLaMa

🏢 Partenaire: ${testData.partner_name}
📅 Soumis le: ${formattedDate}

Nouvelle demande reçue. Consultez-la sur votre espace RH.

Cordialement,
L'équipe ZaLaMa`;
    
    console.log('\n📱 Test d\'envoi SMS au RH...');
    console.log('Message:', message);
    console.log('Destinataire RH:', testConfig.TEST_RH_NUMBER);
    
    // Test SMS RH
    const rhResult = await client.messages.create({
      to: [testConfig.TEST_RH_NUMBER],
      message: message,
      sender_name: 'ZaLaMa'
    });
    
    console.log('✅ SMS RH envoyé avec succès!');
    console.log('Message ID:', rhResult.messageid);
    console.log('Statut:', rhResult.status);
    
    console.log('\n📱 Test d\'envoi SMS au représentant...');
    console.log('Destinataire Représentant:', testData.representative_phone);
    
    // Test SMS Représentant
    const repResult = await client.messages.create({
      to: [testData.representative_phone],
      message: message,
      sender_name: 'ZaLaMa'
    });
    
    console.log('✅ SMS Représentant envoyé avec succès!');
    console.log('Message ID:', repResult.messageid);
    console.log('Statut:', repResult.status);
    
    // Résumé
    console.log('\n📊 Résumé des tests:');
    console.log('✅ SMS RH:', rhResult.messageid);
    console.log('✅ SMS Représentant:', repResult.messageid);
    console.log('📅 Date de test:', formattedDate);
    console.log('🏢 Partenaire test:', testData.partner_name);
    
    console.log('\n🎉 Tous les tests SMS sont passés avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Vérifiez que les SMS ont été reçus');
    console.log('2. Testez l\'API de partenariat avec un vrai formulaire');
    console.log('3. Vérifiez les logs dans la console');
    console.log('4. Monitorer les analytics via /api/sms/analytics');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test SMS:', error.message);
    
    if (error.message.includes('UNAUTHORIZED')) {
      console.log('\n💡 Solution: Vérifiez vos credentials NimbaSMS');
    } else if (error.message.includes('INVALID_PHONE')) {
      console.log('\n💡 Solution: Vérifiez le format des numéros de téléphone');
    } else if (error.message.includes('QUOTA')) {
      console.log('\n💡 Solution: Vérifiez votre quota SMS');
    } else {
      console.log('\n💡 Solution: Vérifiez votre connexion internet et les credentials');
    }
  }
}

// Test de validation des numéros
function testPhoneValidation() {
  console.log('\n🔍 Test de validation des numéros:');
  
  const testNumbers = [
    '+224628774573', // ✅ RH Côte d'Ivoire
    '+224663861866',  // ✅ Représentant Guinée
    '0625212115',     // ✅ Format local Guinée
    '0700000000',     // ✅ Format local Côte d'Ivoire
    '+22462521211',   // ❌ Trop court
    'invalid'         // ❌ Invalide
  ];
  
  testNumbers.forEach(number => {
    const cleanNumber = number.replace(/\s/g, '');
    const guineaPattern = /^(\+224|0)[0-9]{9}$/;
    const coteDIvoirePattern = /^(\+225|0)[0-9]{8}$/;
    const isValid = guineaPattern.test(cleanNumber) || coteDIvoirePattern.test(cleanNumber);
    
    console.log(`  ${number}: ${isValid ? '✅' : '❌'}`);
  });
}

// Test de formatage de date
function testDateFormatting() {
  console.log('\n📅 Test de formatage de date:');
  
  const testDate = new Date();
  const formattedDate = testDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  console.log('Date originale:', testDate);
  console.log('Date formatée:', formattedDate);
  console.log('Format attendu: 07 juillet 2025');
}

// Exécution des tests
if (require.main === module) {
  testPartnershipSMS();
  testPhoneValidation();
  testDateFormatting();
}

module.exports = { testPartnershipSMS };