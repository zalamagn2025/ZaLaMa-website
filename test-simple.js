// Test simple de connexion Supabase
require('dotenv').config();

const testSupabase = async () => {
  console.log('🧪 Test de connexion Supabase...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('📋 Variables d\'environnement:', {
      url: supabaseUrl ? '✅ Configurée' : '❌ Manquante',
      anonKey: anonKey ? '✅ Configurée' : '❌ Manquante'
    });

    if (!supabaseUrl || !anonKey) {
      console.error('❌ Variables d\'environnement manquantes');
      return;
    }

    const supabase = createClient(supabaseUrl, anonKey);
    
    // Test simple de lecture de la table partners
    console.log('🔍 Test de lecture de la table partners...');
    const { data, error } = await supabase
      .from('partners')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erreur Supabase:', error.message);
      console.log('💡 Vérifiez que:');
      console.log('   1. Votre URL Supabase est correcte');
      console.log('   2. Votre clé anon est correcte');
      console.log('   3. La table "partners" existe');
      console.log('   4. Les politiques RLS permettent la lecture');
    } else {
      console.log('✅ Connexion Supabase réussie !');
      console.log('📊 Données:', data);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

testSupabase();
