import { NextRequest, NextResponse } from 'next/server';
import { handleOptions, createCorsResponse } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_key } = body;

    if (!api_key || api_key.trim() === '') {
      return createCorsResponse(
        { 
          success: false, 
          error: 'Clé API requise',
          message: 'Veuillez fournir une clé API valide'
        },
        400,
        request
      );
    }

    console.log('🔑 Vérification de la clé API via Edge Function...');
    console.log('📍 URL:', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/employee-auth/verify-api-key`);

    // Appeler l'Edge Function Supabase pour vérifier la clé API
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      return createCorsResponse(
        { 
          success: false, 
          error: 'Configuration Supabase manquante',
          message: 'Erreur de configuration serveur'
        },
        500,
        request
      );
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth/verify-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey || '',
        'Authorization': `Bearer ${supabaseAnonKey || ''}`,
      },
      body: JSON.stringify({ api_key: api_key.trim() }),
    });

    const result = await response.json();
    
    console.log('📋 Réponse Edge Function:', response.status, result);

    if (!response.ok) {
      console.error('❌ Erreur Edge Function:', response.status, result);
      return createCorsResponse(
        { 
          success: false,
          error: result.error || 'Erreur de vérification de la clé API',
          message: result.message || 'Clé API invalide ou entreprise non trouvée',
          details: result.details,
          status: response.status
        },
        response.status,
        request
      );
    }

    console.log('✅ Clé API vérifiée avec succès');
    
    // Retourner les informations de l'entreprise
    return createCorsResponse({
      success: true,
      message: 'Clé API valide',
      data: {
        partner: result.partner || result.data?.partner,
        company_name: result.company_name || result.data?.company_name,
        logo_url: result.logo_url || result.data?.logo_url,
        partner_id: result.partner_id || result.data?.partner_id,
        is_active: result.is_active || result.data?.is_active
      }
    }, 200, request);

  } catch (error) {
    console.error('❌ Erreur dans la route /api/validate-api-key:', error);
    return createCorsResponse(
      { 
        success: false, 
        error: 'Erreur interne du serveur',
        message: 'Une erreur est survenue lors de la vérification de la clé API'
      },
      500,
      request
    );
  }
}
