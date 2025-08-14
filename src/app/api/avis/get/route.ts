import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

// Gestion CORS pour les requêtes OPTIONS
export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    console.log('👁️ GET /api/avis/get - Début de la requête');
    
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token d\'authentification manquant');
      return createCorsResponse(
        { success: false, error: 'Token d\'authentification requis' },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('✅ Token d\'authentification récupéré');

    // Récupérer l'ID de l'avis depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const avisId = searchParams.get('id');
    
    if (!avisId) {
      console.log('❌ ID de l\'avis manquant');
      return createCorsResponse(
        { success: false, error: 'ID de l\'avis requis' },
        400
      );
    }

    console.log('🔍 ID de l\'avis:', avisId);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL n\'est pas défini');
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    console.log('👁️ Appel de l\'Edge Function employee-avis/get');
    console.log('🔧 URL Edge Function:', `${supabaseUrl}/functions/v1/employee-avis/get?id=${avisId}`);

    // Appeler l'Edge Function Supabase pour récupérer l'avis
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-avis/get?id=${avisId}`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Réponse Edge Function - Status:', response.status);
    console.log('📥 Réponse Edge Function - Headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📥 Réponse Edge Function - Body:', result);
    
    if (!response.ok) {
      console.error('❌ Erreur Edge Function:', result);
      
      return createCorsResponse(
        { 
          success: false, 
          error: result.error || 'Erreur lors de la récupération de l\'avis',
          details: result.message 
        },
        response.status
      );
    }

    console.log('✅ Avis récupéré avec succès');
    
    // Retourner la réponse de l'Edge Function
    return createCorsResponse({
      success: true,
      data: result.data
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la récupération de l\'avis:', error);
    
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
