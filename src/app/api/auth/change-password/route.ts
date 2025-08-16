import { NextRequest } from 'next/server';
import { handleOptions, createCorsResponse } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return createCorsResponse(
        { error: 'Token d\'autorisation requis' },
        401,
        request
      );
    }

    const body = await request.json();
    const { current_password, new_password, confirm_password } = body;

    if (!current_password || !new_password || !confirm_password) {
      return createCorsResponse(
        { error: 'Ancien mot de passe, nouveau mot de passe et confirmation requis' },
        400,
        request
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return createCorsResponse(
        { error: 'Configuration Supabase manquante' },
        500,
        request
      );
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ current_password, new_password, confirm_password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return createCorsResponse(
        { error: result.error || 'Erreur lors du changement de mot de passe' },
        response.status,
        request
      );
    }

    return createCorsResponse(result, 200, request);
  } catch (error) {
    console.error('❌ Erreur dans la route /api/auth/change-password:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500,
      request
    );
  }
} 