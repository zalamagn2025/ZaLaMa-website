const { formatSmsError, extractNimbaSMSErrorInfo, logSmsError } = require('./src/utils/smsErrorFormatter');

// Tests de la fonction formatSmsError
function testFormatSmsError() {
  console.log('🧪 Test de formatage des erreurs SMS');
  console.log('=====================================');

  const testCases = [
    // Test 1: Erreur string simple
    {
      name: 'Erreur string simple',
      error: 'Invalid phone number',
      expected: 'SMS: Invalid phone number'
    },
    
    // Test 2: Objet Error standard
    {
      name: 'Objet Error standard',
      error: new Error('Network timeout'),
      expected: 'SMS: Network timeout'
    },
    
    // Test 3: Objet avec message
    {
      name: 'Objet avec message',
      error: { message: 'Unauthorized access', statusCode: 401 },
      expected: 'SMS: Message: Unauthorized access | Status: 401'
    },
    
    // Test 4: Objet avec response HTTP
    {
      name: 'Objet avec response HTTP',
      error: {
        message: 'API Error',
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid credentials' }
        }
      },
      expected: 'SMS: Message: API Error | HTTP Status: 400 | HTTP Status Text: Bad Request | Response Data: {"error":"Invalid credentials"}'
    },
    
    // Test 5: Objet complexe NimbaSMS
    {
      name: 'Objet complexe NimbaSMS',
      error: {
        message: 'Quota exceeded',
        statusCode: 429,
        code: 'QUOTA_LIMIT',
        details: { remaining: 0, limit: 1000 }
      },
      expected: 'SMS: Message: Quota exceeded | Status: 429 | Code: QUOTA_LIMIT | Details: {"remaining":0,"limit":1000}'
    },
    
    // Test 6: Objet undefined/null
    {
      name: 'Objet undefined',
      error: undefined,
      expected: 'SMS: Erreur inconnue (undefined)'
    },
    
    // Test 7: Objet vide
    {
      name: 'Objet vide',
      error: {},
      expected: 'SMS: Erreur inconnue (object)'
    }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n📋 Test ${index + 1}: ${testCase.name}`);
    const result = formatSmsError(testCase.error);
    console.log('Résultat:', result);
    console.log('Attendu:', testCase.expected);
    console.log('✅ Test réussi' + (result.includes(testCase.expected.split(': ')[1]) ? '' : ' ❌ Échec'));
  });
}

// Tests de la fonction extractNimbaSMSErrorInfo
function testExtractNimbaSMSErrorInfo() {
  console.log('\n\n🔍 Test d\'extraction des informations d\'erreur');
  console.log('===============================================');

  const testCases = [
    {
      name: 'Erreur d\'authentification',
      error: { message: 'Unauthorized access', statusCode: 401 },
      expectedAuth: true,
      expectedNetwork: false,
      expectedQuota: false
    },
    {
      name: 'Erreur de quota',
      error: { message: 'Quota exceeded', statusCode: 429 },
      expectedAuth: false,
      expectedNetwork: false,
      expectedQuota: true
    },
    {
      name: 'Erreur réseau',
      error: { message: 'Network timeout', statusCode: 500 },
      expectedAuth: false,
      expectedNetwork: true,
      expectedQuota: false
    }
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n📋 Test ${index + 1}: ${testCase.name}`);
    const result = extractNimbaSMSErrorInfo(testCase.error);
    console.log('Résultat:', {
      message: result.message,
      isAuthError: result.isAuthError,
      isNetworkError: result.isNetworkError,
      isQuotaError: result.isQuotaError
    });
    
    const authOk = result.isAuthError === testCase.expectedAuth;
    const networkOk = result.isNetworkError === testCase.expectedNetwork;
    const quotaOk = result.isQuotaError === testCase.expectedQuota;
    
    console.log(`✅ Auth: ${authOk ? 'OK' : '❌'}`);
    console.log(`✅ Network: ${networkOk ? 'OK' : '❌'}`);
    console.log(`✅ Quota: ${quotaOk ? 'OK' : '❌'}`);
  });
}

// Test de la fonction logSmsError
function testLogSmsError() {
  console.log('\n\n📝 Test de logging des erreurs');
  console.log('==============================');

  const testError = {
    message: 'Test error message',
    statusCode: 400,
    code: 'TEST_ERROR',
    details: { test: 'data' }
  };

  console.log('Simulation de logSmsError avec:', testError);
  
  // Note: logSmsError utilise console.error, donc on ne peut pas facilement capturer la sortie
  // Mais on peut vérifier qu'elle ne plante pas
  try {
    logSmsError(testError, 'Test Context', { additional: 'data' });
    console.log('✅ logSmsError fonctionne sans erreur');
  } catch (error) {
    console.error('❌ logSmsError a planté:', error);
  }
}

// Test des cas d'erreur réels
function testRealWorldErrors() {
  console.log('\n\n🌍 Test des cas d\'erreur réels');
  console.log('==================================');

  const realWorldErrors = [
    {
      name: 'Erreur NimbaSMS typique',
      error: {
        message: 'Invalid phone number format',
        statusCode: 400,
        response: {
          data: { error: 'Phone number must be in international format' }
        }
      }
    },
    {
      name: 'Erreur de quota',
      error: {
        message: 'Daily quota exceeded',
        statusCode: 429,
        code: 'QUOTA_EXCEEDED',
        details: { dailyLimit: 1000, used: 1000 }
      }
    },
    {
      name: 'Erreur d\'authentification',
      error: {
        message: 'Invalid API credentials',
        statusCode: 401,
        code: 'AUTH_ERROR'
      }
    },
    {
      name: 'Erreur réseau',
      error: {
        message: 'Connection timeout',
        statusCode: 500,
        code: 'NETWORK_ERROR'
      }
    }
  ];

  realWorldErrors.forEach((testCase, index) => {
    console.log(`\n📋 Cas réel ${index + 1}: ${testCase.name}`);
    const formatted = formatSmsError(testCase.error);
    const info = extractNimbaSMSErrorInfo(testCase.error);
    
    console.log('Message formaté:', formatted);
    console.log('Type d\'erreur:', {
      isAuth: info.isAuthError,
      isNetwork: info.isNetworkError,
      isQuota: info.isQuotaError
    });
  });
}

// Exécution des tests
if (require.main === module) {
  testFormatSmsError();
  testExtractNimbaSMSErrorInfo();
  testLogSmsError();
  testRealWorldErrors();
  
  console.log('\n\n🎉 Tous les tests de gestion d\'erreurs sont terminés !');
  console.log('\n📝 Prochaines étapes:');
  console.log('1. Testez avec de vrais appels SMS');
  console.log('2. Vérifiez les logs dans la console');
  console.log('3. Validez que les erreurs sont bien formatées');
}

module.exports = {
  testFormatSmsError,
  testExtractNimbaSMSErrorInfo,
  testLogSmsError,
  testRealWorldErrors
}; 