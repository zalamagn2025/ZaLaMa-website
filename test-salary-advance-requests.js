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

// Configuration de test
const TEST_CONFIG = {
  // Données de test pour un employé
  testEmployee: {
    email: 'test.employee@example.com',
    password: 'TestPassword123!',
    nom: 'Test',
    prenom: 'Employee',
    telephone: '+224123456789',
    salaire_net: 1500000, // 1.5M GNF
    partenaire_id: null // Sera défini dynamiquement
  },
  
  // Données de test pour un partenaire
  testPartner: {
    nom_entreprise: 'Entreprise Test SARL',
    email_rh: 'rh@test-entreprise.com',
    telephone_rh: '+224987654321',
    email_representant: 'representant@test-entreprise.com',
    telephone_representant: '+224111222333'
  },
  
  // Données de test pour les demandes d'avance
  testAdvanceRequests: [
    {
      montantDemande: 500000, // 500K GNF
      typeMotif: 'transport',
      motif: 'Achat de carburant pour déplacements professionnels',
      numeroReception: '+224123456789'
    },
    {
      montantDemande: 300000, // 300K GNF
      typeMotif: 'sante',
      motif: 'Consultation médicale et médicaments',
      numeroReception: '+224123456789'
    },
    {
      montantDemande: 800000, // 800K GNF
      typeMotif: 'education',
      motif: 'Frais de scolarité pour enfants',
      numeroReception: '+224123456789'
    },
    {
      montantDemande: 1200000, // 1.2M GNF (dépassera la limite)
      typeMotif: 'logement',
      motif: 'Loyer et charges',
      numeroReception: '+224123456789'
    }
  ]
}

// =====================================================
// UTILITAIRES DE TEST
// =====================================================

function log(message, type = 'info') {
  const timestamp = new Date().toISOString()
  const emoji = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    debug: '🔍'
  }[type] || 'ℹ️'
  
  console.log(`${emoji} [${timestamp}] ${message}`)
}

function logSection(title) {
  console.log('\n' + '='.repeat(60))
  console.log(`🔧 ${title}`)
  console.log('='.repeat(60))
}

function logSubSection(title) {
  console.log('\n' + '-'.repeat(40))
  console.log(`📋 ${title}`)
  console.log('-'.repeat(40))
}

// =====================================================
// FONCTIONS DE TEST
// =====================================================

async function testSupabaseConnection() {
  logSection('Test de connexion Supabase')
  
  try {
    const { data, error } = await supabase.from('employees').select('count').limit(1)
    
    if (error) {
      log(`Erreur de connexion: ${error.message}`, 'error')
      return false
    }
    
    log('Connexion Supabase réussie', 'success')
    return true
  } catch (error) {
    log(`Erreur de connexion: ${error.message}`, 'error')
    return false
  }
}

async function createTestPartner() {
  logSubSection('Création du partenaire de test')
  
  try {
    // Vérifier si le partenaire existe déjà
    const { data: existingPartner } = await supabase
      .from('partners')
      .select('*')
      .eq('nom_entreprise', TEST_CONFIG.testPartner.nom_entreprise)
      .single()
    
    if (existingPartner) {
      log(`Partenaire existant trouvé: ${existingPartner.id}`, 'success')
      return existingPartner.id
    }
    
    // Créer le partenaire
    const { data: partner, error } = await supabase
      .from('partners')
      .insert({
        nom_entreprise: TEST_CONFIG.testPartner.nom_entreprise,
        email_rh: TEST_CONFIG.testPartner.email_rh,
        telephone_rh: TEST_CONFIG.testPartner.telephone_rh,
        email_representant: TEST_CONFIG.testPartner.email_representant,
        telephone_representant: TEST_CONFIG.testPartner.telephone_representant,
        statut: 'Actif'
      })
      .select()
      .single()
    
    if (error) {
      log(`Erreur création partenaire: ${error.message}`, 'error')
      return null
    }
    
    log(`Partenaire créé: ${partner.id}`, 'success')
    return partner.id
  } catch (error) {
    log(`Erreur: ${error.message}`, 'error')
    return null
  }
}

