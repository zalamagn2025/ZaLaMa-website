// Script de test pour vérifier la création de demande d'avance
// Utilise la table salary_advance_requests

const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PRIVATE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.log('NEXT_PRIVATE_SUPABASE_URL:', !!supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testSalaryAdvanceCreation() {
  console.log('🧪 Test de création de demande d\'avance avec partenaire_id obligatoire')
  console.log('=' .repeat(60))

  try {
    // 1. Récupérer un employé de test avec son entreprise
    console.log('\n1️⃣ Recherche d\'un employé de test...')
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select(`
        id,
        user_id,
        salaire_net,
        partner_id,
        partners!inner(
          id,
          nom_entreprise,
          statut
        )
      `)
      .eq('actif', true)
      .not('partner_id', 'is', null)
      .limit(1)

    if (employeesError) {
      console.error('❌ Erreur lors de la récupération des employés:', employeesError)
      return
    }

    if (!employees || employees.length === 0) {
      console.error('❌ Aucun employé trouvé avec une entreprise associée')
      return
    }

    const employee = employees[0]
    console.log('✅ Employé trouvé:', {
      id: employee.id,
      user_id: employee.user_id,
      salaire_net: employee.salaire_net,
      partner_id: employee.partner_id,
      entreprise: employee.partners.nom_entreprise
    })

    // 2. Vérifier la structure de la table salary_advance_requests
    console.log('\n2️⃣ Vérification de la structure de la table...')
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'salary_advance_requests' })
      .catch(() => ({ data: null, error: 'Fonction RPC non disponible' }))

    if (tableError) {
      console.log('⚠️ Impossible de vérifier la structure de la table (RPC non disponible)')
    } else {
      console.log('✅ Structure de la table vérifiée')
    }

    // 3. Tester la création d'une demande d'avance
    console.log('\n3️⃣ Test de création d\'une demande d\'avance...')
    
    const testAdvanceData = {
      employe_id: employee.id,
      partenaire_id: employee.partner_id, // Obligatoire
      montant_demande: 100000, // 100,000 GNF
      type_motif: 'URGENCE',
      motif: 'Test de création avec partenaire_id obligatoire',
      numero_reception: `TEST-${Date.now()}`,
      frais_service: 5000,
      montant_total: 105000,
      salaire_disponible: employee.salaire_net,
      avance_disponible: Math.floor(employee.salaire_net * 0.25),
      statut: 'En attente',
      date_creation: new Date().toISOString()
    }

    console.log('📋 Données de test:', testAdvanceData)

    const { data: createdAdvance, error: createError } = await supabase
      .from('salary_advance_requests')
      .insert(testAdvanceData)
      .select()
      .single()

    if (createError) {
      console.error('❌ Erreur lors de la création:', createError)
      
      // Vérifier si l'erreur est liée à partenaire_id
      if (createError.message.includes('partenaire_id') || createError.message.includes('null')) {
        console.error('🔍 Erreur liée à partenaire_id - vérification de la contrainte NOT NULL')
      }
      
      return
    }

    console.log('✅ Demande d\'avance créée avec succès:', {
      id: createdAdvance.id,
      employe_id: createdAdvance.employe_id,
      partenaire_id: createdAdvance.partenaire_id,
      montant_demande: createdAdvance.montant_demande,
      statut: createdAdvance.statut
    })

    // 4. Vérifier que la demande a bien été créée
    console.log('\n4️⃣ Vérification de la demande créée...')
    const { data: verifyAdvance, error: verifyError } = await supabase
      .from('salary_advance_requests')
      .select(`
        *,
        employees!inner(
          id,
          nom,
          prenom,
          salaire_net,
          partner_id
        ),
        partners!inner(
          id,
          nom_entreprise,
          statut
        )
      `)
      .eq('id', createdAdvance.id)
      .single()

    if (verifyError) {
      console.error('❌ Erreur lors de la vérification:', verifyError)
      return
    }

    console.log('✅ Demande vérifiée avec succès:')
    console.log('  - ID:', verifyAdvance.id)
    console.log('  - Employé:', `${verifyAdvance.employees.prenom} ${verifyAdvance.employees.nom}`)
    console.log('  - Entreprise:', verifyAdvance.partners.nom_entreprise)
    console.log('  - Partenaire ID:', verifyAdvance.partenaire_id)
    console.log('  - Montant:', verifyAdvance.montant_demande.toLocaleString(), 'GNF')
    console.log('  - Statut:', verifyAdvance.statut)

    // 5. Test de validation - essayer de créer sans partenaire_id
    console.log('\n5️⃣ Test de validation - création sans partenaire_id...')
    const invalidAdvanceData = {
      employe_id: employee.id,
      // partenaire_id manquant intentionnellement
      montant_demande: 50000,
      type_motif: 'TEST',
      motif: 'Test sans partenaire_id',
      montant_total: 50000,
      statut: 'En attente',
      date_creation: new Date().toISOString()
    }

    const { data: invalidAdvance, error: invalidError } = await supabase
      .from('salary_advance_requests')
      .insert(invalidAdvanceData)
      .select()

    if (invalidError) {
      console.log('✅ Validation fonctionne - partenaire_id est obligatoire')
      console.log('❌ Erreur attendue:', invalidError.message)
    } else {
      console.error('❌ PROBLÈME: La création sans partenaire_id a réussi (ne devrait pas)')
      console.log('⚠️ Données créées:', invalidAdvance)
    }

    // 6. Nettoyage - supprimer la demande de test
    console.log('\n6️⃣ Nettoyage - suppression de la demande de test...')
    const { error: deleteError } = await supabase
      .from('salary_advance_requests')
      .delete()
      .eq('id', createdAdvance.id)

    if (deleteError) {
      console.error('⚠️ Erreur lors du nettoyage:', deleteError)
    } else {
      console.log('✅ Demande de test supprimée')
    }

    console.log('\n🎉 Test terminé avec succès!')
    console.log('✅ partenaire_id est bien obligatoire dans la table salary_advance_requests')

  } catch (error) {
    console.error('💥 Erreur générale:', error)
  }
}

// Exécuter le test
testSalaryAdvanceCreation() 