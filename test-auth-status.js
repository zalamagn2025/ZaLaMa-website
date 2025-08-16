// Script pour vérifier le statut d'authentification
console.log('🔍 Vérification du statut d\'authentification...\n');

// Vérifier les tokens dans le localStorage
if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('employee_access_token');
  const refreshToken = localStorage.getItem('employee_refresh_token');
  
  console.log('📋 Tokens trouvés:');
  console.log(`   Access Token: ${accessToken ? '✅ Présent' : '❌ Absent'}`);
  console.log(`   Refresh Token: ${refreshToken ? '✅ Présent' : '❌ Absent'}`);
  
  if (accessToken) {
    console.log('\n🔐 Détails du token d\'accès:');
    try {
      // Décoder le token JWT (partie payload)
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      
      console.log(`   Issued At: ${new Date(payload.iat * 1000).toLocaleString()}`);
      console.log(`   Expires At: ${new Date(payload.exp * 1000).toLocaleString()}`);
      console.log(`   User ID: ${payload.sub || 'Non spécifié'}`);
      console.log(`   Email: ${payload.email || 'Non spécifié'}`);
      
      // Vérifier si le token est expiré
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      console.log(`   Expiré: ${isExpired ? '❌ OUI' : '✅ NON'}`);
      
      if (isExpired) {
        console.log('\n⚠️ Le token est expiré ! Veuillez vous reconnecter.');
      } else {
        console.log('\n✅ Le token est valide !');
      }
    } catch (error) {
      console.log('❌ Erreur lors du décodage du token:', error.message);
    }
  } else {
    console.log('\n❌ Aucun token d\'accès trouvé. Veuillez vous connecter.');
  }
  
  // Vérifier les autres clés de localStorage
  console.log('\n📦 Autres clés dans localStorage:');
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.includes('token') || key.includes('auth') || key.includes('user')) {
      const value = localStorage.getItem(key);
      console.log(`   ${key}: ${value ? '✅ Présent' : '❌ Absent'}`);
    }
  });
  
} else {
  console.log('❌ Ce script doit être exécuté dans un navigateur web.');
}

console.log('\n💡 Pour tester la page de changement de mot de passe:');
console.log('1. Assurez-vous d\'être connecté sur /login');
console.log('2. Vérifiez que les tokens sont présents ci-dessus');
console.log('3. Accédez à /auth/change-password');
console.log('4. Si le problème persiste, essayez de vous reconnecter');
