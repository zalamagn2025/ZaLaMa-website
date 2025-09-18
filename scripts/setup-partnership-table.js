const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupPartnershipTable() {
  try {
    /*console.log('🚀 Début de la configuration de la table partnership_requests...')*/
    
    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, '..', 'database', 'partnership_requests.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    /*console.log('📖 Fichier SQL lu avec succès')*/
    
    // Exécuter le SQL
    /*console.log('⚡ Exécution du SQL...')*/
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      // Si exec_sql n'existe pas, on essaie une approche différente
      /*console.log('⚠️ exec_sql non disponible, tentative d\'exécution directe...')*/
      
      // Diviser le SQL en commandes individuelles
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
      
      for (const command of commands) {
        if (command.trim()) {
          /*console.log(`⚡ Exécution: ${command.substring(0, 50)*/}...`);
          const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command + ';' });
          if (cmdError) {
            /*console.log(`⚠️ Commande ignorée (probablement déjà exécutée)*/: ${cmdError.message}`);
          }
        }
      }
    }
    
    /*console.log('✅ Configuration terminée avec succès !')*/
    
    // Vérifier que la table existe
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'partnership_requests');
    
    if (tableError) {
      /*console.log('⚠️ Impossible de vérifier l\'existence de la table:', tableError.message)*/
    } else if (tables && tables.length > 0) {
      /*console.log('✅ Table partnership_requests créée avec succès !')*/
      
      // Vérifier les données de test
      const { data: testData, error: dataError } = await supabase
        .from('partnership_requests')
        .select('count')
        .limit(1);
      
      if (dataError) {
        /*console.log('⚠️ Erreur lors de la vérification des données:', dataError.message)*/
      } else {
        /*console.log('✅ Données de test insérées avec succès !')*/
      }
    } else {
      /*console.log('❌ La table partnership_requests n\'a pas été créée')*/
    }
    
  } catch (error) {
    console.error('💥 Erreur lors de la configuration:', error);
    process.exit(1);
  }
}

// Instructions pour l'utilisateur
/*console.log('📋 Instructions:')*/
/*console.log('1. Assurez-vous que votre fichier .env.local contient les bonnes variables Supabase')*/
/*console.log('2. Exécutez ce script avec: node scripts/setup-partnership-table.js')*/
/*console.log('3. Ou copiez le contenu de database/partnership_requests.sql dans l\'éditeur SQL de Supabase')*/
/*console.log('')*/

setupPartnershipTable(); 