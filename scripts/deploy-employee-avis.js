const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement de l\'Edge Function employee-avis...\n');

// Vérifier que Supabase CLI est installé
try {
  execSync('supabase --version', { stdio: 'pipe' });
  console.log('✅ Supabase CLI détecté');
} catch (error) {
  console.error('❌ Supabase CLI non trouvé');
  console.log('💡 Installez Supabase CLI: npm install -g supabase');
  process.exit(1);
}

// Vérifier la configuration Supabase
try {
  execSync('supabase status', { stdio: 'pipe' });
  console.log('✅ Projet Supabase configuré');
} catch (error) {
  console.error('❌ Projet Supabase non configuré');
  console.log('💡 Initialisez le projet: supabase init');
  process.exit(1);
}

// Vérifier que l'Edge Function existe
const functionPath = path.join(__dirname, '..', 'supabase', 'functions', 'employee-avis');
if (!fs.existsSync(functionPath)) {
  console.error('❌ Edge Function employee-avis non trouvée');
  console.log('💡 Créez l\'Edge Function: supabase functions new employee-avis');
  process.exit(1);
}

console.log('📁 Edge Function employee-avis trouvée');

// Déployer l'Edge Function
try {
  console.log('\n📤 Déploiement en cours...');
  execSync('supabase functions deploy employee-avis', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ Edge Function employee-avis déployée avec succès !');
  
  // Afficher les informations de déploiement
  console.log('\n📋 Informations de déploiement:');
  console.log('🔗 URL: https://[PROJECT_ID].supabase.co/functions/v1/employee-avis');
  console.log('📚 Documentation: Voir INTEGRATION_EDGE_FUNCTION.md');
  
  // Vérifier les variables d'environnement
  console.log('\n🔧 Variables d\'environnement requises:');
  console.log('- SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  
  console.log('\n🎉 Déploiement terminé !');
  
} catch (error) {
  console.error('\n❌ Erreur lors du déploiement:', error.message);
  console.log('\n💡 Solutions possibles:');
  console.log('1. Vérifiez votre connexion internet');
  console.log('2. Vérifiez vos permissions Supabase');
  console.log('3. Vérifiez la configuration du projet');
  process.exit(1);
}
