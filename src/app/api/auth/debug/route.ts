import { NextRequest, NextResponse } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    /*console.log('🐛 Route de debug pour l\'authentification employé...')*/
    
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

    // Récupérer les paramètres de debug depuis l'URL
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('user_id');
    
    let edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/debug`;
    
    // Ajouter les paramètres de debug si fournis
    if (email || userId) {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (userId) params.append('user_id', userId);
      edgeFunctionUrl += `?${params.toString()}`;
    }
    
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
          error: result.error || 'Erreur lors du debug',
          details: result.message 
        },
        response.status
      );
    }

    return createCorsResponse({
      success: true,
      message: 'Informations de debug récupérées',
      debug: result.debug
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors du debug:', error);
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
