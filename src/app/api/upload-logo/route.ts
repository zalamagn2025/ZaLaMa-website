import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/upload-partner-logo';

// Créer le client Supabase avec la clé de service
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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
    
    console.log('🔍 Partner ID utilisé:', tempPartnerId);
    
    // Créer le FormData pour l'edge function déployée (elle attend 'logo' et 'partner_id')
    const edgeFormData = new FormData();
    edgeFormData.append('logo', logo);
    edgeFormData.append('partner_id', tempPartnerId);
    
    console.log('📤 Préparation des données pour edge function Hono:', {
      fileName: logo.name,
      fileSize: logo.size,
      fileType: logo.type,
      partnerId: tempPartnerId
    });
    
    // Debug: vérifier le contenu du FormData
    console.log('🔍 Contenu du FormData:');
    for (const [key, value] of edgeFormData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

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
    console.log('📥 Headers de réponse:', Object.fromEntries(response.headers.entries()));
    console.log('📥 Status:', response.status, response.statusText);
    
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
      console.error('❌ Contenu brut (premiers 500 chars):', responseText.substring(0, 500));
      console.error('❌ Content-Type:', response.headers.get('content-type'));
      
      // Si c'est du HTML, c'est probablement une page d'erreur
      if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'L\'edge function a retourné du HTML au lieu de JSON',
            details: { 
              status: response.status,
              statusText: response.statusText,
              contentType: response.headers.get('content-type'),
              rawResponse: responseText.substring(0, 200) + '...'
            }
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Format JSON invalide de l\'edge function',
          details: { 
            rawResponse: responseText.substring(0, 200) + '...', 
            parseError: parseError instanceof Error ? parseError.message : String(parseError),
            status: response.status,
            statusText: response.statusText
          }
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('❌ Erreur edge function:', response.status, response.statusText);
      console.error('❌ Détails de l\'erreur:', result);
      
      // Fallback: utiliser directement Supabase Storage
      console.log('🔄 Fallback: Upload direct vers Supabase Storage...');
      return await uploadDirectToSupabase(logo, tempPartnerId);
    }

    console.log('✅ Upload réussi via edge function Supabase');
    
    // Adapter la réponse de l'edge function déployée pour le composant LogoUpload
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

// Fonction de fallback pour upload direct vers Supabase Storage
async function uploadDirectToSupabase(logo: File, tempPartnerId: string) {
  try {
    console.log('📤 Upload direct vers Supabase Storage...');
    
    // Générer un chemin unique pour le fichier
    const timestamp = Date.now();
    const fileExtension = logo.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}_${logo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${tempPartnerId}/${fileName}`;
    
    console.log('📁 Chemin généré:', filePath);

    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('partner-logos')
      .upload(filePath, logo, {
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erreur upload Supabase Storage:', uploadError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur lors de l\'upload vers Supabase Storage',
          details: uploadError.message
        },
        { status: 500 }
      );
    }

    console.log('✅ Upload réussi vers Supabase Storage:', uploadData);

    // Obtenir l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from('partner-logos')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData?.publicUrl || '';

    // Créer le base64
    const arrayBuffer = await logo.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64 = btoa(String.fromCharCode(...uint8Array));
    const base64DataUri = `data:${logo.type};base64,${base64}`;

    console.log('✅ Upload direct complet:', {
      fileName: logo.name,
      filePath: filePath,
      publicUrl: publicUrl,
      fileSize: logo.size,
      fileType: logo.type
    });
    
    // Retourner la réponse au format attendu par le composant
    const result = {
      success: true,
      message: 'Logo uploadé avec succès (upload direct)',
      data: {
        fileName: logo.name,
        filePath: filePath,
        publicUrl: publicUrl,
        fileSize: logo.size,
        fileType: logo.type,
        partner_id: tempPartnerId,
        logo_base64: base64DataUri
      }
    };
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Erreur upload direct:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload direct'
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
