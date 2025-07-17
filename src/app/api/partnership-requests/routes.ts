// app/api/partnership-requests/route.ts
import { smsService } from '../../../../services/smsServices';
import { createClient } from '@supabase/supabase-js';

// Fonction pour sauvegarder la demande de partenariat
async function savePartnershipRequest(partnershipData: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('partnership_requests')
    .insert({
      nom_partenaire: partnershipData.nom_partenaire,
      telephone_representant: partnershipData.telephone_representant,
      email_representant: partnershipData.email_representant,
      secteur_activite: partnershipData.secteur_activite,
      nombre_employes: partnershipData.nombre_employes,
      motivation_letter_url: partnershipData.motivation_letter_url,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la sauvegarde: ${error.message}`);
  }

  return data;
}

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