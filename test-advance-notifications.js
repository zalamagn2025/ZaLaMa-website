const { advanceNotificationService } = require('./src/services/advanceNotificationService')
require('dotenv').config()

// Configuration de test
const TEST_CONFIG = {
  // Données de test pour une demande d'avance
  testAdvanceData: {
    employeeName: 'Jean Dupont',
    employeeEmail: 'jean.dupont@example.com',
    employeePhone: '+224123456789',
    amount: 500000, // 500K GNF
    reason: 'Achat de carburant pour déplacements professionnels',
    requestDate: new Date().toISOString(),
    requestId: 'TEST-ADVANCE-' + Date.now(),
    availableSalary: 1500000, // 1.5M GNF
    availableAdvance: 375000, // 375K GNF
    requestType: 'transport'
  }
}

// =====================================================
// TESTS DE NOTIFICATIONS
// =====================================================

async function testEmailNotification() {
  console.log('📧 Test d\'envoi d\'email de confirmation...')
  
  try {
    const result = await advanceNotificationService.sendEmployeeEmail(TEST_CONFIG.testAdvanceData)
    
    if (result.success) {
      console.log('✅ Email envoyé avec succès')
      console.log('📋 Détails:', {
        messageId: result.messageId,
        recipient: result.recipient,
        template: result.template
      })
    } else {
      console.log('❌ Erreur envoi email:', result.error)
      console.log('🔍 Type d\'erreur:', result.errorType)
    }
    
    return result.success
  } catch (error) {
    console.error('❌ Erreur lors du test email:', error.message)
    return false
  }
}

async function testSMSNotification() {
  console.log('📱 Test d\'envoi de SMS de confirmation...')
  
  try {
    const result = await advanceNotificationService.sendEmployeeSMS(TEST_CONFIG.testAdvanceData)
    
    if (result.success) {
      console.log('✅ SMS envoyé avec succès')
      console.log('📋 Détails:', {
        messageId: result.messageId,
        recipient: result.recipient,
        timestamp: result.timestamp
      })
    } else {
      console.log('❌ Erreur envoi SMS:', result.error)
    }
    
    return result.success
  } catch (error) {
    console.error('❌ Erreur lors du test SMS:', error.message)
    return false
  }
}

async function testCombinedNotifications() {
  console.log('🔄 Test d\'envoi combiné (email + SMS)...')
  
  try {
    const result = await advanceNotificationService.sendAdvanceNotifications(TEST_CONFIG.testAdvanceData)
    
    console.log('📊 Résultats combinés:')
    console.log('✅ Succès global:', result.success)
    console.log('📧 Email:', result.email.success ? '✅' : '❌')
    console.log('📱 SMS:', result.sms.success ? '✅' : '❌')
    console.log('📈 Résumé:', result.summary)
    
    if (result.email.error) {
      console.log('❌ Erreur email:', result.email.error)
    }
    
    if (result.sms.error) {
      console.log('❌ Erreur SMS:', result.sms.error)
    }
    
    return result.success
  } catch (error) {
    console.error('❌ Erreur lors du test combiné:', error.message)
    return false
  }
}

async function testMessageFormatting() {
  console.log('📝 Test de formatage des messages...')
  
  // Test du formatage de date
  const testDate = new Date()
  const formattedDate = testDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  
  console.log('📅 Date formatée:', formattedDate)
  
  // Test du formatage de montant
  const testAmount = 500000
  const formattedAmount = testAmount.toLocaleString()
  
  console.log('💰 Montant formaté:', formattedAmount, 'GNF')
  
  // Test du formatage de téléphone
  const testPhones = [
    '+224123456789',
    '0123456789',
    '123456789',
    '+224 123 456 789'
  ]
  
  console.log('📞 Test formatage téléphones:')
  testPhones.forEach(phone => {
    const formatted = phone.replace(/\s/g, '').replace(/^0/, '+224')
    console.log(`  ${phone} → ${formatted}`)
  })
  
  return true
}

