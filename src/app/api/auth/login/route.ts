import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

interface LoginData {
  email: string;
  password: string;
}

// Gestion CORS pour les requêtes OPTIONS
export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Tentative de connexion via Edge Function Supabase...');
    
    const body: LoginData = await request.json();
    const { email, password } = body;

    // Validation des données
    if (!email || !password) {
      return createCorsResponse(
        { success: false, error: 'Email et mot de passe requis' },
        400
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL n\'est pas défini');
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    console.log('🔍 Authentification via Edge Function pour:', email);
    console.log('🔧 URL Edge Function:', `${supabaseUrl}/functions/v1/employee-auth/login`);
    console.log('📤 Données envoyées:', { email, password: '***' });

    // Appeler l'Edge Function Supabase pour l'authentification
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/login`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📥 Réponse Edge Function - Status:', response.status);
    console.log('📥 Réponse Edge Function - Headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📥 Réponse Edge Function - Body:', result);
    
    if (!response.ok) {
      console.error('❌ Erreur d\'authentification Edge Function:', result);
      
      return createCorsResponse(
        { 
          success: false, 
          error: result.error || 'Identifiants invalides',
          details: result.message 
        },
        response.status
      );
    }

    console.log('✅ Authentification réussie via Edge Function');
    
    // Retourner la réponse de l'Edge Function
    return createCorsResponse({
      success: true,
      message: 'Connexion réussie',
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      employee: result.employee
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la connexion:', error);
    
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
