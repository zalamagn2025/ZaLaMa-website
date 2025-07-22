const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFirstLoginFlow() {
  console.log('🧪 Test du flux de première connexion...\n');

  try {
    // 1. Tester la connexion avec un utilisateur existant
    console.log('1️⃣ Test de connexion...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com', // Remplacez par un email de test
      password: 'password123'
    });

    if (signInError) {
      console.error('❌ Erreur de connexion:', signInError.message);
      return;
    }

    console.log('✅ Connexion réussie:', signInData.user.email);

    // 2. Vérifier le statut de première connexion
    console.log('\n2️⃣ Vérification du statut de première connexion...');
    
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('require_password_change')
      .eq('email', signInData.user.email)
      .single();

    if (adminError) {
      console.error('❌ Erreur lors de la récupération des données admin:', adminError.message);
      return;
    }

    console.log('✅ Statut require_password_change:', adminUser.require_password_change);

    // 3. Tester l'API de vérification de première connexion
    console.log('\n3️⃣ Test de l\'API check-first-login...');
    
    const checkResponse = await fetch('http://localhost:3000/api/auth/check-first-login', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${signInData.session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      console.log('✅ API check-first-login:', checkData);
    } else {
      console.error('❌ Erreur API check-first-login:', checkResponse.status);
    }

    // 4. Tester le changement de mot de passe
    console.log('\n4️⃣ Test du changement de mot de passe...');
    
    const changePasswordResponse = await fetch('http://localhost:3000/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${signInData.session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      }),
    });

    if (changePasswordResponse.ok) {
      const changeData = await changePasswordResponse.json();
      console.log('✅ Changement de mot de passe réussi:', changeData);
    } else {
      const errorData = await changePasswordResponse.json();
      console.error('❌ Erreur changement de mot de passe:', errorData);
    }

    // 5. Vérifier que le statut a été mis à jour
    console.log('\n5️⃣ Vérification de la mise à jour du statut...');
    
    const { data: updatedAdminUser, error: updatedAdminError } = await supabase
      .from('admin_users')
      .select('require_password_change')
      .eq('email', signInData.user.email)
      .single();

    if (updatedAdminError) {
      console.error('❌ Erreur lors de la vérification mise à jour:', updatedAdminError.message);
      return;
    }

    console.log('✅ Nouveau statut require_password_change:', updatedAdminUser.require_password_change);

    // 6. Tester l'API mark-password-changed
    console.log('\n6️⃣ Test de l\'API mark-password-changed...');
    
    const markResponse = await fetch('http://localhost:3000/api/auth/mark-password-changed', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${signInData.session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (markResponse.ok) {
      const markData = await markResponse.json();
      console.log('✅ API mark-password-changed:', markData);
    } else {
      const errorData = await markResponse.json();
      console.error('❌ Erreur API mark-password-changed:', errorData);
    }

    console.log('\n✅ Test du flux de première connexion terminé avec succès!');

  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
  }
}

async function testAdminUsersTable() {
  console.log('🧪 Test de la table admin_users...\n');

  try {
    // Vérifier si la table existe
    console.log('1️⃣ Vérification de la structure de la table...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Erreur lors de l\'accès à la table admin_users:', tableError.message);
      console.log('💡 Assurez-vous d\'avoir exécuté le script create-admin-users-table.sql');
      return;
    }

    console.log('✅ Table admin_users accessible');

    // Insérer un utilisateur de test
    console.log('\n2️⃣ Insertion d\'un utilisateur de test...');
    
    const testUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@example.com',
      display_name: 'Utilisateur Test',
      role: 'user',
      active: true,
      require_password_change: true
    };

    const { data: insertData, error: insertError } = await supabase
      .from('admin_users')
      .upsert(testUser, { onConflict: 'email' })
      .select();

    if (insertError) {
      console.error('❌ Erreur lors de l\'insertion:', insertError.message);
      return;
    }

    console.log('✅ Utilisateur de test inséré/mis à jour:', insertData[0].email);

    // Vérifier les données
    console.log('\n3️⃣ Vérification des données...');
    
    const { data: users, error: selectError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'test@example.com');

    if (selectError) {
      console.error('❌ Erreur lors de la sélection:', selectError.message);
      return;
    }

    console.log('✅ Données récupérées:', users);

    console.log('\n✅ Test de la table admin_users terminé avec succès!');

  } catch (error) {
    console.error('💥 Erreur lors du test de la table:', error);
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage des tests de première connexion...\n');

  // Test de la table admin_users
  await testAdminUsersTable();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test du flux de première connexion
  await testFirstLoginFlow();

  console.log('\n🎉 Tous les tests terminés!');
}

// Exécuter les tests
main().catch(console.error); 