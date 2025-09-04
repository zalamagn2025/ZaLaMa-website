import { NextRequest, NextResponse } from 'next/server';

const EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/upload-logo';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Route: Début upload logo via edge function Supabase');
    console.log('📋 Headers de la requête:', Object.fromEntries(request.headers.entries()));
    console.log('📋 Content-Type:', request.headers.get('content-type'));
    
    // Récupérer le FormData de la requête
    const formData = await request.formData();
    console.log('📋 FormData reçu, clés disponibles:', Array.from(formData.keys()));
    
    // Vérifier que le logo est présent
    const logo = formData.get('logo') as File;
    const partnerId = formData.get('partner_id') as string;
    
    if (!logo) {
      console.log('❌ Fichier logo manquant');
      return NextResponse.json(
        { success: false, error: 'Fichier logo manquant' },
        { status: 400 }
      );
    }

    console.log('📁 Fichier reçu:', {
      name: logo.name,
      size: logo.size,
      type: logo.type,
      partnerId
    });

    // Générer un partner_id temporaire si non fourni
    const tempPartnerId = partnerId || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Créer le FormData pour l'edge function Hono
    const edgeFormData = new FormData();
    edgeFormData.append('logo', logo);
    edgeFormData.append('partner_id', tempPartnerId);
    
    console.log('📤 Préparation des données pour edge function Hono:', {
      fileName: logo.name,
      fileSize: logo.size,
      fileType: logo.type,
      partnerId: tempPartnerId
    });

    console.log('📤 Envoi vers edge function Supabase...');
    console.log('🔗 URL Edge Function:', EDGE_FUNCTION_URL);
    
    // Vérifier les variables d'environnement
    const authKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    console.log('🔑 Clé d\'authentification:', authKey ? 'Présente' : 'Manquante');

    if (!authKey) {
      console.error('❌ Aucune clé d\'authentification trouvée');
      return NextResponse.json(
        { success: false, error: 'Configuration d\'authentification manquante' },
        { status: 500 }
      );
    }

    // Appeler l'edge function Supabase avec FormData
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authKey}`,
      },
      body: edgeFormData,
    });

    // Lire le contenu brut de la réponse
    const responseText = await response.text();
    console.log('📥 Réponse edge function (brute):', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('📥 Réponse edge function (parsed):', {
        status: response.status,
        statusText: response.statusText,
        result
      });
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      console.error('❌ Contenu brut:', responseText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Format JSON invalide de l\'edge function',
          details: { rawResponse: responseText, parseError: parseError.message }
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('❌ Erreur edge function:', response.status, response.statusText);
      console.error('❌ Détails de l\'erreur:', result);
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || `Erreur ${response.status}: ${response.statusText}`,
          details: result
        },
        { status: response.status }
      );
    }

    console.log('✅ Upload réussi via edge function Supabase');
    
    // Adapter la réponse de l'edge function Hono pour le composant LogoUpload
    const adaptedResult = {
      success: true,
      message: 'Logo uploadé avec succès',
      data: {
        fileName: logo.name, // Nom original du fichier
        filePath: result.logo_path, // Chemin dans le bucket
        publicUrl: result.logo_url, // URL publique
        fileSize: logo.size,
        fileType: logo.type,
        partner_id: result.partner_id,
        logo_base64: result.logo_base64 // Base64 fourni par l'edge function
      }
    };
    
    return NextResponse.json(adaptedResult);

  } catch (error) {
    console.error('❌ Erreur API route upload logo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API upload-logo fonctionne avec edge function Supabase !',
    edgeFunctionUrl: EDGE_FUNCTION_URL,
    timestamp: new Date().toISOString(),
    version: '4.0-real-edge-function'
  });
}
