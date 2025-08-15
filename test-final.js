// Test final des routes API
const testRoutes = async () => {
  console.log('🧪 Test des routes API...');
  
  try {
    // Test 1: Validation API Key
    console.log('\n📋 Test 1: Validation API Key');
    const validationResponse = await fetch('http://localhost:3000/api/validate-api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: 'test-key-123' })
    });

    console.log('📡 Status validation:', validationResponse.status);
    const validationResult = await validationResponse.json();
    console.log('📋 Résultat validation:', validationResult);

    // Test 2: Inscription (avec données de test)
    console.log('\n📋 Test 2: Inscription employé');
    const registrationData = {
      api_key: "test-key-123",
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      telephone: "+22461234567",
      adresse: "123 Test Street",
      genre: "Homme",
      poste: "Développeur",
      matricule: "TEST001",
      type_contrat: "CDI",
      salaire_net: 500000,
      date_embauche: "2024-01-15",
      date_expiration: "2025-01-15"
    };

    const registrationResponse = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });

    console.log('📡 Status inscription:', registrationResponse.status);
    const registrationResult = await registrationResponse.json();
    console.log('📋 Résultat inscription:', registrationResult);

    console.log('\n✅ Tests terminés !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

testRoutes();
