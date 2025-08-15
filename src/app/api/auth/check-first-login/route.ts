import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Vérification de la première connexion...');
    
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

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/check-first-login`;
    
    console.log('🔍 Appel Edge Function check-first-login...');
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
    
    console.log('📋 Réponse Edge Function check-first-login:', response.status, result);
    
    if (!response.ok) {
      console.error('❌ Erreur Edge Function check-first-login:', response.status, result);
      return createCorsResponse(
        { 
          error: result.error || 'Erreur lors de la vérification de la première connexion',
          details: result.message || result.details,
          status: response.status
        },
        response.status
      );
    }

    console.log('✅ Vérification de première connexion réussie');
    return createCorsResponse({
      success: true,
      requirePasswordChange: result.requirePasswordChange || false,
      message: result.message || 'Vérification terminée'
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la vérification de la première connexion:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500
    );
  }
} 