// Script de debug pour vérifier l'état de l'authentification
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthState() {
  console.log('🔍 Debug de l\'état d\'authentification...\n');

  try {
    // 1. Vérifier la session actuelle
    console.log('1️⃣ Vérification de la session actuelle...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erreur de session:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('⚠️ Aucune session active');
      console.log('💡 Pour tester, vous devez vous connecter d\'abord');
      return;
    }
    
    console.log('✅ Session active trouvée');
    console.log('👤 User ID de la session:', session.user.id);
    console.log('📧 Email de la session:', session.user.email);

    // 2. Vérifier les données employé correspondantes
    console.log('\n2️⃣ Vérification des données employé...');
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('actif', true);

    if (employeesError) {
      console.error('❌ Erreur accès table employees:', employeesError);
      return;
    }

    if (!employees || employees.length === 0) {
      console.log('⚠️ Aucun employé trouvé pour cet utilisateur');
      console.log('🔍 Recherche sans filtre actif...');
      
      const { data: allEmployees, error: allEmployeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', session.user.id);

      if (allEmployeesError) {
        console.error('❌ Erreur recherche sans filtre:', allEmployeesError);
        return;
      }

      if (allEmployees && allEmployees.length > 0) {
        console.log('📋 Employés trouvés (tous statuts):', allEmployees.map(emp => ({
          id: emp.id,
          nom: emp.nom,
          prenom: emp.prenom,
          actif: emp.actif,
          user_id: emp.user_id
        })));
      } else {
        console.log('❌ Aucun employé trouvé du tout pour cet user_id');
      }
      return;
    }

    const employee = employees[0];
    console.log('✅ Employé trouvé:', {
      id: employee.id,
      nom: employee.nom,
      prenom: employee.prenom,
      user_id: employee.user_id,
      actif: employee.actif,
      photo_url: employee.photo_url
    });

    // 3. Vérifier la structure de la table employees
    console.log('\n3️⃣ Vérification de la structure de la table employees...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('employees')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Erreur accès structure table:', tableError);
      return;
    }

    if (tableInfo && tableInfo.length > 0) {
      console.log('📋 Colonnes disponibles:', Object.keys(tableInfo[0]));
    }

    // 4. Test de mise à jour d'un champ
    console.log('\n4️⃣ Test de mise à jour d\'un champ...');
    const testUpdate = { updated_at: new Date().toISOString() };
    
    const { data: updateData, error: updateError } = await supabase
      .from('employees')
      .update(testUpdate)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erreur mise à jour test:', updateError);
    } else {
      console.log('✅ Mise à jour test réussie');
    }

    console.log('\n✅ Debug terminé avec succès !');
    console.log('\n📋 Résumé :');
    console.log('- ✅ Session active');
    console.log('- ✅ User ID:', session.user.id);
    console.log('- ✅ Employé trouvé:', employee ? 'Oui' : 'Non');
    console.log('- ✅ Structure table accessible');
    console.log('- ✅ Mise à jour possible');

  } catch (error) {
    console.error('💥 Erreur lors du debug:', error);
  }
}

// Exécuter le debug
debugAuthState(); 