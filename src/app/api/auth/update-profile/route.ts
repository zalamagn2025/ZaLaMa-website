import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function PUT(request: NextRequest) {
  try {
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsResponse(
        { success: false, error: 'Token d\'authentification requis' },
        401,
        request
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500,
        request
      );
    }

    const body = await request.json();

    // ✅ Utiliser l'Edge Function pour la mise à jour du profil
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/update-profile`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    
    /*console.log('📥 Réponse de l\'Edge Function:', {
      status: response.status,
      success: result.success,
      error: result.error,
      data: result.data ? 'Présent' : 'Absent'
    })*/
    
    if (!response.ok) {
      return createCorsResponse(
        { 
          success: false, 
          error: result.error || 'Erreur lors de la mise à jour du profil',
          details: result.message 
        },
        response.status,
        request
      );
    }

    return createCorsResponse({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: result.data || result
    }, 200, request);

  } catch (error) {
    console.error('💥 Erreur dans /api/auth/update-profile:', error);
    return createCorsResponse(
      { success: false, error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      500,
      request
    );
  }
}
