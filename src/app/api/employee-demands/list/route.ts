import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    /*console.log('📋 Récupération de la liste des demandes d\'avance...')*/
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsResponse(
        { error: 'Token d\'authentification requis' },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      return createCorsResponse(
        { error: 'Configuration serveur manquante' },
        500
      );
    }

    // Récupérer les paramètres de pagination
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-demands/list?page=${page}&limit=${limit}`;
    
    /*console.log('🔍 Appel Edge Function employee-demands/list...')*/
    /*console.log('📍 URL:', edgeFunctionUrl)*/
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey || '',
      },
    });

    const result = await response.json();
    
    /*console.log('📋 Réponse Edge Function employee-demands/list:', response.status, result)*/
    
    if (!response.ok) {
      console.error('❌ Erreur Edge Function employee-demands/list:', response.status, result);
      return createCorsResponse(
        { 
          error: result.error || 'Erreur lors de la récupération des demandes',
          details: result.message || result.details,
          status: response.status
        },
        response.status
      );
    }

    /*console.log('✅ Liste des demandes récupérée avec succès')*/
    return createCorsResponse(result);

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la récupération des demandes:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500
    );
  }
}








