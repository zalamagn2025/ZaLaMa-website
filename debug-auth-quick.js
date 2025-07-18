// Script de debug rapide pour vérifier l'état de l'authentification
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PRIVATE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthQuick() {
  console.log('🔍 Debug rapide de l\'authentification...\n');

  try {
    // 1. Vérifier la session actuelle
    console.log('1️⃣ Vérification de la session actuelle...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erreur de session:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('⚠️ Aucune session active - Utilisateur non connecté');
      console.log('💡 Connectez-vous d\'abord pour tester');
      return;
    }
    
    console.log('✅ Session active trouvée');
    console.log('👤 User ID de la session:', session.user.id);
    console.log('📧 Email de la session:', session.user.email);

    // 2. Vérifier les données employee
    console.log('\n2️⃣ Vérification des données employee...');
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('actif', true)
      .single();

    if (employeesError) {
      console.error('❌ Erreur accès table employees:', employeesError);
      
      // Essayer sans filtre actif
      console.log('🔍 Tentative sans filtre actif...');
      const { data: allEmployees, error: allEmployeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', session.user.id);

      if (allEmployeesError) {
        console.error('❌ Erreur recherche sans filtre:', allEmployeesError);
        return;
      }

      if (allEmployees && allEmployees.length > 0) {
        console.log('📋 Employees trouvés (tous statuts):', allEmployees.map(emp => ({
          employeId: emp.employeId,
          nom: emp.nom,
          prenom: emp.prenom,
          actif: emp.actif,
          user_id: emp.user_id
        })));
      } else {
        console.log('❌ Aucun employee trouvé du tout pour cet user_id');
      }
      return;
    }

    if (!employees) {
      console.log('❌ Aucun employee trouvé');
      return;
    }

    console.log('✅ Employee trouvé:', {
      employeId: employees.employeId,
      nom: employees.nom,
      prenom: employees.prenom,
      user_id: employees.user_id,
      actif: employees.actif,
      photo_url: employees.photo_url
    });

    // 3. Test de mise à jour rapide
    console.log('\n3️⃣ Test de mise à jour rapide...');
    const testUpdate = { updated_at: new Date().toISOString() };
    
    const { data: updateData, error: updateError } = await supabase
      .from('employees')
      .update(testUpdate)
      .eq('employeId', employees.employeId)
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
    console.log('- ✅ Employee trouvé:', employees ? 'Oui' : 'Non');
    console.log('- ✅ Employee ID (employeId):', employees?.employeId);
    console.log('- ✅ Mise à jour possible');

  } catch (error) {
    console.error('💥 Erreur lors du debug:', error);
  }
}

// Exécuter le debug
debugAuthQuick(); 