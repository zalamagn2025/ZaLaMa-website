const { createClient } = require('@supabase/supabase-js');

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPartnershipAPI() {
  console.log('🧪 Test de l\'API Partnership\n');

  // Test 1: Vérifier que la table existe
  console.log('1️⃣ Vérification de l\'existence de la table...');
  try {
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Erreur:', error.message);
      return;
    }
    console.log('✅ Table partnership_requests accessible\n');
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    return;
  }

  // Test 2: Compter les demandes existantes
  console.log('2️⃣ Comptage des demandes existantes...');
  try {
    const { count, error } = await supabase
      .from('partnership_requests')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Erreur:', error.message);
    } else {
      console.log(`✅ ${count} demandes trouvées dans la base\n`);
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }

  // Test 3: Récupérer les demandes de test
  console.log('3️⃣ Récupération des demandes de test...');
  try {
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('company_name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.log('❌ Erreur:', error.message);
    } else {
      console.log('✅ Demandes récupérées:');
      data.forEach((request, index) => {
        console.log(`   ${index + 1}. ${request.company_name} - ${request.status}`);
      });
      console.log('');
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }

  // Test 4: Test d'insertion (simulation)
  console.log('4️⃣ Test d\'insertion (simulation)...');
  const testData = {
    company_name: 'Test Company API',
    legal_status: 'SARL',
    rccm: 'GN-TEST-123',
    nif: '123456789',
    activity_domain: 'Informatique',
    headquarters_address: '123 Test Street, Conakry',
    phone: '+224 123 456 789',
    email: 'test@example.com',
    employees_count: 50,
    payroll: '250 000 000 GNF',
    cdi_count: 40,
    cdd_count: 10,
    payment_date: '2024-01-30',
    rep_full_name: 'Test Representative',
    rep_position: 'Directeur',
    rep_email: 'rep@example.com',
    rep_phone: '+224 123 456 790',
    hr_full_name: 'Test HR Manager',
    hr_email: 'hr@example.com',
    hr_phone: '+224 123 456 791',
    agreement: true,
    status: 'pending'
  };

  try {
    const { data, error } = await supabase
      .from('partnership_requests')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.log('❌ Erreur d\'insertion:', error.message);
    } else {
      console.log('✅ Test d\'insertion réussi!');
      console.log(`   ID: ${data.id}`);
      console.log(`   Entreprise: ${data.company_name}`);
      console.log(`   Statut: ${data.status}\n`);

      // Nettoyer le test
      console.log('5️⃣ Nettoyage du test...');
      const { error: deleteError } = await supabase
        .from('partnership_requests')
        .delete()
        .eq('company_name', 'Test Company API');

      if (deleteError) {
        console.log('⚠️ Erreur lors du nettoyage:', deleteError.message);
      } else {
        console.log('✅ Test nettoyé avec succès\n');
      }
    }
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }

  console.log('🎉 Tests terminés!');
  console.log('\n📋 Prochaines étapes:');
  console.log('1. Testez le formulaire sur /partnership/formulaire');
  console.log('2. Vérifiez les nouvelles demandes dans Supabase');
  console.log('3. Configurez le dashboard admin pour gérer les demandes');
}

testPartnershipAPI(); 