// Script de test rapide pour l'API partnership
const testData = {
  companyName: "Test Company SARL",
  legalStatus: "SARL",
  rccm: "RC123456789",
  nif: "NIF123456789",
  activityDomain: "Technologie",
  headquartersAddress: "123 Rue Test, Conakry",
  phone: "+224123456789",
  email: "test@company.com",
  employeesCount: "50",
  payroll: "50000000",
  cdiCount: "45",
  cddCount: "5",
  paymentDate: "2024-12-25",
  agreement: true,
  repFullName: "John Doe",
  repEmail: "john.doe@company.com",
  repPhone: "+224123456789",
  repPosition: "Directeur Général",
  hrFullName: "Jane Smith",
  hrEmail: "jane.smith@company.com",
  hrPhone: "+224123456789"
};

async function testPartnershipAPI() {
  try {
    console.log('🧪 Test de l\'API partnership...');
    console.log('📤 Envoi des données:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/partnership', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès!');
      console.log('📊 Réponse:', result);
    } else {
      console.log('❌ Erreur:', result);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

// Exécuter le test
testPartnershipAPI(); 