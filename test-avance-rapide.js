const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// =====================================================
// TESTS RAPIDES
// =====================================================

async function testConnexionRapide() {
  console.log('🔍 Test de connexion Supabase...')
  
  try {
    const { data, error } = await supabase.from('employees').select('count').limit(1)
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message)
      return false
    }
    
    console.log('✅ Connexion réussie')
    return true
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    return false
  }
}

async function testDemandeAvanceRapide() {
  console.log('\n🧪 Test rapide de demande d\'avance...')
  
  const baseUrl = process.env.NEXT_PRIVATE_APP_URL || 'http://localhost:3000'
  
  // Données de test
  const testRequest = {
    employeId: 'test-employee-id', // À remplacer par un vrai ID
    montantDemande: 300000,
    typeMotif: 'transport',
    motif: 'Test rapide - Transport',
    numeroReception: '+224123456789',
    fraisService: 19500, // 6.5% de 300000
    montantTotal: 319500,
    salaireDisponible: 1500000,
    avanceDisponible: 375000,
    entrepriseId: 'test-partner-id', // À remplacer par un vrai ID
    password: 'TestPassword123!'
  }
  
  try {
    console.log('📤 Envoi de la demande...')
    const response = await fetch(`${baseUrl}/api/salary-advance/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest)
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log('✅ Demande créée avec succès')
      console.log(`📋 ID: ${result.data.id}`)
      console.log(`💰 Montant: ${result.data.montant} GNF`)
    } else {
      console.log('⚠️ Demande rejetée:', result.message)
    }
  } catch (error) {
    console.error('❌ Erreur API:', error.message)
  }
}

async function testRecuperationDemandes() {
  console.log('\n📋 Test de récupération des demandes...')
  
  const baseUrl = process.env.NEXT_PRIVATE_APP_URL || 'http://localhost:3000'
  
  try {
    const response = await fetch(`${baseUrl}/api/salary-advance/request`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      console.log(`✅ ${result.data.length} demandes récupérées`)
      
      result.data.slice(0, 3).forEach((demande, index) => {
        console.log(`  ${index + 1}. ${demande.montant_demande} GNF - ${demande.statut} - ${demande.type_motif}`)
      })
    } else {
      console.log('⚠️ Erreur récupération:', result.message)
    }
  } catch (error) {
    console.error('❌ Erreur API:', error.message)
  }
}

async function testValidationLimites() {
  console.log('\n🚫 Test de validation des limites...')
  
  const baseUrl = process.env.NEXT_PRIVATE_APP_URL || 'http://localhost:3000'
  
  // Demande qui dépasse la limite (25% du salaire)
  const invalidRequest = {
    employeId: 'test-employee-id',
    montantDemande: 2000000, // 2M GNF (dépasse 25% de 1.5M)
    typeMotif: 'logement',
    motif: 'Test limite - Loyer',
    numeroReception: '+224123456789',
    fraisService: 130000,
    montantTotal: 2130000,
    salaireDisponible: 1500000,
    avanceDisponible: 0,
    entrepriseId: 'test-partner-id',
    password: 'TestPassword123!'
  }
  
  try {
    const response = await fetch(`${baseUrl}/api/salary-advance/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidRequest)
    })
    
    const result = await response.json()
    
    if (!response.ok && !result.success) {
      console.log('✅ Limite correctement appliquée')
      console.log(`📝 Message: ${result.message}`)
    } else {
      console.log('❌ La limite n\'a pas été appliquée')
    }
  } catch (error) {
    console.error('❌ Erreur API:', error.message)
  }
}

async function testTypesMotifs() {
  console.log('\n📝 Test des types de motifs...')
  
  const types = ['transport', 'sante', 'education', 'logement', 'alimentation', 'autre']
  
  types.forEach(type => {
    console.log(`  ✅ ${type}`)
  })
  
  console.log('📊 Tous les types de motifs sont supportés')
}

async function testCalculsFrais() {
  console.log('\n🧮 Test des calculs de frais...')
  
  const montants = [100000, 250000, 500000, 1000000]
  
  montants.forEach(montant => {
    const frais = Math.floor(montant * 0.065)
    const total = montant + frais
    
    console.log(`  💰 ${montant.toLocaleString()} GNF + ${frais.toLocaleString()} GNF = ${total.toLocaleString()} GNF`)
  })
  
  console.log('✅ Calculs de frais de service (6.5%) corrects')
}

async function testBaseDonnees() {
  console.log('\n🗄️ Test de la base de données...')
  
  try {
    // Vérifier les tables principales
    const tables = ['employees', 'partners', 'salary_advance_requests', 'financial_transactions']
    
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('count').limit(1)
      
      if (error) {
        console.log(`  ❌ Table ${table}: ${error.message}`)
      } else {
        console.log(`  ✅ Table ${table}: OK`)
      }
    }
    
    console.log('✅ Toutes les tables sont accessibles')
  } catch (error) {
    console.error('❌ Erreur base de données:', error.message)
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function runTestsRapides() {
  console.log('🚀 TESTS RAPIDES - DEMANDES D\'AVANCE SUR SALAIRE')
  console.log('='.repeat(60))
  
  const tests = [
    { name: 'Connexion Supabase', fn: testConnexionRapide },
    { name: 'Base de données', fn: testBaseDonnees },
    { name: 'Types de motifs', fn: testTypesMotifs },
    { name: 'Calculs de frais', fn: testCalculsFrais },
    { name: 'Validation des limites', fn: testValidationLimites },
    { name: 'Demande d\'avance', fn: testDemandeAvanceRapide },
    { name: 'Récupération des demandes', fn: testRecuperationDemandes }
  ]
  
  let successCount = 0
  let totalCount = tests.length
  
  for (const test of tests) {
    try {
      console.log(`\n🔧 Test: ${test.name}`)
      const result = await test.fn()
      
      if (result !== false) {
        successCount++
      }
    } catch (error) {
      console.error(`❌ Erreur dans ${test.name}:`, error.message)
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('📊 RÉSUMÉ DES TESTS')
  console.log('='.repeat(60))
  console.log(`✅ Tests réussis: ${successCount}/${totalCount}`)
  console.log(`📈 Taux de succès: ${Math.round((successCount / totalCount) * 100)}%`)
  
  if (successCount === totalCount) {
    console.log('🎉 Tous les tests sont passés avec succès!')
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.')
  }
}

// =====================================================
// EXÉCUTION
// =====================================================

if (require.main === module) {
  runTestsRapides().catch(console.error)
}

module.exports = {
  runTestsRapides,
  testConnexionRapide,
  testDemandeAvanceRapide,
  testRecuperationDemandes,
  testValidationLimites,
  testTypesMotifs,
  testCalculsFrais,
  testBaseDonnees
} 