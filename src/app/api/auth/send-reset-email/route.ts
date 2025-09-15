import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }


    // Vérifier si l'utilisateur existe (plus robuste)
    const { data: user, error: userError } = await supabase
      .from('employees')
      .select('id, email, prenom, nom')
      .ilike('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return NextResponse.json({
        message: 'Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.'
      });
    }

    // Générer un token sécurisé (UUID + timestamp pour unicité)
    const tokenId = crypto.randomUUID();
    const timestamp = Date.now().toString();
    const resetToken = `${tokenId}-${timestamp}`;
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Date d'expiration (1 heure)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Nettoyer les anciens tokens pour cet utilisateur
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('user_id', user.id);

    // Sauvegarder le nouveau token en base de données
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token_hash: resetTokenHash,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (tokenError) {
      console.error('❌ Erreur sauvegarde token:', tokenError);
      return NextResponse.json(
        { error: 'Erreur lors de la génération du lien de réinitialisation' },
        { status: 500 }
      );
    }

    // Construire le lien de réinitialisation avec le domaine de production
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zalamagn.com';
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    // Nom de l'utilisateur pour personnalisation (utiliser prenom et nom)
    const userName = user.prenom ? `${user.prenom} ${user.nom || ''}`.trim() : undefined;

    return NextResponse.json({
      message: 'Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.',
      success: true
    });

  } catch (error) {
    console.error('❌ Erreur API send-reset-email:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 