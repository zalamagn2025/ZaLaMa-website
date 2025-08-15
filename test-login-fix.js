// Script de test pour vérifier la correction de l'authentification
const testLoginFix = async () => {
  console.log('🧪 Test de la correction de l\'authentification...');
  
  // Test 1: Vérifier les variables d'environnement
  console.log('📋 Variables d\'environnement:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Défini' : '❌ Non défini');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Défini' : '❌ Non défini');
  
  // Test 2: Tester l'API route Next.js directement
  try {
    console.log('🔐 Test de l\'API route /api/auth/login...');
    
    const testData = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📋 Réponse API route:', response.status, response.statusText);
    
    const result = await response.json();
    console.log('📋 Corps de la réponse:', result);
    
    if (response.ok) {
      console.log('✅ API route fonctionne correctement');
    } else {
      console.log('❌ Erreur API route:', result);
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test API route:', error);
  }
  
  // Test 3: Tester l'Edge Function directement avec les bons headers
  try {
    console.log('🔐 Test de l\'Edge Function avec headers...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Variables d\'environnement manquantes');
      return;
    }
    
    const testData = {
      email: 'test@example.com',
      password: 'testpassword'
    };
    
    const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📋 Réponse Edge Function:', response.status, response.statusText);
    
    const result = await response.json();
    console.log('📋 Corps de la réponse Edge Function:', result);
    
    if (response.ok) {
      console.log('✅ Edge Function fonctionne avec les bons headers');
    } else {
      console.log('❌ Erreur Edge Function:', result);
      
      // Analyser l'erreur
      if (response.status === 401) {
        console.log('🔍 Analyse erreur 401:');
        console.log('- Vérifiez que l\'Edge Function est déployée');
        console.log('- Vérifiez les variables d\'environnement dans Supabase');
        console.log('- Vérifiez que l\'utilisateur existe dans la base');
      } else if (response.status === 404) {
        console.log('🔍 Analyse erreur 404:');
        console.log('- L\'Edge Function n\'existe pas ou n\'est pas déployée');
        console.log('- Vérifiez le nom de l\'Edge Function');
      }
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test Edge Function:', error);
  }
};

// Exécuter le test
if (typeof window !== 'undefined') {
  // Attendre que la page soit chargée
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testLoginFix);
  } else {
    testLoginFix();
  }
}

module.exports = { testLoginFix };