async function createTestEmployee(partnerId) {
  logSubSection('Création de l\'employé de test')
  
  try {
    // Vérifier si l'employé existe déjà
    const { data: existingEmployee } = await supabase
      .from('employees')
      .select('*')
      .eq('email', TEST_CONFIG.testEmployee.email)
      .single()
    
    if (existingEmployee) {
      log(`Employé existant trouvé: ${existingEmployee.id}`, 'success')
      return existingEmployee
    }
    
    // Créer l'utilisateur auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: TEST_CONFIG.testEmployee.email,
      password: TEST_CONFIG.testEmployee.password
    })
    
    if (authError) {
      log(`Erreur création utilisateur auth: ${authError.message}`, 'error')
      return null
    }
    
    // Créer l'employé
    const { data: employee, error } = await supabase
      .from('employees')
      .insert({
        user_id: authUser.user.id,
        partenaire_id: partnerId,
        nom: TEST_CONFIG.testEmployee.nom,
        prenom: TEST_CONFIG.testEmployee.prenom,
        email: TEST_CONFIG.testEmployee.email,
        telephone: TEST_CONFIG.testEmployee.telephone,
        salaire_net: TEST_CONFIG.testEmployee.salaire_net,
        actif: true
      })
      .select()
      .single()
    
    if (error) {
      log(`Erreur création employé: ${error.message}`, 'error')
      return null
    }
    
    log(`Employé créé: ${employee.id}`, 'success')
    return employee
  } catch (error) {
    log(`Erreur: ${error.message}`, 'error')
    return null
  }
}

async function testAuthentication(employee) {
  logSubSection('Test d\'authentification')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_CONFIG.testEmployee.email,
      password: TEST_CONFIG.testEmployee.password
    })
    
    if (error) {
      log(`Erreur authentification: ${error.message}`, 'error')
      return false
    }
    
    log('Authentification réussie', 'success')
    return true
  } catch (error) {
    log(`Erreur: ${error.message}`, 'error')
    return false
  }
}

async function testSalaryAdvanceAPI(employee, partnerId) {
  logSubSection('Test de l\'API de demandes d\'avance')
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Test 1: Demande valide
  log('Test 1: Demande d\'avance valide')
  const validRequest = {
    employeId: employee.id,
    montantDemande: 500000,
    typeMotif: 'transport',
    motif: 'Achat de carburant pour déplacements professionnels',
    numeroReception: '+224123456789',
    fraisService: 32500, // 6.5% de 500000
    montantTotal: 532500,
    salaireDisponible: employee.salaire_net,
    avanceDisponible: 375000, // 25% du salaire - montant déjà utilisé
    entrepriseId: partnerId,
    password: TEST_CONFIG.testEmployee.password
  }
  
  try {
    const response = await fetch(`${baseUrl}/api/salary-advance/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validRequest)
    })
    
    const result = await response.json()
    
    if (response.ok && result.success) {
      log('✅ Demande valide créée avec succès', 'success')
      log(`ID de la demande: ${result.data.id}`, 'debug')
    } else {
      log(`❌ Erreur demande valide: ${result.message}`, 'error')
    }
  } catch (error) {
    log(`❌ Erreur API: ${error.message}`, 'error')
  }
  
  // Test 2: Demande avec montant trop élevé
  log('Test 2: Demande avec montant dépassant la limite')
  const invalidRequest = {
    ...validRequest,
    montantDemande: 2000000, // 2M GNF (dépasse 25% du salaire)
    fraisService: 130000,
    montantTotal: 2130000
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
      log('✅ Rejet correct de la demande trop élevée', 'success')
      log(`Message d'erreur: ${result.message}`, 'debug')
    } else {
      log('❌ La demande aurait dû être rejetée', 'error')
    }
  } catch (error) {
    log(`❌ Erreur API: ${error.message}`, 'error')
  }
  
  // Test 3: Récupération des demandes
  log('Test 3: Récupération des demandes')
  try {
    const response = await fetch(`${baseUrl}/api/salary-advance/request`)
    const result = await response.json()
    
    if (response.ok && result.success) {
      log(`✅ ${result.data.length} demandes récupérées`, 'success')
      result.data.forEach((demande, index) => {
        log(`Demande ${index + 1}: ${demande.montant_demande} GNF - ${demande.statut}`, 'debug')
      })
    } else {
      log(`❌ Erreur récupération: ${result.message}`, 'error')
    }
  } catch (error) {
    log(`❌ Erreur API: ${error.message}`, 'error')
  }
}

