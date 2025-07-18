const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PRIVATE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSalaryAdvanceAPI() {
  console.log('🧪 Test: API des demandes d\'avance');
  
  try {
    // 1. Vérifier la table salary_advance_requests
    console.log('\n📋 1. Vérification de la table salary_advance_requests...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('salary_advance_requests')
      .select('*')
      .limit(5);

    if (tableError) {
      console.error('❌ Erreur lors de la vérification de la table:', tableError);
      return;
    }

    console.log('✅ Table salary_advance_requests accessible');
    console.log('📊 Nombre d\'enregistrements:', tableInfo?.length || 0);

    if (tableInfo && tableInfo.length > 0) {
      console.log('📋 Exemple d\'enregistrement:', {
        id: tableInfo[0].id,
        employe_id: tableInfo[0].employe_id,
        montant_demande: tableInfo[0].montant_demande,
        statut: tableInfo[0].statut,
        date_creation: tableInfo[0].date_creation
      });
    }

    // 2. Vérifier les employés
    console.log('\n📋 2. Vérification des employés...');
    
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('id, nom, prenom, email, user_id')
      .eq('actif', true)
      .limit(5);

    if (employeesError) {
      console.error('❌ Erreur lors de la récupération des employés:', employeesError);
      return;
    }

    console.log('✅ Employés trouvés:', employees?.length || 0);
    
    if (employees && employees.length > 0) {
      console.log('📋 Premier employé:', {
        id: employees[0].id,
        nom: `${employees[0].prenom} ${employees[0].nom}`,
        email: employees[0].email,
        user_id: employees[0].user_id
      });
    }

    // 3. Vérifier les demandes par employé
    if (employees && employees.length > 0) {
      console.log('\n📋 3. Vérification des demandes par employé...');
      
      const testEmployeeId = employees[0].id;
      
      const { data: requests, error: requestsError } = await supabase
        .from('salary_advance_requests')
        .select(`
          id,
          employe_id,
          montant_demande,
          type_motif,
          motif,
          statut,
          date_creation,
          created_at
        `)
        .eq('employe_id', testEmployeeId)
        .order('date_creation', { ascending: false });

      if (requestsError) {
        console.error('❌ Erreur lors de la récupération des demandes:', requestsError);
        return;
      }

      console.log('✅ Demandes trouvées pour l\'employé:', requests?.length || 0);
      
      if (requests && requests.length > 0) {
        console.log('📋 Première demande:', {
          id: requests[0].id,
          montant: requests[0].montant_demande,
          type: requests[0].type_motif,
          statut: requests[0].statut,
          date: requests[0].date_creation
        });
      } else {
        console.log('⚠️ Aucune demande trouvée pour cet employé');
      }
    }

    // 4. Tester l'API directement
    console.log('\n📋 4. Test de l\'API /api/salary-advance/request...');
    
    try {
      const response = await fetch('http://localhost:3000/api/salary-advance/request', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API fonctionne');
        console.log('📋 Réponse API:', {
          success: data.success,
          dataLength: data.data?.length || 0
        });
        
        if (data.data && data.data.length > 0) {
          console.log('📋 Première demande de l\'API:', {
            id: data.data[0].id,
            montant: data.data[0].montant_demande,
            statut: data.data[0].statut
          });
        }
      } else {
        console.error('❌ Erreur API:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('📋 Détails:', errorText);
      }
    } catch (apiError) {
      console.error('❌ Erreur lors de l\'appel API:', apiError);
    }

    console.log('\n🎉 Test terminé !');

  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
  }
}

// Exécuter le test
testSalaryAdvanceAPI(); 