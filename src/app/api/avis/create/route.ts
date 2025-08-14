import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

// Gestion CORS pour les requêtes OPTIONS
export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/avis/create - Début de la requête');
    
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Token d\'authentification manquant');
      return createCorsResponse(
        { success: false, error: 'Token d\'authentification requis' },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('✅ Token d\'authentification récupéré');

    // Récupérer les données de la requête
    const body = await request.json();
    console.log('📋 Données reçues:', body);
    
    // Validation des données
    if (!body.note || body.note < 1 || body.note > 5) {
      console.log('❌ Note invalide:', body.note);
      return createCorsResponse(
        { success: false, error: 'La note doit être entre 1 et 5' },
        400
      );
    }

    if (!body.commentaire || body.commentaire.trim().length === 0) {
      console.log('❌ Commentaire vide');
      return createCorsResponse(
        { success: false, error: 'Le commentaire est requis' },
        400
      );
    }

    if (!body.type_retour || !['positif', 'negatif'].includes(body.type_retour)) {
      console.log('❌ Type de retour invalide:', body.type_retour);
      return createCorsResponse(
        { success: false, error: 'Le type de retour doit être "positif" ou "negatif"' },
        400
      );
    }

    console.log('✅ Validation des données OK');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL n\'est pas défini');
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    console.log('📝 Appel de l\'Edge Function employee-avis/create');
    console.log('🔧 URL Edge Function:', `${supabaseUrl}/functions/v1/employee-avis/create`);
    console.log('📤 Données envoyées:', { 
      note: body.note, 
      commentaire: body.commentaire, 
      type_retour: body.type_retour 
    });

    // Appeler l'Edge Function Supabase pour créer l'avis
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-avis/create`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note: body.note,
        commentaire: body.commentaire.trim(),
        type_retour: body.type_retour
      }),
    });

    console.log('📥 Réponse Edge Function - Status:', response.status);
    console.log('📥 Réponse Edge Function - Headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📥 Réponse Edge Function - Body:', result);
    
    if (!response.ok) {
      console.error('❌ Erreur Edge Function:', result);
      
      return createCorsResponse(
        { 
          success: false, 
          error: result.error || 'Erreur lors de la création de l\'avis',
          details: result.message 
        },
        response.status
      );
    }

    console.log('✅ Avis créé avec succès');
    
    // Retourner la réponse de l'Edge Function
    return createCorsResponse({
      success: true,
      data: result.data,
      limitInfo: result.limitInfo
    }, 201);

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la création de l\'avis:', error);
    
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
