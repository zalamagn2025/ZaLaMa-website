// app/api/partnership-requests/route.ts
import { smsService } from '@/services/smsService';

export async function POST(request: Request) {
  try {
    const partnershipData = await request.json();
    
    // 1. Sauvegarder la demande en base
    const savedRequest = await savePartnershipRequest(partnershipData);
    
    // 2. Envoyer les SMS
    const smsResult = await smsService.sendPartnershipNotification({
      partnerName: partnershipData.nom_partenaire,
      submissionDate: new Date().toLocaleDateString('fr-FR'),
      requestId: savedRequest.id,
      representativePhone: partnershipData.telephone_representant
    });

    // 3. Gérer les erreurs SMS
    if (!smsResult.success) {
      console.error('Erreurs SMS:', smsResult.errors);
      // Optionnel : notifier l'admin par email
    }

    return Response.json({
      success: true,
      message: 'Demande soumise avec succès',
      smsSent: smsResult.success,
      requestId: savedRequest.id
    });

  } catch (error) {
    console.error('Erreur soumission partenariat:', error);
    return Response.json(
      { success: false, error: 'Erreur lors de la soumission' },
      { status: 500 }
    );
  }
}