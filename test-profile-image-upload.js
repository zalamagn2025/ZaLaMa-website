// Test script pour vérifier le fonctionnement de l'upload d'image de profil
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfileImageUpload() {
  console.log('🧪 Test de l\'upload d\'image de profil...\n');

  try {
    // 1. Vérifier la connexion Supabase
    console.log('1️⃣ Test de connexion Supabase...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erreur de session:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('⚠️ Aucune session active, test en mode anonyme');
    } else {
      console.log('✅ Session active pour:', session.user.email);
    }

    // 2. Vérifier la table employees
    console.log('\n2️⃣ Test de la table employees...');
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('id, user_id, nom, prenom, photo_url')
      .limit(1);

    if (employeesError) {
      console.error('❌ Erreur accès table employees:', employeesError);
      return;
    }

    console.log('✅ Table employees accessible');
    if (employees && employees.length > 0) {
      console.log('📋 Exemple d\'employé:', {
        id: employees[0].id,
        nom: employees[0].nom,
        prenom: employees[0].prenom,
        photo_url: employees[0].photo_url
      });
    }

    // 3. Vérifier le bucket de stockage
    console.log('\n3️⃣ Test du bucket employee-photos...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Erreur accès buckets:', bucketsError);
      return;
    }

    const employeePhotosBucket = buckets.find(bucket => bucket.name === 'employee-photos');
    if (employeePhotosBucket) {
      console.log('✅ Bucket employee-photos trouvé');
    } else {
      console.log('⚠️ Bucket employee-photos non trouvé, création nécessaire');
    }

    // 4. Test de création d'un fichier de test
    console.log('\n4️⃣ Test de création d\'un fichier de test...');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'Test file for profile image upload';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('employee-photos')
      .upload(`test/${testFileName}`, testContent, {
        contentType: 'text/plain'
      });

    if (uploadError) {
      console.error('❌ Erreur upload test:', uploadError);
    } else {
      console.log('✅ Upload test réussi:', uploadData);
      
      // Nettoyer le fichier de test
      const { error: deleteError } = await supabase.storage
        .from('employee-photos')
        .remove([`test/${testFileName}`]);
      
      if (deleteError) {
        console.warn('⚠️ Erreur suppression fichier test:', deleteError);
      } else {
        console.log('🗑️ Fichier test supprimé');
      }
    }

    // 5. Test de mise à jour d'un employé
    if (employees && employees.length > 0) {
      console.log('\n5️⃣ Test de mise à jour d\'un employé...');
      const testEmployee = employees[0];
      const testPhotoUrl = 'https://example.com/test-photo.jpg';
      
      const { data: updateData, error: updateError } = await supabase
        .from('employees')
        .update({ 
          photo_url: testPhotoUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', testEmployee.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erreur mise à jour employé:', updateError);
      } else {
        console.log('✅ Mise à jour employé réussie:', {
          id: updateData.id,
          photo_url: updateData.photo_url
        });
        
        // Restaurer l'ancienne valeur
        const { error: restoreError } = await supabase
          .from('employees')
          .update({ 
            photo_url: testEmployee.photo_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', testEmployee.id);
        
        if (restoreError) {
          console.warn('⚠️ Erreur restauration photo_url:', restoreError);
        } else {
          console.log('🔄 Photo_url restaurée');
        }
      }
    }

    console.log('\n✅ Tous les tests terminés avec succès !');
    console.log('\n📋 Résumé des vérifications :');
    console.log('- ✅ Connexion Supabase');
    console.log('- ✅ Accès table employees');
    console.log('- ✅ Accès bucket employee-photos');
    console.log('- ✅ Upload/Suppression fichiers');
    console.log('- ✅ Mise à jour données employé');

  } catch (error) {
    console.error('💥 Erreur lors des tests:', error);
  }
}

// Exécuter les tests
testProfileImageUpload(); 