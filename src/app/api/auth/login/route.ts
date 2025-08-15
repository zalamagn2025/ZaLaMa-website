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
    if (!supabaseUrl) {
      return createCorsResponse(
        { error: 'Configuration Supabase manquante' },
        500,
        request
      );
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return createCorsResponse(
        { error: result.error || 'Erreur d\'authentification' },
        response.status,
        request
      );
    }

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
