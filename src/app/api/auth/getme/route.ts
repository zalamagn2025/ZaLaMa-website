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
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/getme`;
    
    console.log('🔍 Appel Edge Function getme...');
    console.log('📍 URL:', edgeFunctionUrl);
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey || '',
      },
    });

    const result = await response.json();
    
    console.log('📋 Réponse Edge Function getme:', response.status, result);
    
    if (!response.ok) {
      console.error('❌ Erreur Edge Function getme:', response.status, result);
      return createCorsResponse(
        { 
          success: false, 
          error: result.error || 'Erreur lors de la récupération du profil',
          details: result.message || result.details,
          status: response.status
        },
        response.status
      );
    }

    console.log('✅ Profil récupéré avec succès');
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
