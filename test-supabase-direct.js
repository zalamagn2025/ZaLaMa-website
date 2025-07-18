// Test direct Supabase - Plus rapide pour vérifier la connexion
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PRIVATE_SUPABASE_URL
const supabaseKey = process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  try {
    console.log('🔗 Test de connexion Supabase...')
    
    // Test 1: Vérifier la table partners
    const { data: partners, error } = await supabase
      .from('partners')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return
    }
    
    console.log('✅ Connexion réussie!')
    console.log(`📊 Nombre de partenaires: ${partners.length}`)
    
    if (partners.length > 0) {
      console.log('📋 Derniers partenaires:')
      partners.forEach((partner, index) => {
        console.log(`${index + 1}. ${partner.nom} (${partner.actif ? 'Actif' : 'Inactif'})`)
      })
    }
    
    // Test 2: Insérer un partenaire de test
    const testPartner = {
      nom: "Test Company " + Date.now(),
      type: "SARL",
      secteur: "Test",
      description: "Partenaire de test",
      nom_representant: "Test Rep",
      email_representant: "test@test.com",
      telephone_representant: "+224123456789",
      nom_rh: "Test RH",
      email_rh: "rh@test.com",
      telephone_rh: "+224123456789",
      rccm: "RC" + Date.now(),
      nif: "NIF" + Date.now(),
      email: "company@test.com",
      telephone: "+224123456789",
      adresse: "Test Address",
      actif: false,
      nombre_employes: 10,
      salaire_net_total: 0,
      date_adhesion: new Date().toISOString()
    }
    
    console.log('\n📝 Test d\'insertion...')
    const { data: newPartner, error: insertError } = await supabase
      .from('partners')
      .insert(testPartner)
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Erreur d\'insertion:', insertError)
      return
    }
    
    console.log('✅ Insertion réussie!')
    console.log('🆔 Nouveau partenaire ID:', newPartner.id)
    
    // Nettoyer le test
    console.log('\n🧹 Nettoyage du test...')
    const { error: deleteError } = await supabase
      .from('partners')
      .delete()
      .eq('id', newPartner.id)
    
    if (deleteError) {
      console.error('⚠️ Erreur de nettoyage:', deleteError)
    } else {
      console.log('✅ Test nettoyé')
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

testSupabaseConnection() 