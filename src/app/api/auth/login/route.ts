import { NextRequest } from 'next/server';
import { handleOptions, createCorsResponse } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return createCorsResponse(
        { error: 'Email et mot de passe requis' },
        400,
        request
      );
    }

    // Appeler l'Edge Function Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      return createCorsResponse(
        { error: 'Configuration Supabase manquante' },
        500,
        request
      );
    }

    console.log('🔐 Tentative de connexion via Edge Function...');
    console.log('📍 URL:', `${supabaseUrl}/functions/v1/employee-auth/login`);

    const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey || '',
        'Authorization': `Bearer ${supabaseAnonKey || ''}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    
    console.log('📋 Réponse Edge Function:', response.status, result);

    if (!response.ok) {
      console.error('❌ Erreur Edge Function:', response.status, result);
      return createCorsResponse(
        { 
          error: result.error || 'Erreur d\'authentification',
          details: result.message || result.details,
          status: response.status
        },
        response.status,
        request
      );
    }

    console.log('✅ Connexion réussie via Edge Function');
    return createCorsResponse(result, 200, request);
  } catch (error) {
    console.error('❌ Erreur dans la route /api/auth/login:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500,
      request
    );
  }
}
