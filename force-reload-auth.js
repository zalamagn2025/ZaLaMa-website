// Script pour forcer le rechargement des données d'authentification
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function forceReloadAuth() {
  console.log('🔄 Force reload des données d\'authentification...\n');

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
      console.log('💡 Connectez-vous d\'abord');
      return;
    }
    
    console.log('✅ Session active trouvée');
    console.log('👤 User ID:', session.user.id);
    console.log('📧 Email:', session.user.email);

    // 2. Forcer la récupération des données employee
    console.log('\n2️⃣ Force récupération des données employee...');
    
    // Essayer d'abord avec le filtre actif
    let { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('actif', true)
      .single();

    if (employeesError) {
      console.log('⚠️ Erreur avec filtre actif, tentative sans filtre...');
      
      // Essayer sans filtre actif
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
        
        // Prendre le premier employee
        employees = allEmployees[0];
        console.log('✅ Employee sélectionné:', {
          employeId: employees.employeId,
          nom: employees.nom,
          prenom: employees.prenom
        });
      } else {
        console.log('❌ Aucun employee trouvé du tout');
        return;
      }
    } else {
      console.log('✅ Employee trouvé avec filtre actif:', {
        employeId: employees.employeId,
        nom: employees.nom,
        prenom: employees.prenom,
        actif: employees.actif
      });
    }

    // 3. Forcer une mise à jour pour déclencher le contexte
    console.log('\n3️⃣ Force mise à jour pour déclencher le contexte...');
    const forceUpdate = { 
      updated_at: new Date().toISOString(),
      // Ajouter un champ temporaire pour forcer la mise à jour
      temp_field: 'force_update_' + Date.now()
    };
    
    const { data: updateData, error: updateError } = await supabase
      .from('employees')
      .update(forceUpdate)
      .eq('employeId', employees.employeId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erreur force mise à jour:', updateError);
    } else {
      console.log('✅ Force mise à jour réussie');
      
      // Restaurer l'état original
      const { error: restoreError } = await supabase
        .from('employees')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('employeId', employees.employeId);
      
      if (restoreError) {
        console.warn('⚠️ Erreur restauration:', restoreError);
      } else {
        console.log('🔄 État restauré');
      }
    }

    // 4. Vérifier l'état final
    console.log('\n4️⃣ Vérification de l\'état final...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('employees')
      .select('*')
      .eq('employeId', employees.employeId)
      .single();

    if (finalError) {
      console.error('❌ Erreur vérification finale:', finalError);
    } else {
      console.log('✅ État final vérifié:', {
        employeId: finalCheck.employeId,
        nom: finalCheck.nom,
        prenom: finalCheck.prenom,
        actif: finalCheck.actif,
        updated_at: finalCheck.updated_at
      });
    }

    console.log('\n✅ Force reload terminé avec succès !');
    console.log('\n📋 Instructions :');
    console.log('1. Rechargez la page dans le navigateur');
    console.log('2. Vérifiez la console pour les logs de debug');
    console.log('3. Testez l\'upload d\'image');

  } catch (error) {
    console.error('💥 Erreur lors du force reload:', error);
  }
}

// Exécuter le force reload
forceReloadAuth(); 