import { NextRequest, NextResponse } from 'next/server';


// URL de l'Edge Function Supabase
const SUPABASE_EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/partnership-request';

// Fonction pour tester la connectivité à l'Edge Function
async function testEdgeFunctionConnectivity() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes pour le test
    
    const response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
      method: 'OPTIONS',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('❌ Test de connectivité échoué:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {    
    // Test de connectivité à l'Edge Function
    const isConnected = await testEdgeFunctionConnectivity();
    if (!isConnected) {
      console.error('❌ Edge Function non accessible');
      return NextResponse.json({
        success: false,
        error: 'Service temporairement indisponible',
        details: ['L\'Edge Function n\'est pas accessible actuellement'],
        debug: 'Edge Function connectivity test failed'
      }, { status: 503 });
    }
    
    // Récupérer les données du body
    const body = await request.json();

    // Validation basique côté serveur - plus flexible
    const requiredFields = [
      'company_name', 'legal_status', 'rccm', 'nif', 'activity_domain',
      'headquarters_address', 'phone', 'email', 'employees_count', 'payroll',
      'cdi_count', 'cdd_count', 'payment_date', 'rep_full_name', 'rep_position',
      'rep_email', 'rep_phone', 'hr_full_name', 'hr_email', 'hr_phone', 'agreement'
    ];

    // Vérifier les champs manquants ou vides
    const missingFields = requiredFields.filter(field => {
      const value = body[field];
      return value === undefined || value === null || value === '' || 
             (typeof value === 'string' && value.trim() === '') ||
             (typeof value === 'number' && isNaN(value));
    });

    if (missingFields.length > 0) {
        requiredFields.map(field => [field, body[field]])
      return NextResponse.json({
        success: false,
        error: 'Données invalides',
        details: missingFields.map(field => `Champ ${field} requis`)
      }, { status: 400 });
    }

    // Validation spécifique pour payment_day (optionnel)
    if (body.payment_day !== undefined && body.payment_day !== null) {
      const paymentDay = typeof body.payment_day === 'number' ? body.payment_day : parseInt(body.payment_day);
      if (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31) {
        return NextResponse.json({
          success: false,
          error: 'Données invalides',
          details: ['Date de paiement doit être un jour valide (1-31)']
        }, { status: 400 });
      }
      // S'assurer que payment_day est un number dans le body
      body.payment_day = paymentDay;
    }

    // Préparation des données pour l'Edge Function (format exact des tests)
    const edgeFunctionData = {
      company_name: body.company_name,
      legal_status: body.legal_status,
      rccm: body.rccm,
      nif: body.nif,
      activity_domain: body.activity_domain,
      headquarters_address: body.headquarters_address,
      phone: body.phone,
      email: body.email,
      employees_count: parseInt(body.employees_count),
      payroll: body.payroll,
      cdi_count: parseInt(body.cdi_count),
      cdd_count: parseInt(body.cdd_count),
      payment_day: body.payment_day ? parseInt(body.payment_day) : null,
      rep_full_name: body.rep_full_name,
      rep_position: body.rep_position,
      rep_email: body.rep_email,
      rep_phone: body.rep_phone,
      hr_full_name: body.hr_full_name,
      hr_email: body.hr_email,
      hr_phone: body.hr_phone,
      agreement: body.agreement
    };

    
    // Configuration avec timeout plus long et meilleure gestion d'erreur
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes

    let response;
    try {
      response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(edgeFunctionData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('❌ Erreur de connexion avec l\'Edge Function:', fetchError);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: 'Timeout de connexion',
          details: ['L\'Edge Function n\'a pas répondu dans les 30 secondes'],
          debug: 'Connection timeout'
        }, { status: 408 });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Erreur de connexion',
        details: ['Impossible de joindre l\'Edge Function'],
        debug: fetchError instanceof Error ? fetchError.message : 'Erreur inconnue'
      }, { status: 503 });
    }

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Erreur lors de la soumission',
        details: result.details || []
      }, { status: response.status });
    }
    
    return NextResponse.json(result);

     } catch (error) {
     console.error('❌ Erreur dans l\'API route:', error);
     return NextResponse.json({
       success: false,
       error: 'Erreur interne du serveur',
       details: ['Erreur de connexion avec l\'Edge Function'],
       debug: error instanceof Error ? error.message : 'Erreur inconnue'
     }, { status: 500 });
   }
}

// Gérer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Méthode non autorisée',
    details: ['Seule la méthode POST est autorisée']
  }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({
    success: false,
    error: 'Méthode non autorisée',
    details: ['Seule la méthode POST est autorisée']
  }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({
    success: false,
    error: 'Méthode non autorisée',
    details: ['Seule la méthode POST est autorisée']
  }, { status: 405 });
}
