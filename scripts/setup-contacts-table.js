const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies dans votre fichier .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupContactsTable() {
  try {
    /*console.log('🔧 Configuration de la table contacts...')*/
    
    // Lire le fichier SQL
    const fs = require('fs');
    const path = require('path');
    const sqlPath = path.join(__dirname, 'create-contacts-table.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ Fichier create-contacts-table.sql non trouvé');
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Exécuter le script SQL
    /*console.log('📝 Exécution du script SQL...')*/
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Erreur lors de l\'exécution du script SQL:', error);
      
      // Fallback: essayer de créer la table manuellement
      /*console.log('🔄 Tentative de création manuelle de la table...')*/
      await createTableManually();
    } else {
      /*console.log('✅ Script SQL exécuté avec succès')*/
    }
    
    // Vérifier que la table existe
    /*console.log('🔍 Vérification de la table contacts...')*/
    const { data: contacts, error: checkError } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Erreur lors de la vérification:', checkError);
      /*console.log('💡 Veuillez exécuter manuellement le script SQL dans votre dashboard Supabase')*/
      /*console.log('📁 Fichier: scripts/create-contacts-table.sql')*/
    } else {
      /*console.log('✅ Table contacts créée et accessible!')*/
      /*console.log(`📊 Nombre de contacts de test: ${contacts.length}`)*/
    }
    
  } catch (error) {
    console.error('💥 Erreur:', error);
    /*console.log('💡 Veuillez exécuter manuellement le script SQL dans votre dashboard Supabase')*/
    /*console.log('📁 Fichier: scripts/create-contacts-table.sql')*/
  }
}

async function createTableManually() {
  try {
    // Créer la table contacts
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contacts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          nom VARCHAR(100) NOT NULL,
          prenom VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL,
          sujet VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          statut VARCHAR(50) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'repondu', 'archive')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (createError) {
      console.error('❌ Erreur création table:', createError);
      return;
    }
    
    /*console.log('✅ Table contacts créée manuellement')*/
    
    // Insérer des données de test
    const { error: insertError } = await supabase
      .from('contacts')
      .insert([
        {
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@example.com',
          sujet: 'Demande d\'information',
          message: 'Bonjour, je souhaiterais avoir plus d\'informations sur vos services.',
          statut: 'nouveau'
        }
      ]);
    
    if (insertError) {
      console.error('❌ Erreur insertion test:', insertError);
    } else {
      /*console.log('✅ Données de test insérées')*/
    }
    
  } catch (error) {
    console.error('❌ Erreur création manuelle:', error);
  }
}

// Exécuter le script
setupContactsTable(); 