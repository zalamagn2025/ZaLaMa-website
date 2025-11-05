import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Variables d\'environnement Supabase manquantes');
      return NextResponse.json({
        success: false,
        error: 'Configuration Supabase manquante'
      }, { status: 500 });
    }

    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/employee-auth/register`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, // Utiliser la clé de rôle de service
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    // L'Edge Function s'occupe déjà de l'envoi des notifications
    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error('❌ Erreur lors de l\'appel de l\'Edge Function d\'inscription:', error);
    return NextResponse.json({
      success: false,
      error: `Erreur interne du serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    }, { status: 500 });
  }
}