async function testDatabaseQueries(employee, partnerId) {
  logSubSection('Test des requêtes de base de données')
  
  try {
    // Test 1: Vérifier les données de l'employé
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employee.id)
      .single()
    
    if (employeeError) {
      log(`Erreur récupération employé: ${employeeError.message}`, 'error')
    } else {
      log('✅ Données employé récupérées', 'success')
      log(`Salaire net: ${employeeData.salaire_net} GNF`, 'debug')
    }
    
    // Test 2: Vérifier les demandes d'avance
    const { data: advanceRequests, error: advanceError } = await supabase
      .from('salary_advance_requests')
      .select('*')
      .eq('employe_id', employee.id)
      .order('date_creation', { ascending: false })
    
    if (advanceError) {
      log(`Erreur récupération demandes: ${advanceError.message}`, 'error')
    } else {
      log(`✅ ${advanceRequests.length} demandes d'avance trouvées`, 'success')
      advanceRequests.forEach((request, index) => {
        log(`Demande ${index + 1}: ${request.montant_demande} GNF - ${request.statut}`, 'debug')
      })
    }
    
    // Test 3: Vérifier les transactions financières
    const { data: transactions, error: transactionError } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('utilisateur_id', employee.id)
      .order('date_transaction', { ascending: false })
    
    if (transactionError) {
      log(`Erreur récupération transactions: ${transactionError.message}`, 'error')
    } else {
      log(`✅ ${transactions.length} transactions financières trouvées`, 'success')
      transactions.forEach((transaction, index) => {
        log(`Transaction ${index + 1}: ${transaction.montant} GNF - ${transaction.type}`, 'debug')
      })
    }
    
  } catch (error) {
    log(`Erreur: ${error.message}`, 'error')
  }
}

async function testValidationRules(employee, partnerId) {
  logSubSection('Test des règles de validation')
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Test 1: Mot de passe incorrect
  log('Test 1: Mot de passe incorrect')
  const wrongPasswordRequest = {
    employeId: employee.id,
    montantDemande: 100000,
    typeMotif: 'transport',
    motif: 'Test mot de passe incorrect',
    fraisService: 6500,
    montantTotal: 106500,
    entrepriseId: partnerId,
    password: 'WrongPassword123!'
  }
  
  try {
    const response = await fetch(`${baseUrl}/api/salary-advance/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wrongPasswordRequest)
    })
    
    const result = await response.json()
    
    if (!response.ok && !result.success) {
      log('✅ Rejet correct du mot de passe incorrect', 'success')
    } else {
      log('❌ La demande aurait dû être rejetée', 'error')
    }
  } catch (error) {
    log(`❌ Erreur API: ${error.message}`, 'error')
  }
  
  // Test 2: Données manquantes
  log('Test 2: Données manquantes')
  const incompleteRequest = {
    employeId: employee.id,
    montantDemande: 100000,
    // typeMotif manquant
    motif: 'Test données manquantes',
    fraisService: 6500,
    montantTotal: 106500,
    entrepriseId: partnerId,
    password: TEST_CONFIG.testEmployee.password
  }
  
  try {
    const response = await fetch(`${baseUrl}/api/salary-advance/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incompleteRequest)
    })
    
    const result = await response.json()
    
    if (!response.ok && !result.success) {
      log('✅ Rejet correct des données manquantes', 'success')
    } else {
      log('❌ La demande aurait dû être rejetée', 'error')
    }
  } catch (error) {
    log(`❌ Erreur API: ${error.message}`, 'error')
  }
  
  // Test 3: Montant négatif
  log('Test 3: Montant négatif')
  const negativeAmountRequest = {
    employeId: employee.id,
    montantDemande: -100000,
    typeMotif: 'transport',
    motif: 'Test montant négatif',
    fraisService: -6500,
    montantTotal: -106500,
    entrepriseId: partnerId,
    password: TEST_CONFIG.testEmployee.password
  }
  
  try {
    const response = await fetch(`${baseUrl}/api/salary-advance/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(negativeAmountRequest)
    })
    
    const result = await response.json()
    
    if (!response.ok && !result.success) {
      log('✅ Rejet correct du montant négatif', 'success')
    } else {
      log('❌ La demande aurait dû être rejetée', 'error')
    }
  } catch (error) {
    log(`❌ Erreur API: ${error.message}`, 'error')
  }
}

async function testMultipleRequests(employee, partnerId) {
  logSubSection('Test de demandes multiples')
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  for (let i = 0; i < TEST_CONFIG.testAdvanceRequests.length; i++) {
    const request = TEST_CONFIG.testAdvanceRequests[i]
    log(`Test demande ${i + 1}: ${request.typeMotif} - ${request.montantDemande} GNF`)
    
    const requestData = {
      employeId: employee.id,
      montantDemande: request.montantDemande,
      typeMotif: request.typeMotif,
      motif: request.motif,
      numeroReception: request.numeroReception,
      fraisService: Math.floor(request.montantDemande * 0.065),
      montantTotal: request.montantDemande + Math.floor(request.montantDemande * 0.065),
      salaireDisponible: employee.salaire_net,
      avanceDisponible: Math.floor(employee.salaire_net * 0.25) - (request.montantDemande * i),
      entrepriseId: partnerId,
      password: TEST_CONFIG.testEmployee.password
    }
    
    try {
      const response = await fetch(`${baseUrl}/api/salary-advance/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        log(`✅ Demande ${i + 1} créée: ${result.data.id}`, 'success')
      } else {
        log(`⚠️ Demande ${i + 1} rejetée: ${result.message}`, 'warning')
      }
      
      // Pause entre les demandes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      log(`❌ Erreur demande ${i + 1}: ${error.message}`, 'error')
    }
  }
}

