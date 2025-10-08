import { NextRequest, NextResponse } from 'next/server';

const EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/upload-partner-logo';

export async function DELETE(request: NextRequest) {
  try {
    /*console.log('🗑️ API Route: Début suppression logo via edge function')*/
    
    // Récupérer le nom du fichier depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    
    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'Nom de fichier manquant' },
        { status: 400 }
      );
    }

    /*console.log('📁 Suppression du fichier:', fileName)*/

    // Appeler l'edge function Supabase pour la suppression
    const url = `${EDGE_FUNCTION_URL}?fileName=${encodeURIComponent(fileName)}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    });

    const result = await response.json();
    
    /*console.log('📥 Réponse suppression edge function:', {
      status: response.status,
      statusText: response.statusText,
      result
    })*/

    if (!response.ok) {
      console.error('❌ Erreur suppression edge function:', response.status, response.statusText);
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || `Erreur ${response.status}: ${response.statusText}`,
          details: result
        },
        { status: response.status }
      );
    }

    /*console.log('✅ Suppression réussie via edge function')*/
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Erreur API route suppression logo:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la suppression'
      },
      { status: 500 }
    );
  }
}

// Gérer les requêtes OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}










