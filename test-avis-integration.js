const fetch = require('node-fetch');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const EMPLOYEE_AUTH_URL = `${BASE_URL}/functions/v1/employee-auth`;
const AVIS_API_URL = 'http://localhost:3000/api/avis';

// Données de test
const TEST_EMPLOYEE = {
  email: 'test@example.com',
  password: 'testpassword123'
};

let accessToken = null;

// Fonction pour se connecter et obtenir un token
async function login() {
  console.log('🔐 Connexion pour obtenir le token...');
  
  try {
    const response = await fetch(`${EMPLOYEE_AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_EMPLOYEE),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur de connexion: ${result.error}`);
    }

    accessToken = result.access_token;
    console.log('✅ Connexion réussie, token obtenu');
    return accessToken;
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error.message);
    throw error;
  }
}

// Fonction pour tester la liste des avis
async function testListAvis() {
  console.log('\n📋 Test de la liste des avis...');
  
  try {
    const response = await fetch(`${AVIS_API_URL}/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur: ${result.error}`);
    }

    console.log('✅ Liste des avis récupérée avec succès');
    console.log(`📊 Nombre d'avis: ${result.data?.length || 0}`);
    
    if (result.pagination) {
      console.log(`📄 Pagination: Page ${result.pagination.page}/${result.pagination.totalPages}`);
    }
    
    return result.data || [];
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des avis:', error.message);
    throw error;
  }
}

// Fonction pour tester la création d'un avis
async function testCreateAvis() {
  console.log('\n📝 Test de la création d\'un avis...');
  
  const avisData = {
    note: 5,
    commentaire: 'Test d\'intégration - Excellent service !',
    type_retour: 'positif'
  };
  
  try {
    const response = await fetch(`${AVIS_API_URL}/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avisData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur: ${result.error}`);
    }

    console.log('✅ Avis créé avec succès');
    console.log(`🆔 ID de l'avis: ${result.data.id}`);
    console.log(`📊 Note: ${result.data.note}/5`);
    console.log(`💬 Commentaire: ${result.data.commentaire}`);
    
    if (result.limitInfo) {
      console.log(`📈 Limite: ${result.limitInfo.currentCount}/${result.limitInfo.limit} avis utilisés`);
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'avis:', error.message);
    throw error;
  }
}

// Fonction pour tester la récupération d'un avis spécifique
async function testGetAvis(avisId) {
  console.log(`\n👁️ Test de la récupération de l'avis ${avisId}...`);
  
  try {
    const response = await fetch(`${AVIS_API_URL}/get?id=${avisId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur: ${result.error}`);
    }

    console.log('✅ Avis récupéré avec succès');
    console.log(`📊 Note: ${result.data.note}/5`);
    console.log(`💬 Commentaire: ${result.data.commentaire}`);
    console.log(`📅 Date: ${new Date(result.data.date_avis).toLocaleDateString()}`);
    
    return result.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'avis:', error.message);
    throw error;
  }
}

// Fonction pour tester la mise à jour d'un avis
async function testUpdateAvis(avisId) {
  console.log(`\n✏️ Test de la mise à jour de l'avis ${avisId}...`);
  
  const updateData = {
    note: 4,
    commentaire: 'Test d\'intégration - Service amélioré !',
    type_retour: 'positif'
  };
  
  try {
    const response = await fetch(`${AVIS_API_URL}/update?id=${avisId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur: ${result.error}`);
    }

    console.log('✅ Avis mis à jour avec succès');
    console.log(`📊 Nouvelle note: ${result.data.note}/5`);
    console.log(`💬 Nouveau commentaire: ${result.data.commentaire}`);
    
    return result.data;
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'avis:', error.message);
    throw error;
  }
}

// Fonction pour tester les statistiques
async function testStats() {
  console.log('\n📊 Test des statistiques...');
  
  try {
    const response = await fetch(`${AVIS_API_URL}/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur: ${result.error}`);
    }

    console.log('✅ Statistiques récupérées avec succès');
    console.log(`📈 Total avis: ${result.data.total_avis}`);
    console.log(`⭐ Moyenne note: ${result.data.moyenne_note.toFixed(1)}/5`);
    console.log(`👍 Avis positifs: ${result.data.avis_positifs}`);
    console.log(`👎 Avis négatifs: ${result.data.avis_negatifs}`);
    console.log(`✅ Avis approuvés: ${result.data.avis_approuves}`);
    console.log(`⏳ Avis en attente: ${result.data.avis_en_attente}`);
    
    return result.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error.message);
    throw error;
  }
}

// Fonction pour tester la suppression d'un avis
async function testDeleteAvis(avisId) {
  console.log(`\n🗑️ Test de la suppression de l'avis ${avisId}...`);
  
  try {
    const response = await fetch(`${AVIS_API_URL}/delete?id=${avisId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erreur: ${result.error}`);
    }

    console.log('✅ Avis supprimé avec succès');
    console.log(`💬 Message: ${result.message}`);
    
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'avis:', error.message);
    throw error;
  }
}

// Fonction principale de test
async function runTests() {
  console.log('🚀 Démarrage des tests d\'intégration des API avis...\n');
  
  try {
    // 1. Connexion
    await login();
    
    // 2. Liste des avis
    const avisList = await testListAvis();
    
    // 3. Création d'un avis
    const newAvis = await testCreateAvis();
    
    // 4. Récupération de l'avis créé
    await testGetAvis(newAvis.id);
    
    // 5. Mise à jour de l'avis
    await testUpdateAvis(newAvis.id);
    
    // 6. Statistiques
    await testStats();
    
    // 7. Suppression de l'avis (optionnel - commenté pour garder les données de test)
    // await testDeleteAvis(newAvis.id);
    
    console.log('\n🎉 Tous les tests ont réussi !');
    console.log('✅ L\'intégration des API avis fonctionne correctement');
    
  } catch (error) {
    console.error('\n💥 Erreur lors des tests:', error.message);
    console.error('❌ L\'intégration nécessite des corrections');
    process.exit(1);
  }
}

// Configuration des variables d'environnement
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL n\'est pas défini');
  console.log('💡 Ajoutez NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co à votre .env');
  process.exit(1);
}

// Instructions d'utilisation
console.log('📋 Instructions:');
console.log('1. Assurez-vous que le serveur Next.js est démarré (npm run dev)');
console.log('2. Vérifiez que l\'Edge Function employee-avis est déployée');
console.log('3. Mettez à jour les données de test dans ce script');
console.log('4. Exécutez: node test-avis-integration.js\n');

// Exécuter les tests
runTests();
