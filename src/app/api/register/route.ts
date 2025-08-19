import { NextRequest, NextResponse } from 'next/server';
import { employeeNotificationService } from '@/services/employeeNotificationService';

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 Appel de l\'Edge Function employee-auth/register...');

    const body = await request.json();
    console.log('📋 Données reçues pour inscription:', JSON.stringify(body, null, 2));

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

    console.log('📡 Réponse Edge Function (inscription):', response.status, response.statusText);
    const result = await response.json();
    console.log('📋 Résultat inscription:', result);

    // Si l'inscription est réussie, envoyer les notifications
    if (result.success && result.employee_id) {
      console.log('✅ Inscription réussie, envoi des notifications...');
      
      try {
        // Préparer les données pour les notifications
        const notificationData = {
          nom: body.nom,
          prenom: body.prenom,
          email: body.email,
          telephone: body.telephone,
          poste: body.poste,
          type_contrat: body.type_contrat,
          salaire_net: body.salaire_net,
          date_embauche: body.date_embauche,
          company_name: body.company_name || 'Entreprise partenaire'
        };

        // Envoyer les notifications (email + SMS)
        const notificationResult = await employeeNotificationService.sendRegistrationNotifications(notificationData);
        
        console.log('📧📱 Résultat des notifications:', {
          success: notificationResult.success,
          emailSuccess: notificationResult.email?.success,
          smsSuccess: notificationResult.sms?.success,
          errors: notificationResult.errors
        });

        // Ajouter les informations de notification au résultat
        result.notifications = {
          sent: notificationResult.success,
          email: notificationResult.email,
          sms: notificationResult.sms,
          errors: notificationResult.errors
        };

      } catch (notificationError) {
        console.error('❌ Erreur lors de l\'envoi des notifications:', notificationError);
        
        // L'inscription a réussi, mais les notifications ont échoué
        // On ne fait pas échouer l'inscription pour autant
        result.notifications = {
          sent: false,
          error: notificationError instanceof Error ? notificationError.message : 'Erreur inconnue'
        };
      }
    }

    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error('❌ Erreur lors de l\'appel de l\'Edge Function d\'inscription:', error);
    return NextResponse.json({
      success: false,
      error: `Erreur interne du serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    }, { status: 500 });
  }
}
