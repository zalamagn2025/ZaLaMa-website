import { NextRequest, NextResponse } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    console.log('📸 Upload de photo de profil...');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsResponse(
        { success: false, error: 'Token d\'authentification requis' },
        401
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (!supabaseUrl) {
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    // Récupérer le fichier depuis la requête
    const formData = await request.formData();
    const photoFile = formData.get('photo') as File;
    
    if (!photoFile) {
      return createCorsResponse(
        { success: false, error: 'Fichier photo requis' },
        400
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(photoFile.type)) {
      return createCorsResponse(
        { success: false, error: 'Type de fichier non supporté. Utilisez JPEG, PNG ou WebP' },
        400
      );
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photoFile.size > maxSize) {
      return createCorsResponse(
        { success: false, error: 'Fichier trop volumineux. Taille maximale : 5MB' },
        400
      );
    }

    console.log('📤 Envoi vers l\'Edge Function...');
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/employee-auth/upload-photo`;
    
    // Créer un nouveau FormData pour l'Edge Function
    const newFormData = new FormData();
    newFormData.append('photo', photoFile);
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas inclure Content-Type pour FormData
      },
      body: newFormData,
    });

    const result = await response.json();
    
    console.log('📥 Réponse de l\'Edge Function:', {
      status: response.status,
      success: result.success,
      error: result.error,
      data: result.data ? 'Présent' : 'Absent'
    });
    
    if (!response.ok) {
      return createCorsResponse(
        { 
          success: false, 
          error: result.error || 'Erreur lors de l\'upload de la photo',
          details: result.message 
        },
        response.status
      );
    }

    return createCorsResponse({
      success: true,
      message: 'Photo uploadée avec succès',
      data: result.data || result
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de l\'upload de la photo:', error);
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
