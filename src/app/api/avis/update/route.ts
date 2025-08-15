import { NextRequest } from 'next/server';
import { handleOptions, createCorsResponse } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function PUT(request: NextRequest) {
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
    const { id, note, commentaire, type_retour } = body;

    if (!id || !note || !commentaire || !type_retour) {
      return createCorsResponse(
        { error: 'ID, note, commentaire et type de retour requis' },
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

    const response = await fetch(`${supabaseUrl}/functions/v1/employee-avis/update`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, note, commentaire, type_retour }),
    });

    const result = await response.json();

    if (!response.ok) {
      return createCorsResponse(
        { error: result.error || 'Erreur lors de la mise à jour de l\'avis' },
        response.status,
        request
      );
    }

    return createCorsResponse(result, 200, request);
  } catch (error) {
    console.error('❌ Erreur dans la route /api/avis/update:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500,
      request
    );
  }
}
