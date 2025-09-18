// Script de diagnostic pour la configuration Supabase Auth
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

/*console.log('🔍 Diagnostic de la configuration Supabase Auth')*/
/*console.log('=============================================')*/

// Configuration Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test 1: Vérification des variables d'environnement
function checkEnvironmentVariables() {
  /*console.log('\n🔧 Test 1: Vérification des variables d\'environnement')*/
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    /*console.log('❌ Variables d\'environnement manquantes:')*/
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }
  
  /*console.log('✅ Toutes les variables d\'environnement sont définies')*/
  /*console.log('📋 Configuration actuelle:')*/
  /*console.log(`   - NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)*/
  /*console.log(`   - NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL}`)*/
  /*console.log(`   - SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurée' : '❌ Manquante'}`)*/
  
  return true;
}

// Test 2: Test de connexion Supabase
async function testSupabaseConnection() {
  /*console.log('\n🔗 Test 2: Test de connexion Supabase')*/
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('count')
      .limit(1);
    
    if (error) {
      /*console.log('❌ Erreur connexion Supabase:', error.message)*/
      return false;
    }
    
    /*console.log('✅ Connexion Supabase réussie')*/
    return true;
    
  } catch (error) {
    /*console.log('❌ Erreur test connexion:', error.message)*/
    return false;
  }
}

// Test 3: Test de l'API forgot-password
async function testForgotPasswordAPI() {
  /*console.log('\n🌐 Test 3: Test de l\'API forgot-password')*/
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const data = await response.json();
    
    /*console.log('📊 Réponse API:')*/
    /*console.log(`   - Status: ${response.status}`)*/
    /*console.log(`   - Success: ${data.success}`)*/
    /*console.log(`   - Message: ${data.message || data.error}`)*/
    
    if (response.ok && data.success) {
      /*console.log('✅ API forgot-password fonctionne')*/
      return true;
    } else {
      /*console.log('❌ Erreur API forgot-password')*/
      return false;
    }
  } catch (error) {
    /*console.log('❌ Erreur test API:', error.message)*/
    /*console.log('💡 Assurez-vous que le serveur Next.js est démarré (npm run dev)*/');
    return false;
  }
}

// Test 4: Vérification des URLs de redirection
function checkRedirectURLs() {
  /*console.log('\n🔗 Test 4: Vérification des URLs de redirection')*/
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const resetUrl = `${appUrl}/reset-password`;
  const callbackUrl = `${appUrl}/auth/callback`;
  
  /*console.log('📋 URLs de redirection:')*/
  /*console.log(`   - App URL: ${appUrl}`)*/
  /*console.log(`   - Reset URL: ${resetUrl}`)*/
  /*console.log(`   - Callback URL: ${callbackUrl}`)*/
  
  // Vérifier que l'URL est valide
  if (!appUrl || !appUrl.startsWith('http')) {
    /*console.log('❌ URL d\'application invalide')*/
    return false;
  }
  
  /*console.log('✅ URLs de redirection valides')*/
  /*console.log('\n📝 URLs à configurer dans Supabase Dashboard:')*/
  /*console.log('   Authentication → URL Configuration')*/
  /*console.log('   Site URL:', appUrl)*/
  /*console.log('   Redirect URLs:')*/
  /*console.log(`     - ${resetUrl}`)*/
  /*console.log(`     - ${callbackUrl}`)*/
  /*console.log(`     - http://localhost:3000/reset-password`)*/
  /*console.log(`     - http://localhost:3000/auth/callback`)*/
  
  return true;
}

// Test 5: Vérification des fichiers requis
function checkRequiredFiles() {
  /*console.log('\n📁 Test 5: Vérification des fichiers requis')*/
  
  const requiredFiles = [
    'src/app/api/auth/forgot-password/route.ts',
    'src/app/reset-password/page.tsx',
    'src/components/ui/sign-in-card-2.tsx'
  ];
  
  const fs = require('fs');
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    /*console.log('❌ Fichiers manquants:')*/
    missingFiles.forEach(file => console.log(`   - ${file}`));
    return false;
  }
  
  /*console.log('✅ Tous les fichiers requis sont présents')*/
  return true;
}

// Test 6: Simulation de l'erreur
function simulateError() {
  /*console.log('\n🚨 Test 6: Simulation de l\'erreur')*/
  
  /*console.log('🔍 Erreur détectée: access_denied&error_code=otp_expired')*/
  /*console.log('\n📋 Causes possibles:')*/
  /*console.log('1. URLs de redirection non configurées dans Supabase Dashboard')*/
  /*console.log('2. Token de réinitialisation expiré (1 heure par défaut)*/');
  /*console.log('3. Configuration Supabase incorrecte')*/
  /*console.log('4. Variables d\'environnement manquantes')*/
  
  /*console.log('\n🛠️ Solutions recommandées:')*/
  /*console.log('1. Configurer les URLs de redirection dans Supabase Dashboard')*/
  /*console.log('2. Demander un nouveau lien de réinitialisation')*/
  /*console.log('3. Vérifier les variables d\'environnement')*/
  /*console.log('4. Tester avec un nouvel email')*/
  
  return true;
}

// Fonction principale de diagnostic
async function runDiagnostic() {
  /*console.log('🚀 Démarrage du diagnostic...\n')*/
  
  const tests = [
    { name: 'Variables d\'environnement', fn: checkEnvironmentVariables },
    { name: 'Connexion Supabase', fn: testSupabaseConnection },
    { name: 'API forgot-password', fn: testForgotPasswordAPI },
    { name: 'URLs de redirection', fn: checkRedirectURLs },
    { name: 'Fichiers requis', fn: checkRequiredFiles },
    { name: 'Simulation d\'erreur', fn: simulateError }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      /*console.log(`❌ Erreur dans le test "${test.name}":`, error.message)*/
      results.push({ name: test.name, success: false });
    }
  }
  
  // Résumé des résultats
  /*console.log('\n📊 Résumé du diagnostic')*/
  /*console.log('========================')*/
  
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    /*console.log(`${status} ${result.name}`)*/
  });
  
  /*console.log(`\n🎯 Résultat: ${passedTests}/${totalTests} tests réussis`)*/
  
  // Recommandations
  /*console.log('\n💡 Recommandations:')*/
  /*console.log('1. Allez dans Supabase Dashboard → Authentication → URL Configuration')*/
  /*console.log('2. Configurez les URLs de redirection listées ci-dessus')*/
  /*console.log('3. Testez avec un nouvel email de réinitialisation')*/
  /*console.log('4. Vérifiez les logs Supabase pour plus de détails')*/
  
  return passedTests === totalTests;
}

// Exécution du diagnostic
if (require.main === module) {
  runDiagnostic().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runDiagnostic }; 