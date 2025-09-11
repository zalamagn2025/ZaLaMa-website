import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 API Route: Annulation de demande d\'avance...');
    
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Parser le body de la requête
    const body = await request.json();
    const { id: demandId, reason } = body;

    if (!demandId) {
      return NextResponse.json(
        { success: false, message: 'ID de la demande requis' },
        { status: 400 }
      );
    }

    console.log('📝 Annulation de la demande:', demandId, reason ? `Motif: ${reason}` : 'Sans motif');

    // Appeler l'Edge Function Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, message: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-demands/cancel`;
    
    console.log('🔗 Appel de l\'Edge Function:', edgeFunctionUrl);

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        id: demandId,
        reason: reason || undefined
      })
    });

    console.log('📡 Réponse Edge Function:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('📄 Contenu de la réponse:', responseText);

    if (!response.ok) {
      let errorMessage = 'Erreur lors de l\'annulation de la demande';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        errorMessage = responseText || errorMessage;
      }
      
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON de la réponse:', parseError);
      return NextResponse.json(
        { success: false, message: 'Réponse invalide du serveur' },
        { status: 500 }
      );
    }

    console.log('✅ Demande annulée avec succès:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Demande annulée avec succès',
      data: result.data
    });

  } catch (error) {
    console.error('❌ Erreur API route annulation:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur interne du serveur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