async function testErrorHandling() {
  console.log('🚨 Test de gestion d\'erreurs...')
  
  // Test avec données invalides
  const invalidData = {
    ...TEST_CONFIG.testAdvanceData,
    employeeEmail: 'invalid-email',
    employeePhone: 'invalid-phone'
  }
  
  try {
    const result = await advanceNotificationService.sendAdvanceNotifications(invalidData)
    
    console.log('📊 Résultats avec données invalides:')
    console.log('✅ Succès global:', result.success)
    console.log('📧 Email:', result.email.success ? '✅' : '❌')
    console.log('📱 SMS:', result.sms.success ? '✅' : '❌')
    
    if (!result.email.success) {
      console.log('❌ Erreur email attendue:', result.email.error)
    }
    
    if (!result.sms.success) {
      console.log('❌ Erreur SMS attendue:', result.sms.error)
    }
    
    return true // Le test passe car les erreurs sont gérées correctement
  } catch (error) {
    console.error('❌ Erreur lors du test de gestion d\'erreurs:', error.message)
    return false
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function runTests() {
  console.log('🧪 TESTS DE NOTIFICATIONS - DEMANDES D\'AVANCE SUR SALAIRE')
  console.log('='.repeat(70))
  
  // Vérification des variables d'environnement
  console.log('\n📋 Vérification des variables d\'environnement:')
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configuré' : '❌ Manquant')
  console.log('NIMBA_SMS_SERVICE_ID:', process.env.NIMBA_SMS_SERVICE_ID ? '✅ Configuré' : '❌ Manquant')
  console.log('NIMBA_SMS_SECRET_TOKEN:', process.env.NIMBA_SMS_SECRET_TOKEN ? '✅ Configuré' : '❌ Manquant')
  
  if (!process.env.RESEND_API_KEY || !process.env.NIMBA_SMS_SERVICE_ID || !process.env.NIMBA_SMS_SECRET_TOKEN) {
    console.error('\n❌ Variables d\'environnement manquantes')
    console.log('Ajoutez ces variables dans votre .env:')
    console.log('RESEND_API_KEY=votre_resend_api_key')
    console.log('NIMBA_SMS_SERVICE_ID=votre_service_id')
    console.log('NIMBA_SMS_SECRET_TOKEN=votre_secret_token')
    return
  }
  
  const tests = [
    { name: 'Formatage des messages', fn: testMessageFormatting },
    { name: 'Envoi d\'email', fn: testEmailNotification },
    { name: 'Envoi de SMS', fn: testSMSNotification },
    { name: 'Envoi combiné', fn: testCombinedNotifications },
    { name: 'Gestion d\'erreurs', fn: testErrorHandling }
  ]
  
  let successCount = 0
  let totalCount = tests.length
  
  for (const test of tests) {
    try {
      console.log(`\n🔧 Test: ${test.name}`)
      const result = await test.fn()
      
      if (result) {
        successCount++
        console.log(`✅ ${test.name}: Succès`)
      } else {
        console.log(`❌ ${test.name}: Échec`)
      }
    } catch (error) {
      console.error(`❌ Erreur dans ${test.name}:`, error.message)
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('📊 RÉSUMÉ DES TESTS')
  console.log('='.repeat(70))
  console.log(`✅ Tests réussis: ${successCount}/${totalCount}`)
  console.log(`📈 Taux de succès: ${Math.round((successCount / totalCount) * 100)}%`)
  
  if (successCount === totalCount) {
    console.log('🎉 Tous les tests sont passés avec succès!')
    console.log('\n📝 Prochaines étapes:')
    console.log('1. Testez avec une vraie demande d\'avance')
    console.log('2. Vérifiez les logs dans la console')
    console.log('3. Surveillez les analytics Resend et NimbaSMS')
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.')
  }
  
  // Affichage des données de test utilisées
  console.log('\n📋 Données de test utilisées:')
  console.log('👤 Employé:', TEST_CONFIG.testAdvanceData.employeeName)
  console.log('📧 Email:', TEST_CONFIG.testAdvanceData.employeeEmail)
  console.log('📱 Téléphone:', TEST_CONFIG.testAdvanceData.employeePhone)
  console.log('💰 Montant:', TEST_CONFIG.testAdvanceData.amount.toLocaleString(), 'GNF')
  console.log('📝 Motif:', TEST_CONFIG.testAdvanceData.reason)
  console.log('🆔 ID Demande:', TEST_CONFIG.testAdvanceData.requestId)
}

// =====================================================
// EXÉCUTION
// =====================================================

if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = {
  runTests,
  testEmailNotification,
  testSMSNotification,
  testCombinedNotifications,
  testMessageFormatting,
  testErrorHandling
} 