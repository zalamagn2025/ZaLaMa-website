import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialiser Resend pour l'envoi d'emails
const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || 'noreply@zalamagn.com';
const adminEmail = process.env.ADMIN_EMAIL;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

    console.log('🔐 Demande de réinitialisation pour:', email);

    // Vérifier si l'utilisateur existe (plus robuste)
    const { data: user, error: userError } = await supabase
      .from('employees')
      .select('id, email, prenom, nom')
      .ilike('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      console.log('📧 Email non trouvé ou erreur:', email);
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

    console.log('✅ Token de réinitialisation généré pour:', email);

    // Log de sécurité
    console.log('🔒 Token de réinitialisation généré:', {
      userId: user.id,
      email: email,
      expiresAt: expiresAt,
      tokenHash: resetTokenHash.substring(0, 10) + '...'
    });

    // Envoyer l'email si Resend est configuré
    if (!resendApiKey) {
      console.warn('⚠️ RESEND_API_KEY manquante: aucun email ne sera envoyé');
    }
    if (!process.env.EMAIL_FROM) {
      console.warn('⚠️ EMAIL_FROM manquant, utilisation de la valeur par défaut:', emailFrom);
    }
    if (resend) {
      try {
        const subject = 'Réinitialisation de votre mot de passe ZaLaMa';
        const html = `
          <div style="font-family: Arial, sans-serif; color: #0F172A;">
            <h2>Réinitialisation du mot de passe</h2>
            ${userName ? `<p>Bonjour ${userName},</p>` : ''}
            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe&nbsp;:</p>
            <p style="margin: 24px 0;">
              <a href="${resetLink}" style="background: #FF671E; color: white; padding: 10px 16px; text-decoration: none; border-radius: 6px; font-weight: 600;">Réinitialiser mon mot de passe</a>
            </p>
            <p>Ou copiez-collez ce lien dans votre navigateur&nbsp;:</p>
            <p style="word-break: break-all; color: #334155;">${resetLink}</p>
            <p style="font-size: 12px; color: #64748B;">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          </div>
        `;
        const text = `Réinitialisation du mot de passe\n\n${userName ? `Bonjour ${userName},\n\n` : ''}Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.\n\nLien: ${resetLink}\n\nCe lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`;

        const sendResult = await resend.emails.send({
          from: `ZaLaMa <${emailFrom}>`,
          to: email,
          bcc: adminEmail ? [adminEmail] : undefined,
          replyTo: adminEmail || undefined,
          subject,
          html,
          text,
          headers: {
            'X-Entity-Ref-ID': tokenId,
          },
        });

        console.log('📧 Email de réinitialisation envoyé via Resend:', {
          id: sendResult.data?.id,
          to: email,
          bcc: adminEmail || 'none',
        });
      } catch (sendError) {
        console.error('❌ Échec envoi email via Resend:', sendError);
        // On continue tout de même à répondre succès pour ne pas révéler d'info sensible
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY non configurée, aucun email envoyé. Lien de reset généré:', resetLink);
    }

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