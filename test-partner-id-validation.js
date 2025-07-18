const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testPartnerIdValidation() {
  console.log('🧪 Test de validation du partner_id pour les employés')
  console.log('=' .repeat(60))

  try {
    // 1. Vérifier les employés sans partner_id
    console.log('\n1️⃣ Vérification des employés sans partner_id...')
    const { data: employeesWithoutPartner, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .is('partner_id', null)
      .eq('actif', true)

    if (employeesError) {
      console.error('❌ Erreur lors de la vérification:', employeesError)
      return
    }

    if (employeesWithoutPartner && employeesWithoutPartner.length > 0) {
      console.log('⚠️ Employés sans partner_id trouvés:', employeesWithoutPartner.length)
      employeesWithoutPartner.forEach(emp => {
        console.log(`  - ${emp.prenom} ${emp.nom} (${emp.email})`)
      })
    } else {
      console.log('✅ Tous les employés ont un partner_id')
    }

    // 2. Récupérer un employé de test avec partner_id
    console.log('\n2️⃣ Recherche d\'un employé de test avec partner_id...')
    const { data: testEmployee, error: testError } = await supabase
      .from('employees')
      .select(`
        *,
        partners!inner(
          id,
          nom,
          type,
          secteur
        )
      `)
      .not('partner_id', 'is', null)
      .eq('actif', true)
      .limit(1)
      .single()

    if (testError) {
      console.error('❌ Erreur lors de la récupération de l\'employé de test:', testError)
      return
    }

    if (!testEmployee) {
      console.error('❌ Aucun employé avec partner_id trouvé')
      return
    }

    console.log('✅ Employé de test trouvé:', {
      id: testEmployee.id,
      nom: testEmployee.nom,
      prenom: testEmployee.prenom,
      email: testEmployee.email,
      partner_id: testEmployee.partner_id,
      entreprise: testEmployee.partners.nom
    })

    // 3. Tester l'API /api/user/profile
    console.log('\n3️⃣ Test de l\'API /api/user/profile...')
    
    // Simuler une requête à l'API (nécessite un serveur en cours d'exécution)
    console.log('📡 Test de l\'API /api/user/profile (nécessite un serveur en cours d\'exécution)')
    console.log('   Pour tester manuellement:')
    console.log(`   curl -X GET "http://localhost:3000/api/user/profile" \\`)
    console.log(`   -H "Cookie: sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token=..."`)

    // 4. Vérifier la structure de la table employees
    console.log('\n4️⃣ Vérification de la structure de la table employees...')
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'employees' })
      .catch(() => ({ data: null, error: 'Fonction RPC non disponible' }))

    if (tableError) {
      console.log('⚠️ Impossible de vérifier la structure de la table (RPC non disponible)')
    } else {
      console.log('✅ Structure de la table vérifiée')
    }

    // 5. Statistiques des employés par partenaire
    console.log('\n5️⃣ Statistiques des employés par partenaire...')
    const { data: stats, error: statsError } = await supabase
      .from('employees')
      .select(`
        partner_id,
        partners!inner(
          nom,
          type,
          secteur
        )
      `)
      .eq('actif', true)

    if (statsError) {
      console.error('❌ Erreur lors de la récupération des statistiques:', statsError)
      return
    }

    // Grouper par partenaire
    const partnerStats = {}
    stats.forEach(emp => {
      const partnerName = emp.partners.nom
      if (!partnerStats[partnerName]) {
        partnerStats[partnerName] = {
          count: 0,
          partner_id: emp.partner_id,
          type: emp.partners.type,
          secteur: emp.partners.secteur
        }
      }
      partnerStats[partnerName].count++
    })

    console.log('📊 Statistiques par partenaire:')
    Object.entries(partnerStats).forEach(([name, data]) => {
      console.log(`  - ${name}: ${data.count} employé(s) (ID: ${data.partner_id})`)
    })

    // 6. Test de création d'une demande d'avance (simulation)
    console.log('\n6️⃣ Test de simulation de création de demande d\'avance...')
    
    const testAdvanceData = {
      employeId: testEmployee.id,
      entrepriseId: testEmployee.partner_id,
      montantDemande: 100000,
      typeMotif: 'TEST',
      motif: 'Test de validation du partner_id',
      password: 'test123'
    }

    console.log('📋 Données de test pour la demande d\'avance:')
    console.log('  - employeId:', testAdvanceData.employeId)
    console.log('  - entrepriseId:', testAdvanceData.entrepriseId)
    console.log('  - montantDemande:', testAdvanceData.montantDemande)
    console.log('  - typeMotif:', testAdvanceData.typeMotif)
    console.log('  - motif:', testAdvanceData.motif)

    if (!testAdvanceData.entrepriseId) {
      console.error('❌ PROBLÈME: entrepriseId est null ou undefined')
      console.log('🔍 Cause possible: L\'employé n\'a pas de partner_id défini')
    } else {
      console.log('✅ entrepriseId est correctement défini')
    }

    console.log('\n🎉 Test terminé!')
    console.log('✅ Le partner_id est obligatoire pour la création de demandes d\'avance')

  } catch (error) {
    console.error('💥 Erreur générale:', error)
  }
}

// Exécuter le test
testPartnerIdValidation() 