const fetch = require('node-fetch').default;

async function checkDomains() {
  const domains = [
    'https://zalamagn.com',
    'https://www.zalamagn.com'
  ];

  console.log('🔍 Vérification de l\'accessibilité des domaines');
  console.log('---');

  for (const domain of domains) {
    try {
      console.log(`📍 Test de ${domain}...`);
      
      const response = await fetch(`${domain}/api/auth/send-reset-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' })
      });

      if (response.ok) {
        console.log(`✅ ${domain} - Accessible (${response.status})`);
      } else {
        console.log(`⚠️  ${domain} - Réponse ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${domain} - Erreur: ${error.message}`);
    }
  }

  console.log('---');
  console.log('💡 Si les deux domaines sont accessibles, le problème peut être :');
  console.log('1. Le site n\'est pas encore déployé');
  console.log('2. Il y a une redirection automatique vers www');
  console.log('3. La configuration DNS n\'est pas encore propagée');
}

checkDomains(); 