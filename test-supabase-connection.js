const { createClient } = require('@supabase/supabase-js');

// Test avec des valeurs par défaut pour voir si le problème vient des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY || 'example-key';

console.log('🔍 Test de connexion Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('📡 Tentative de connexion...');
    
    // Test simple de connexion
    const { data, error } = await supabase
      .from('partners')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }
    
    console.log('✅ Connexion réussie!');
    console.log('Données:', data);
    
  } catch (err) {
    console.error('💥 Erreur de connexion:', err.message);
  }
}

testConnection(); 