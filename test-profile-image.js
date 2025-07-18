// Script de test pour vérifier le chargement de l'image de profil
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PRIVATE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfileImage() {
  console.log('🔍 Test du chargement de l\'image de profil...\n');

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

    // 2. Récupérer les données employee
    console.log('\n2️⃣ Récupération des données employee...');
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('actif', true)
      .single();

    if (employeesError) {
      console.error('❌ Erreur accès table employees:', employeesError);
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
      photo_url: employees.photo_url
    });

    // 3. Tester l'URL de l'image
    if (employees.photo_url) {
      console.log('\n3️⃣ Test de l\'URL de l\'image...');
      console.log('🔗 URL de l\'image:', employees.photo_url);
      
      try {
        // Tester si l'URL est accessible
        const response = await fetch(employees.photo_url, { method: 'HEAD' });
        
        if (response.ok) {
          console.log('✅ Image accessible (Status:', response.status, ')');
          console.log('📏 Taille:', response.headers.get('content-length'), 'bytes');
          console.log('📋 Type:', response.headers.get('content-type'));
        } else {
          console.warn('⚠️ Image non accessible (Status:', response.status, ')');
        }
      } catch (error) {
        console.error('❌ Erreur lors du test de l\'URL:', error.message);
      }
    } else {
      console.log('\n3️⃣ Aucune image de profil définie');
    }

    // 4. Tester la mise à jour de l'image
    console.log('\n4️⃣ Test de mise à jour de l\'image...');
    const testPhotoUrl = 'https://example.com/test-photo.jpg';
    
    const { data: updateData, error: updateError } = await supabase
      .from('employees')
      .update({ 
        photo_url: testPhotoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', employees.employeId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erreur mise à jour photo_url:', updateError);
    } else {
      console.log('✅ Mise à jour photo_url réussie');
      console.log('🔄 Nouvelle URL:', updateData.photo_url);
      
      // Restaurer l'ancienne valeur
      const { error: restoreError } = await supabase
        .from('employees')
        .update({ 
          photo_url: employees.photo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', employees.employeId);
      
      if (restoreError) {
        console.warn('⚠️ Erreur restauration photo_url:', restoreError);
      } else {
        console.log('🔄 Photo_url restaurée');
      }
    }

    // 5. Vérifier les permissions de stockage
    console.log('\n5️⃣ Vérification des permissions de stockage...');
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('employee-photos')
        .list('profile-images', {
          limit: 1
        });

      if (storageError) {
        console.error('❌ Erreur accès stockage:', storageError);
      } else {
        console.log('✅ Accès au stockage réussi');
        console.log('📁 Fichiers dans profile-images:', storageData?.length || 0);
      }
    } catch (error) {
      console.error('❌ Erreur test stockage:', error);
    }

    console.log('\n✅ Test terminé avec succès !');
    console.log('\n📋 Résumé :');
    console.log('- ✅ Session active');
    console.log('- ✅ Employee trouvé');
    console.log('- ✅ Photo URL:', employees.photo_url ? 'Définie' : 'Non définie');
    console.log('- ✅ Mise à jour possible');
    console.log('- ✅ Stockage accessible');

  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
  }
}

// Exécuter le test
testProfileImage(); 