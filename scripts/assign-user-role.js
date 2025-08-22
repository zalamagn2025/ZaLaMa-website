// Script pour assigner un rôle à un utilisateur dans la table admin_users
// Exécuter avec: node scripts/assign-user-role.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mspmrzlqhwpdkkburjiw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY non définie dans les variables d\'environnement');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function assignUserRole() {
  try {
    console.log('🔍 Script d\'assignation de rôle utilisateur\n');
    
    // Informations de l'utilisateur (à modifier selon vos besoins)
    const userEmail = 'dfdsfqsdf22@gmail.com'; // Email de l'utilisateur RH
    const userRole = 'rh'; // ou 'responsable'
    const partenaireId = 'cc336e4e-a9de-408a-81bb-1177d1e5ebc5'; // ID du partenaire
    
    console.log('📋 Informations utilisateur:');
    console.log(`   - Email: ${userEmail}`);
    console.log(`   - Rôle: ${userRole}`);
    console.log(`   - Partenaire ID: ${partenaireId}\n`);
    
    // 1. Récupérer l'utilisateur depuis la table employees
    console.log('🔍 1. Récupération de l\'utilisateur depuis employees...');
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id, user_id, email, nom, prenom')
      .eq('email', userEmail)
      .single();
    
    if (employeeError || !employee) {
      console.error('❌ Erreur lors de la récupération de l\'employé:', employeeError);
      return;
    }
    
    console.log('✅ Employé trouvé:', {
      id: employee.id,
      user_id: employee.user_id,
      email: employee.email,
      nom: employee.nom,
      prenom: employee.prenom
    });
    
    // 2. Vérifier si l'utilisateur existe déjà dans admin_users
    console.log('\n🔍 2. Vérification dans admin_users...');
    const { data: existingAdminUser, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la vérification:', checkError);
      return;
    }
    
    if (existingAdminUser) {
      console.log('⚠️  Utilisateur existe déjà dans admin_users:', existingAdminUser);
      
      // Mettre à jour le rôle
      console.log('🔄 Mise à jour du rôle...');
      const { data: updatedUser, error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          role: userRole,
          partenaire_id: partenaireId,
          updated_at: new Date().toISOString()
        })
        .eq('email', userEmail)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError);
        return;
      }
      
      console.log('✅ Rôle mis à jour avec succès:', updatedUser);
    } else {
      // 3. Insérer l'utilisateur dans admin_users
      console.log('🔄 3. Insertion dans admin_users...');
      const { data: newAdminUser, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: employee.user_id, // Utiliser le user_id comme id
          email: userEmail,
          display_name: `${employee.prenom} ${employee.nom}`,
          role: userRole,
          partenaire_id: partenaireId,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          require_password_change: false
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Erreur lors de l\'insertion:', insertError);
        return;
      }
      
      console.log('✅ Utilisateur ajouté avec succès dans admin_users:', newAdminUser);
    }
    
    // 4. Vérifier que le salaire est à 0
    console.log('\n🔍 4. Vérification du salaire...');
    const { data: salaryCheck, error: salaryError } = await supabase
      .from('employees')
      .select('salaire_net')
      .eq('user_id', employee.user_id)
      .single();
    
    if (salaryError) {
      console.error('❌ Erreur lors de la vérification du salaire:', salaryError);
      return;
    }
    
    console.log('💰 Salaire actuel:', salaryCheck.salaire_net);
    
    if (salaryCheck.salaire_net !== 0) {
      console.log('🔄 Mise à jour du salaire à 0...');
      const { error: updateSalaryError } = await supabase
        .from('employees')
        .update({ salaire_net: 0 })
        .eq('user_id', employee.user_id);
      
      if (updateSalaryError) {
        console.error('❌ Erreur lors de la mise à jour du salaire:', updateSalaryError);
        return;
      }
      
      console.log('✅ Salaire mis à jour à 0');
    }
    
    console.log('\n🎉 Configuration terminée avec succès !');
    console.log('📋 Résumé:');
    console.log(`   - Utilisateur: ${employee.prenom} ${employee.nom}`);
    console.log(`   - Email: ${employee.email}`);
    console.log(`   - Rôle: ${userRole}`);
    console.log(`   - Partenaire ID: ${partenaireId}`);
    console.log(`   - Salaire: 0`);
    console.log('\n🔄 Maintenant, reconnectez-vous et allez sur /profile pour voir la modale !');
    
  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

assignUserRole();
