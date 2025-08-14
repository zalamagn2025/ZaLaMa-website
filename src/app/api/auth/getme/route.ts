import { NextRequest, NextResponse } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    console.log('👤 Récupération du profil employé...');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsResponse(
        { success: false, error: 'Token d\'authentification requis' },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/getme`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      return createCorsResponse(
        { 
          success: false, 
          error: result.error || 'Erreur lors de la récupération du profil',
          details: result.message 
        },
        response.status
      );
    }

    return createCorsResponse({
      success: true,
      message: 'Profil employé récupéré avec succès',
      data: result.data
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la récupération du profil:', error);
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
