// Script de test pour vérifier l'état de l'authentification
console.log('🔍 Vérification de l\'état de l\'authentification...');

// Vérifier les tokens dans localStorage et sessionStorage
const employeeAccessToken = localStorage.getItem('employee_access_token');
const employeeRefreshToken = localStorage.getItem('employee_refresh_token');
const employeeToken = localStorage.getItem('employee_token'); // Ancienne clé

console.log('📋 Tokens trouvés:');
console.log('- employee_access_token (localStorage):', employeeAccessToken ? '✅ Présent' : '❌ Absent');
console.log('- employee_refresh_token (localStorage):', employeeRefreshToken ? '✅ Présent' : '❌ Absent');
console.log('- employee_token (localStorage) - ANCIENNE CLÉ:', employeeToken ? '⚠️ Présent (ancienne clé)' : '❌ Absent');

// Vérifier si l'utilisateur est connecté
if (employeeAccessToken) {
  console.log('✅ Utilisateur authentifié avec employee_access_token');
  
  // Décoder le token pour voir les informations
  try {
    const base64Url = employeeAccessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    console.log('🔑 Informations du token:');
    console.log('- Expire le:', new Date(payload.exp * 1000).toLocaleString());
    console.log('- Émis le:', new Date(payload.iat * 1000).toLocaleString());
    console.log('- Email:', payload.email || 'Non spécifié');
    console.log('- User ID:', payload.sub || 'Non spécifié');
    
    // Vérifier si le token est expiré
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    console.log('- Expiré:', isExpired ? '❌ OUI' : '✅ NON');
    
    if (!isExpired) {
      // Tester l'appel à l'API employee-demands
      console.log('🧪 Test de l\'API employee-demands...');
      
      fetch('/api/employee-demands/stats', {
        headers: {
          'Authorization': `Bearer ${employeeAccessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('📊 Réponse API stats:', response.status, response.statusText);
        return response.json();
      })
      .then(data => {
        console.log('📊 Données reçues:', data);
        if (data.success) {
          console.log('✅ API employee-demands fonctionne correctement!');
        } else {
          console.log('❌ Erreur API:', data.error);
        }
      })
      .catch(error => {
        console.error('❌ Erreur API:', error);
      });
    } else {
      console.log('⚠️ Token expiré - veuillez vous reconnecter');
    }
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
  }
  
} else {
  console.log('❌ Aucun token employee_access_token trouvé - utilisateur non authentifié');
  console.log('💡 Connectez-vous d\'abord sur /login');
  
  // Nettoyer l'ancienne clé si elle existe
  if (employeeToken) {
    console.log('🧹 Nettoyage de l\'ancienne clé employee_token...');
    localStorage.removeItem('employee_token');
  }
}
