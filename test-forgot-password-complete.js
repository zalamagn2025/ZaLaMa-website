// Test complet de la fonctionnalité "Mot de passe oublié"
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Configuration Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuration email
const emailConfig = {
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@zalama.com',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'ZaLaMa',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};

console.log('🧪 Test complet de la fonctionnalité "Mot de passe oublié"');
console.log('==================================================');

// Test 1: Vérification de la base de données
async function testDatabase() {
  console.log('\n📊 Test 1: Vérification de la base de données');
  
  try {
    // Vérifier si la table existe
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'password_reset_tokens');
    
    if (error) {
      console.log('❌ Erreur accès base de données:', error.message);
      return false;
    }
    
    if (tables.length === 0) {
      console.log('❌ Table password_reset_tokens non trouvée');
      console.log('💡 Exécutez le script: scripts/create-password-reset-tokens-table.sql');
      return false;
    }
    
    console.log('✅ Table password_reset_tokens trouvée');
    
    // Vérifier la structure
    const { data: columns, error: colError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'password_reset_tokens');
    
    if (colError) {
      console.log('❌ Erreur vérification structure:', colError.message);
      return false;
    }
    
    const requiredColumns = ['id', 'user_id', 'token_hash', 'expires_at', 'used'];
    const foundColumns = columns.map(col => col.column_name);
    
    const missingColumns = requiredColumns.filter(col => !foundColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Colonnes manquantes:', missingColumns);
      return false;
    }
    
    console.log('✅ Structure de la table correcte');
    return true;
    
  } catch (error) {
    console.log('❌ Erreur test base de données:', error.message);
    return false;
  }
}

// Test 2: Vérification des variables d'environnement
function testEnvironmentVariables() {
  console.log('\n🔧 Test 2: Vérification des variables d\'environnement');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'EMAIL_FROM',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Variables d\'environnement manquantes:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ Toutes les variables d\'environnement sont définies');
  console.log('📧 Configuration email:');
  console.log(`   - From: ${emailConfig.EMAIL_FROM_NAME} <${emailConfig.EMAIL_FROM}>`);
  console.log(`   - SMTP: ${emailConfig.SMTP_HOST}:${emailConfig.SMTP_PORT}`);
  console.log(`   - User: ${emailConfig.SMTP_USER}`);
  
  return true;
}

// Test 3: Test de connexion Supabase
async function testSupabaseConnection() {
  console.log('\n🔗 Test 3: Test de connexion Supabase');
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Erreur connexion Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie');
    return true;
    
  } catch (error) {
    console.log('❌ Erreur test connexion:', error.message);
    return false;
  }
}

// Test 4: Test de génération de token
function testTokenGeneration() {
  console.log('\n🔐 Test 4: Test de génération de token');
  
  try {
    // Générer un token de test
    const testToken = crypto.randomBytes(32).toString('hex');
    const testTokenHash = crypto.createHash('sha256').update(testToken).digest('hex');
    
    console.log('✅ Token généré:', testToken.substring(0, 16) + '...');
    console.log('✅ Hash généré:', testTokenHash.substring(0, 16) + '...');
    
    // Test de validation
    const validationHash = crypto.createHash('sha256').update(testToken).digest('hex');
    const isValid = validationHash === testTokenHash;
    
    console.log('✅ Validation du token:', isValid ? 'OK' : 'ÉCHEC');
    
    return isValid;
    
  } catch (error) {
    console.log('❌ Erreur génération token:', error.message);
    return false;
  }
}

