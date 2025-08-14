import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

// Gestion CORS pour les requêtes OPTIONS
export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/avis/list - Début de la requête');
    
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

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();
    
    // Paramètres supportés
    const supportedParams = [
      'page', 'limit', 'partner_id', 'note_min', 'note_max', 
      'type_retour', 'approuve', 'date_debut', 'date_fin', 
      'sort_by', 'sort_order'
    ];
    
    supportedParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        queryParams.append(param, value);
      }
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL n\'est pas défini');
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    console.log('🔍 Appel de l\'Edge Function employee-avis/list');
    console.log('🔧 URL Edge Function:', `${supabaseUrl}/functions/v1/employee-avis/list`);
    console.log('📤 Paramètres de requête:', queryParams.toString());

    // Appeler l'Edge Function Supabase pour lister les avis
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-avis/list?${queryParams.toString()}`;
    
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
          error: result.error || 'Erreur lors de la récupération des avis',
          details: result.message 
        },
        response.status
      );
    }

    console.log('✅ Liste des avis récupérée avec succès');
    
    // Retourner la réponse de l'Edge Function
    return createCorsResponse({
      success: true,
      data: result.data || [],
      pagination: result.pagination,
      stats: result.stats
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la récupération des avis:', error);
    
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
