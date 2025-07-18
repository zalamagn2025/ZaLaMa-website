// Script de vérification des variables d'environnement
// Exécutez avec: node scripts/check-env-variables.js

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Vérification des variables d\'environnement Supabase...\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PRIVATE_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: MANQUANT`);
    allGood = false;
  } else {
    console.log(`✅ ${varName}: CONFIGURÉ`);
    // Afficher les premiers caractères pour vérification
    const preview = value.substring(0, 20) + '...';
    console.log(`   Valeur: ${preview}`);
  }
});

console.log('\n📋 Résumé:');
if (allGood) {
  console.log('✅ Toutes les variables d\'environnement sont configurées');
} else {
  console.log('❌ Certaines variables d\'environnement sont manquantes');
  console.log('\n📝 Pour corriger:');
  console.log('1. Copiez le fichier .env.example vers .env.local');
  console.log('2. Remplissez les valeurs avec vos clés Supabase');
  console.log('3. Redémarrez le serveur de développement');
}

// Vérifier la connectivité Supabase
async function testSupabaseConnection() {
  console.log('\n🧪 Test de connexion à Supabase...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY
    );
    
    // Test simple de connexion
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Erreur de connexion:', error.message);
    } else {
      console.log('✅ Connexion à Supabase réussie');
    }
    
  } catch (error) {
    console.log('❌ Erreur lors du test de connexion:', error.message);
  }
}

// Exécuter le test de connexion
testSupabaseConnection(); 