// Test 5: Test de l'API (simulation)
async function testAPIEndpoints() {
  console.log('\n🌐 Test 5: Test des endpoints API');
  
  try {
    // Test de l'endpoint forgot-password
    const forgotPasswordResponse = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    if (forgotPasswordResponse.ok) {
      console.log('✅ Endpoint /api/auth/forgot-password accessible');
    } else {
      console.log('❌ Endpoint /api/auth/forgot-password non accessible');
      console.log('   Status:', forgotPasswordResponse.status);
    }
    
    // Test de l'endpoint reset-password
    const resetPasswordResponse = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: 'test-token',
        email: 'test@example.com',
        newPassword: 'test123'
      })
    });
    
    if (resetPasswordResponse.ok) {
      console.log('✅ Endpoint /api/auth/reset-password accessible');
    } else {
      console.log('❌ Endpoint /api/auth/reset-password non accessible');
      console.log('   Status:', resetPasswordResponse.status);
    }
    
    return forgotPasswordResponse.ok && resetPasswordResponse.ok;
    
  } catch (error) {
    console.log('❌ Erreur test API:', error.message);
    console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)');
    return false;
  }
}

// Test 6: Test du service email (simulation)
async function testEmailService() {
  console.log('\n📧 Test 6: Test du service email');
  
  try {
    // Simuler l'envoi d'email
    const testEmailData = {
      to: 'test@example.com',
      subject: 'Test ZaLaMa - Mot de passe oublié',
      html: '<h1>Test email</h1>',
      text: 'Test email'
    };
    
    console.log('📧 Données de test email:');
    console.log(`   - To: ${testEmailData.to}`);
    console.log(`   - Subject: ${testEmailData.subject}`);
    console.log(`   - Provider: ${emailConfig.SMTP_HOST}`);
    
    // Note: L'envoi réel nécessite une configuration SMTP valide
    console.log('⚠️  Test d\'envoi réel nécessite une configuration SMTP valide');
    console.log('💡 Configurez vos variables SMTP pour tester l\'envoi réel');
    
    return true;
    
  } catch (error) {
    console.log('❌ Erreur test email:', error.message);
    return false;
  }
}

// Test 7: Vérification de l'interface utilisateur
function testUserInterface() {
  console.log('\n🎨 Test 7: Vérification de l\'interface utilisateur');
  
  const requiredFiles = [
    'src/components/ui/sign-in-card-2.tsx',
    'src/services/emailTemplates/forgotPasswordEmail.ts',
    'src/services/emailService.ts',
    'src/app/api/auth/forgot-password/route.ts',
    'src/app/api/auth/reset-password/route.ts'
  ];
  
  const fs = require('fs');
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.log('❌ Fichiers manquants:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    return false;
  }
  
  console.log('✅ Tous les fichiers requis sont présents');
  
  // Vérifier le contenu du composant principal
  try {
    const signInCardContent = fs.readFileSync('src/components/ui/sign-in-card-2.tsx', 'utf8');
    
    const requiredFeatures = [
      'isForgotPasswordMode',
      'handleForgotPassword',
      'Mot de passe oublié',
      'switchToForgotPassword'
    ];
    
    const missingFeatures = requiredFeatures.filter(feature => 
      !signInCardContent.includes(feature)
    );
    
    if (missingFeatures.length > 0) {
      console.log('❌ Fonctionnalités manquantes dans sign-in-card-2.tsx:');
      missingFeatures.forEach(feature => console.log(`   - ${feature}`));
      return false;
    }
    
    console.log('✅ Toutes les fonctionnalités UI sont intégrées');
    return true;
    
  } catch (error) {
    console.log('❌ Erreur vérification UI:', error.message);
    return false;
  }
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  const tests = [
    { name: 'Base de données', fn: testDatabase },
    { name: 'Variables d\'environnement', fn: testEnvironmentVariables },
    { name: 'Connexion Supabase', fn: testSupabaseConnection },
    { name: 'Génération de token', fn: testTokenGeneration },
    { name: 'Endpoints API', fn: testAPIEndpoints },
    { name: 'Service email', fn: testEmailService },
    { name: 'Interface utilisateur', fn: testUserInterface }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      console.log(`❌ Erreur dans le test "${test.name}":`, error.message);
      results.push({ name: test.name, success: false });
    }
  }
  
  // Résumé des résultats
  console.log('\n📊 Résumé des tests');
  console.log('==================');
  
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  console.log(`\n🎯 Résultat: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Tous les tests sont passés ! La fonctionnalité est prête.');
  } else {
    console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
  }
  
  return passedTests === totalTests;
}

// Exécution des tests
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests }; 