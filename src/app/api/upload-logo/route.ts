import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    /*console.log('🚀 API Route: Début upload logo via edge function Supabase');*/
    /*console.log('📋 Headers de la requête:', Object.fromEntries(request.headers.entries()));*/
    /*console.log('📋 Content-Type:', request.headers.get('content-type'));*/

    // Récupérer le FormData de la requête
    const formData = await request.formData();
    /*console.log('📋 FormData reçu, clés disponibles:', Array.from(formData.keys()));*/

    // Vérifier que le logo est présent
    const logo = formData.get('logo') as File;
    const partnerId = formData.get('partner_id') as string;

    if (!logo) {
      return NextResponse.json({
        success: false,
        error: 'Aucun fichier logo fourni'
      }, { status: 400 });
    }

    if (!partnerId) {
      return NextResponse.json({
        success: false,
        error: 'ID partenaire manquant'
      }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(logo.type)) {
      return NextResponse.json({
        success: false,
        error: 'Type de fichier non supporté. Utilisez JPG, PNG ou WebP'
      }, { status: 400 });
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (logo.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'Fichier trop volumineux. Taille maximale: 5MB'
      }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = logo.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}_${logo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${partnerId}/${fileName}`;

    /*console.log('📁 Chemin généré:', filePath);*/

    // Upload vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('partner-logos')
      .upload(filePath, logo, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erreur upload Supabase:', uploadError);
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de l\'upload du fichier'
      }, { status: 500 });
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('partner-logos')
      .getPublicUrl(filePath);

    /*console.log('✅ Upload réussi:', {
      fileName: logo.name,
      filePath: filePath,
      publicUrl: urlData.publicUrl,
      size: logo.size,
      type: logo.type
    });*/

    return NextResponse.json({
      success: true,
      data: {
        fileName: logo.name,
        filePath: filePath,
        publicUrl: urlData.publicUrl,
        size: logo.size,
        type: logo.type
      }
    });

  } catch (error) {
    console.error('💥 Erreur API upload-logo:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}

