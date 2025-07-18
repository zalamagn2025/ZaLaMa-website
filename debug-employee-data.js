// Script de debug pour vérifier les données employee
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PRIVATE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugEmployeeData() {
  console.log('🔍 Debug des données employee...\n');

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

    // 2. Vérifier les données employee correspondantes
    console.log('\n2️⃣ Vérification des données employee...');
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
      console.log('⚠️ Aucun employee trouvé pour cet utilisateur');
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
        console.log('📋 Employees trouvés (tous statuts):', allEmployees.map(emp => ({
          id: emp.id,
          employeId: emp.employeId, // ✅ Champ employeId
          nom: emp.nom,
          prenom: emp.prenom,
          actif: emp.actif,
          user_id: emp.user_id,
          uid: emp.uid, // ✅ Champ uid
          photo_url: emp.photo_url
        })));
      } else {
        console.log('❌ Aucun employee trouvé du tout pour cet user_id');
      }
      return;
    }

    const employee = employees[0];
    console.log('✅ Employee trouvé:', {
      id: employee.id,
      employeId: employee.employeId, // ✅ Champ employeId
      nom: employee.nom,
      prenom: employee.prenom,
      user_id: employee.user_id,
      uid: employee.uid, // ✅ Champ uid
      actif: employee.actif,
      photo_url: employee.photo_url
    });

    // 3. Test de mise à jour d'un champ employee
    console.log('\n3️⃣ Test de mise à jour d\'un champ employee...');
    const testUpdate = { updated_at: new Date().toISOString() };
    
    const { data: updateData, error: updateError } = await supabase
      .from('employees')
      .update(testUpdate)
      .eq('id', employee.employeId) // ✅ Utiliser employeId
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erreur mise à jour test:', updateError);
    } else {
      console.log('✅ Mise à jour test réussie');
    }

    // 4. Test de mise à jour photo_url
    console.log('\n4️⃣ Test de mise à jour photo_url...');
    const testPhotoUpdate = { 
      photo_url: 'https://example.com/test-photo.jpg',
      updated_at: new Date().toISOString()
    };
    
    const { data: photoUpdateData, error: photoUpdateError } = await supabase
      .from('employees')
      .update(testPhotoUpdate)
      .eq('id', employee.employeId) // ✅ Utiliser employeId
      .select()
      .single();

    if (photoUpdateError) {
      console.error('❌ Erreur mise à jour photo_url:', photoUpdateError);
    } else {
      console.log('✅ Mise à jour photo_url réussie');
      
      // Restaurer l'ancienne valeur
      const { error: restoreError } = await supabase
        .from('employees')
        .update({ 
          photo_url: employee.photo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', employee.employeId); // ✅ Utiliser employeId
      
      if (restoreError) {
        console.warn('⚠️ Erreur restauration photo_url:', restoreError);
      } else {
        console.log('🔄 Photo_url restaurée');
      }
    }

    console.log('\n✅ Debug terminé avec succès !');
    console.log('\n📋 Résumé :');
    console.log('- ✅ Session active');
    console.log('- ✅ User ID:', session.user.id);
    console.log('- ✅ Employee trouvé:', employee ? 'Oui' : 'Non');
    console.log('- ✅ Employee ID (employeId):', employee?.employeId);
    console.log('- ✅ Employee UID:', employee?.uid);
    console.log('- ✅ Mise à jour possible');
    console.log('- ✅ Mise à jour photo_url possible');

  } catch (error) {
    console.error('💥 Erreur lors du debug:', error);
  }
}

// Exécuter le debug
debugEmployeeData(); 