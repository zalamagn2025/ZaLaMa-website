// app/api/partnership-requests/route.ts

import { createClient } from '@supabase/supabase-js';

// Fonction pour sauvegarder la demande de partenariat
async function savePartnershipRequest(partnershipData: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('partnership_requests')
    .insert(partnershipData)
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
    
    return Response.json({
      success: true,
      message: 'Demande soumise avec succès',
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