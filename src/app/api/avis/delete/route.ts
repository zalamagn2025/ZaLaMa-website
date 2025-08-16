import { NextRequest } from 'next/server';
import { handleOptions, createCorsResponse } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return createCorsResponse(
        { error: 'Token d\'autorisation requis' },
        401,
        request
      );
    }

    const { searchParams } = new URL(request.url);
    const avisId = searchParams.get('id');

    if (!avisId) {
      return createCorsResponse(
        { error: 'ID de l\'avis requis' },
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

    const response = await fetch(`${supabaseUrl}/functions/v1/employee-avis/delete?id=${avisId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return createCorsResponse(
        { error: result.error || 'Erreur lors de la suppression de l\'avis' },
        response.status,
        request
      );
    }

    return createCorsResponse(result, 200, request);
  } catch (error) {
    console.error('❌ Erreur dans la route /api/avis/delete:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500,
      request
    );
  }
}
