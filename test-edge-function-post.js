// Test POST vers l'edge function upload-logo
const FormData = require('form-data');

async function testEdgeFunctionPost() {
  console.log('🧪 Test POST vers l\'edge function upload-logo...\n');
  
  try {
    // Créer un fichier de test simple (1x1 pixel PNG)
    const testContent = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(testContent, 'base64');
    
    const formData = new FormData();
    formData.append('logo', buffer, {
      filename: 'test.png',
      contentType: 'image/png'
    });
    formData.append('partner_id', 'test-partner-123');
    
    console.log('📤 Envoi POST vers l\'edge function...');
    const response = await fetch('https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/upload-logo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log(`Response:`, text);
    
    if (response.ok) {
      console.log('✅ Edge function fonctionne !');
    } else {
      console.log('❌ Edge function a un problème');
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

testEdgeFunctionPost().catch(console.error);
