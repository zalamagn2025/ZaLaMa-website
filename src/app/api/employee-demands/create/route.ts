import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Création d\'une nouvelle demande d\'avance...');
    
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

    // Récupérer les données de la demande
    const requestData = await request.json();
    
    console.log('📋 Données de la demande:', requestData);
    
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-demands/create`;
    
    console.log('🔍 Appel Edge Function employee-demands/create...');
    console.log('📍 URL:', edgeFunctionUrl);
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey || '',
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    
    console.log('📋 Réponse Edge Function employee-demands/create:', response.status, result);
    
    if (!response.ok) {
      console.error('❌ Erreur Edge Function employee-demands/create:', response.status, result);
      return createCorsResponse(
        { 
          error: result.error || 'Erreur lors de la création de la demande',
          details: result.message || result.details,
          status: response.status
        },
        response.status
      );
    }

    console.log('✅ Demande créée avec succès');
    return createCorsResponse(result);

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la création de la demande:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500
    );
  }
}

