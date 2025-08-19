import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/emailService';

// URL de l'Edge Function Supabase
const SUPABASE_EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/partnership-request';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Démarrage de l\'API route partnership-request');
    
    // Récupérer les données du body
    const body = await request.json();
    console.log('📄 Body reçu:', body);

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
      console.log('❌ Champs manquants ou vides:', missingFields);
      console.log('📊 Valeurs reçues:', Object.fromEntries(
        requiredFields.map(field => [field, body[field]])
      ));
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
        console.log('❌ payment_day invalide:', body.payment_day);
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

    // Appel vers l'Edge Function Supabase
    console.log('📤 Envoi vers l\'Edge Function...');
    console.log('🔍 Détail payment_day avant envoi:', {
      value: edgeFunctionData.payment_day,
      type: typeof edgeFunctionData.payment_day,
      parsed: edgeFunctionData.payment_day
    });
    console.log('📄 Body complet envoyé à l\'Edge Function:', edgeFunctionData);
    
    const response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(edgeFunctionData),
    });

    const result = await response.json();
    console.log('📥 Réponse de l\'Edge Function:', result);

    if (!response.ok) {
      console.log('❌ Erreur de l\'Edge Function:', result);
      return NextResponse.json({
        success: false,
        error: result.error || 'Erreur lors de la soumission',
        details: result.details || []
      }, { status: response.status });
    }

    console.log('✅ Demande de partenariat traitée avec succès');
    
    // Envoi des emails de notification (non-bloquant)
    console.log('📧 Envoi des emails de notification...');
    try {
      const emailResult = await emailService.sendPartnershipEmails(result.data || edgeFunctionData);
      console.log('📧 Résultat envoi emails:', emailResult);
      
      // Ajouter les informations d'email à la réponse
      return NextResponse.json({
        ...result,
        emailStatus: emailResult.overallSuccess ? 'Envoyés' : 'Partiellement envoyés',
        emailDetails: emailResult
      });
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi des emails:', emailError);
      return NextResponse.json({
        ...result,
        emailStatus: 'Erreur',
        emailError: emailError.message
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans l\'API route:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur',
      details: ['Erreur de connexion avec l\'Edge Function']
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
