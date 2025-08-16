// Script de test pour diagnostiquer l'Edge Function employee-auth
const testEdgeFunction = async () => {
  console.log('🔍 Test de l\'Edge Function employee-auth...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mspmrzlqhwpdkkburjiw.supabase.co';
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/login`;
  
  console.log('📍 URL de l\'Edge Function:', edgeFunctionUrl);
  
  // Test 1: Vérifier si l'Edge Function est accessible
  try {
    console.log('🧪 Test 1: Vérification de l\'accessibilité...');
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Réponse OPTIONS:', response.status, response.statusText);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
    
  } catch (error) {
    console.error('❌ Erreur lors du test OPTIONS:', error);
  }
  
  // Test 2: Test de connexion avec des données d'exemple
  try {
    console.log('🧪 Test 2: Test de connexion...');
    
    const testData = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('✅ Réponse POST:', response.status, response.statusText);
    
    const result = await response.json();
    console.log('📋 Corps de la réponse:', result);
    
    if (response.status === 401) {
      console.log('🔍 Analyse de l\'erreur 401:');
      console.log('- Vérifiez que l\'Edge Function est bien déployée');
      console.log('- Vérifiez les variables d\'environnement dans Supabase');
      console.log('- Vérifiez les politiques RLS sur les tables');
      console.log('- Vérifiez que l\'utilisateur existe dans la base de données');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test POST:', error);
  }
  
  // Test 3: Vérifier la configuration Supabase
  try {
    console.log('🧪 Test 3: Vérification de la configuration...');
    
    const configUrl = `${supabaseUrl}/rest/v1/`;
    const response = await fetch(configUrl, {
      method: 'GET',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
      },
    });
    
    console.log('✅ Test de configuration Supabase:', response.status);
    
  } catch (error) {
    console.error('❌ Erreur lors du test de configuration:', error);
  }
};

// Test 4: Vérifier les variables d'environnement
const checkEnvironmentVariables = () => {
  console.log('🧪 Test 4: Variables d\'environnement...');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: Non défini`);
    }
  });
};

// Exécuter les tests
const runAllTests = async () => {
  console.log('🚀 Démarrage des tests de diagnostic...');
  
  checkEnvironmentVariables();
  await testEdgeFunction();
  
  console.log('🏁 Tests terminés');
};

// Exécuter si on est dans Node.js
if (typeof window === 'undefined') {
  runAllTests();
}

module.exports = { testEdgeFunction, checkEnvironmentVariables, runAllTests };
