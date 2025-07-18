const { createClient } = require('@supabase/supabase-js')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url'
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY || 'your_supabase_anon_key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAvisAPI() {
  console.log('🧪 Test de l\'API Avis')
  console.log('========================')

  try {
    // 1. Test de création d'un avis
    console.log('\n1. Test de création d\'un avis...')
    
    const testAvis = {
      note: 5,
      commentaire: 'Excellent service ! Très satisfait de l\'expérience utilisateur.',
      type_retour: 'positif'
    }

    const response = await fetch('http://localhost:3000/api/avis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAvis),
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Avis créé avec succès:', result.data)
    } else {
      console.log('❌ Erreur lors de la création:', result.error)
    }

    // 2. Test de récupération des avis
    console.log('\n2. Test de récupération des avis...')
    
    const getResponse = await fetch('http://localhost:3000/api/avis', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const getResult = await getResponse.json()
    
    if (getResponse.ok) {
      console.log('✅ Avis récupérés avec succès:', getResult.data)
      console.log(`📊 Nombre d'avis: ${getResult.data?.length || 0}`)
    } else {
      console.log('❌ Erreur lors de la récupération:', getResult.error)
    }

    // 3. Test direct avec Supabase
    console.log('\n3. Test direct avec Supabase...')
    
    const { data: avisDirect, error: directError } = await supabase
      .from('avis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (directError) {
      console.log('❌ Erreur Supabase directe:', directError)
    } else {
      console.log('✅ Avis récupérés directement depuis Supabase:', avisDirect)
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Test de la structure de la table
async function testTableStructure() {
  console.log('\n🔍 Test de la structure de la table avis')
  console.log('========================================')

  try {
    const { data, error } = await supabase
      .from('avis')
      .select('*')
      .limit(1)

    if (error) {
      console.log('❌ Erreur lors de l\'accès à la table:', error)
      return
    }

    console.log('✅ Table avis accessible')
    
    if (data && data.length > 0) {
      console.log('📋 Structure d\'un enregistrement:')
      console.log(JSON.stringify(data[0], null, 2))
    } else {
      console.log('📋 Table vide, structure attendue:')
      console.log(JSON.stringify({
        id: 'uuid',
        user_id: 'uuid',
        partner_id: 'uuid',
        note: 'integer (1-5)',
        commentaire: 'text',
        type_retour: 'text (positif/negatif)',
        date_avis: 'timestamp',
        approuve: 'boolean',
        created_at: 'timestamp',
        updated_at: 'timestamp'
      }, null, 2))
    }

  } catch (error) {
    console.error('❌ Erreur lors du test de structure:', error)
  }
}

// Test des contraintes
async function testConstraints() {
  console.log('\n🔒 Test des contraintes de la table avis')
  console.log('========================================')

  const testCases = [
    {
      name: 'Note invalide (0)',
      data: { note: 0, commentaire: 'Test', type_retour: 'positif' },
      shouldFail: true
    },
    {
      name: 'Note invalide (6)',
      data: { note: 6, commentaire: 'Test', type_retour: 'positif' },
      shouldFail: true
    },
    {
      name: 'Type retour invalide',
      data: { note: 5, commentaire: 'Test', type_retour: 'neutre' },
      shouldFail: true
    },
    {
      name: 'Commentaire vide',
      data: { note: 5, commentaire: '', type_retour: 'positif' },
      shouldFail: true
    }
  ]

  for (const testCase of testCases) {
    console.log(`\nTest: ${testCase.name}`)
    
    try {
      const response = await fetch('http://localhost:3000/api/avis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      })

      const result = await response.json()
      
      if (testCase.shouldFail && !response.ok) {
        console.log('✅ Contrainte respectée (erreur attendue):', result.error)
      } else if (!testCase.shouldFail && response.ok) {
        console.log('✅ Test réussi:', result.data)
      } else {
        console.log('❌ Comportement inattendu:', result)
      }
    } catch (error) {
      console.log('❌ Erreur de test:', error.message)
    }
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests de l\'API Avis')
  console.log('=====================================')
  
  await testTableStructure()
  await testConstraints()
  await testAvisAPI()
  
  console.log('\n✨ Tests terminés')
}

// Exécuter les tests si le fichier est appelé directement
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = {
  testAvisAPI,
  testTableStructure,
  testConstraints,
  runAllTests
} 