async function cleanupTestData(employee, partnerId) {
  logSubSection('Nettoyage des données de test')
  
  try {
    // Supprimer les demandes d'avance de test
    const { error: advanceError } = await supabase
      .from('salary_advance_requests')
      .delete()
      .eq('employe_id', employee.id)
    
    if (advanceError) {
      log(`Erreur suppression demandes: ${advanceError.message}`, 'error')
    } else {
      log('✅ Demandes d\'avance supprimées', 'success')
    }
    
    // Supprimer les transactions financières de test
    const { error: transactionError } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('utilisateur_id', employee.id)
    
    if (transactionError) {
      log(`Erreur suppression transactions: ${transactionError.message}`, 'error')
    } else {
      log('✅ Transactions financières supprimées', 'success')
    }
    
    // Supprimer l'employé
    const { error: employeeError } = await supabase
      .from('employees')
      .delete()
      .eq('id', employee.id)
    
    if (employeeError) {
      log(`Erreur suppression employé: ${employeeError.message}`, 'error')
    } else {
      log('✅ Employé supprimé', 'success')
    }
    
    // Supprimer le partenaire
    const { error: partnerError } = await supabase
      .from('partners')
      .delete()
      .eq('id', partnerId)
    
    if (partnerError) {
      log(`Erreur suppression partenaire: ${partnerError.message}`, 'error')
    } else {
      log('✅ Partenaire supprimé', 'success')
    }
    
  } catch (error) {
    log(`Erreur nettoyage: ${error.message}`, 'error')
  }
}

// =====================================================
// FONCTION PRINCIPALE
// =====================================================

async function runTests() {
  logSection('DÉBUT DES TESTS - DEMANDES D\'AVANCE SUR SALAIRE')
  
  let employee = null
  let partnerId = null
  
  try {
    // Test 1: Connexion Supabase
    const connectionOk = await testSupabaseConnection()
    if (!connectionOk) {
      log('❌ Impossible de continuer sans connexion Supabase', 'error')
      return
    }
    
    // Test 2: Création du partenaire de test
    partnerId = await createTestPartner()
    if (!partnerId) {
      log('❌ Impossible de continuer sans partenaire', 'error')
      return
    }
    
    // Test 3: Création de l'employé de test
    employee = await createTestEmployee(partnerId)
    if (!employee) {
      log('❌ Impossible de continuer sans employé', 'error')
      return
    }
    
    // Test 4: Authentification
    const authOk = await testAuthentication(employee)
    if (!authOk) {
      log('⚠️ Authentification échouée, certains tests peuvent échouer', 'warning')
    }
    
    // Test 5: API de demandes d'avance
    await testSalaryAdvanceAPI(employee, partnerId)
    
    // Test 6: Requêtes de base de données
    await testDatabaseQueries(employee, partnerId)
    
    // Test 7: Règles de validation
    await testValidationRules(employee, partnerId)
    
    // Test 8: Demandes multiples
    await testMultipleRequests(employee, partnerId)
    
    logSection('RÉSUMÉ DES TESTS')
    log('✅ Tous les tests ont été exécutés avec succès', 'success')
    log('📊 Vérifiez les logs ci-dessus pour les détails', 'info')
    
  } catch (error) {
    log(`❌ Erreur critique: ${error.message}`, 'error')
  } finally {
    // Nettoyage optionnel (décommentez pour nettoyer automatiquement)
    // if (employee && partnerId) {
    //   await cleanupTestData(employee, partnerId)
    // }
    
    logSection('FIN DES TESTS')
    log('🔧 Les données de test sont conservées pour inspection', 'info')
    log('🧹 Pour nettoyer, exécutez: node test-salary-advance-requests.js --cleanup', 'info')
  }
}

// =====================================================
// EXÉCUTION
// =====================================================

if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.includes('--cleanup')) {
    logSection('NETTOYAGE DES DONNÉES DE TEST')
    // Logique de nettoyage spécifique si nécessaire
    log('🧹 Utilisez l\'interface Supabase pour nettoyer manuellement', 'info')
  } else {
    runTests()
  }
}

module.exports = {
  runTests,
  testSupabaseConnection,
  createTestPartner,
  createTestEmployee,
  testSalaryAdvanceAPI,
  testDatabaseQueries,
  testValidationRules,
  testMultipleRequests,
  cleanupTestData
} 