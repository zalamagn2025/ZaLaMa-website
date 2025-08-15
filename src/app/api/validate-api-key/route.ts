import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Validation de la clé API...');

    // Parser le body de la requête
    const body = await request.json();
    const { api_key } = body;
    
    console.log('📋 Clé API reçue:', api_key ? '***' + api_key.slice(-4) : 'manquant');

    // Vérifier que les variables d'environnement Supabase sont configurées
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Variables d\'environnement Supabase manquantes:', {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      return NextResponse.json({
        success: false,
        error: 'Configuration Supabase manquante'
      }, { status: 500 });
    }

    // Validation directe de la clé API via Supabase
    console.log('🔗 Validation directe de la clé API...');
    
    // Créer le client Supabase avec service role
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Vérifier si la clé API existe dans la table partners
    const { data: partners, error } = await supabase
      .from('partners')
      .select('id, company_name, api_key')
      .eq('api_key', api_key)
      .single();
    
    if (error || !partners) {
      console.log('❌ Clé API invalide:', error?.message || 'Partenaire non trouvé');
      return NextResponse.json({
        success: false,
        error: 'Code entreprise invalide ou inexistant'
      }, { status: 400 });
    }
    
    console.log('✅ Clé API valide pour:', partners.company_name);
    return NextResponse.json({
      success: true,
      partner_name: partners.company_name,
      message: 'Code entreprise validé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la validation de la clé API:', error);
    return NextResponse.json({
      success: false,
      error: `Erreur lors de la validation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    }, { status: 500 });
  }
}
