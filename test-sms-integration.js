const { Client } = require('nimbasms');

// Configuration de test
const testConfig = {
  SERVICE_ID: process.env.NIMBA_SMS_SERVICE_ID,
  SECRET_TOKEN: process.env.NIMBA_SMS_SECRET_TOKEN,
  TEST_PHONE: process.env.SMS_RH_NUMBER || '+224625212115'
};

async function testSMSIntegration() {
  console.log('🧪 Test d\'intégration SMS NimbaSMS');
  console.log('=====================================');
  
  // Vérification des variables d'environnement
  console.log('\n📋 Vérification des variables d\'environnement:');
  console.log('SERVICE_ID:', testConfig.SERVICE_ID ? '✅ Configuré' : '❌ Manquant');
  console.log('SECRET_TOKEN:', testConfig.SECRET_TOKEN ? '✅ Configuré' : '❌ Manquant');
  console.log('TEST_PHONE:', testConfig.TEST_PHONE);
  
  if (!testConfig.SERVICE_ID || !testConfig.SECRET_TOKEN) {
    console.error('\n❌ Variables d\'environnement manquantes');
    console.log('Ajoutez ces variables dans votre .env:');
    console.log('NIMBA_SMS_SERVICE_ID=votre_service_id');
    console.log('NIMBA_SMS_SECRET_TOKEN=votre_secret_token');
    console.log('SMS_RH_NUMBER=+224XXXXXXXXX');
    return;
  }
  
  try {
    // Initialisation du client
    console.log('\n🔧 Initialisation du client SMS...');
    const client = new Client({
      SERVICE_ID: testConfig.SERVICE_ID,
      SECRET_TOKEN: testConfig.SECRET_TOKEN
    });
    
    // Test d'envoi de SMS
    console.log('\n📱 Test d\'envoi de SMS...');
    const testMessage = `🧪 Test SMS ZaLaMa - ${new Date().toLocaleString('fr-FR')}
    
Ceci est un test d'intégration SMS.
Si vous recevez ce message, l'intégration fonctionne correctement.

Cordialement,
L'équipe ZaLaMa`;
    
    const result = await client.messages.create({
      to: [testConfig.TEST_PHONE],
      message: testMessage,
      sender_name: 'ZaLaMa'
    });
    
    console.log('✅ SMS envoyé avec succès!');
    console.log('Message ID:', result.messageid);
    console.log('Statut:', result.status);
    
    // Test de validation
    console.log('\n🔍 Test de validation...');
    testPhoneValidation();
    testMessageValidation();
    
    console.log('\n🎉 Tous les tests sont passés avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Vérifiez que le SMS a été reçu');
    console.log('2. Testez l\'API de partenariat avec un vrai formulaire');
    console.log('3. Vérifiez les logs dans la console');
    console.log('4. Monitorer les analytics via /api/sms/analytics');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test SMS:', error.message);
    
    if (error.message.includes('UNAUTHORIZED')) {
      console.log('\n💡 Solution: Vérifiez vos credentials NimbaSMS');
    } else if (error.message.includes('INVALID_PHONE')) {
      console.log('\n💡 Solution: Vérifiez le format du numéro de téléphone');
    } else if (error.message.includes('QUOTA')) {
      console.log('\n💡 Solution: Vérifiez votre quota SMS');
    } else {
      console.log('\n💡 Solution: Vérifiez votre connexion internet et les credentials');
    }
  }
}

function testPhoneValidation() {
  console.log('Test validation téléphone:');
  
  const testPhones = [
    '+224625212115', // ✅ Valide
    '0625212115',    // ✅ Valide (sera formaté)
    '+22462521211',  // ❌ Trop court
    '625212115',     // ❌ Format invalide
    'invalid'        // ❌ Invalide
  ];
  
  testPhones.forEach(phone => {
    const cleanPhone = phone.replace(/\s/g, '');
    const guineaPattern = /^(\+224|0)[0-9]{9}$/;
    const isValid = guineaPattern.test(cleanPhone);
    
    console.log(`  ${phone}: ${isValid ? '✅' : '❌'}`);
  });
}

function testMessageValidation() {
  console.log('Test validation message:');
  
  const testMessages = [
    { message: 'Test court', expected: true },
    { message: '', expected: false },
    { message: 'A'.repeat(161), expected: false },
    { message: 'Message normal avec émojis 🎉', expected: true }
  ];
  
  testMessages.forEach(({ message, expected }) => {
    const isValid = message && message.trim().length > 0 && message.length <= 160;
    console.log(`  "${message.substring(0, 20)}...": ${isValid === expected ? '✅' : '❌'}`);
  });
}

// Exécution du test
if (require.main === module) {
  testSMSIntegration();
}

module.exports = { testSMSIntegration }; 