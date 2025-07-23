import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { token, email, newPassword } = await request.json();

    // Validation des données
    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: 'Toutes les données sont requises' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    console.log('🔐 Tentative de réinitialisation pour:', email);

    // Vérifier si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from('employees')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return NextResponse.json(
        { error: 'Lien de réinitialisation invalide' },
        { status: 400 }
      );
    }

    // Hasher le token pour comparaison
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Vérifier le token en base de données
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('token_hash', tokenHash)
      .eq('used', false)
      .single();

    if (tokenError || !tokenData) {
      console.log('❌ Token invalide ou déjà utilisé pour:', email);
      return NextResponse.json(
        { error: 'Lien de réinitialisation invalide ou expiré' },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      console.log('❌ Token expiré pour:', email);
      
      // Nettoyer le token expiré
      await supabase
        .from('password_reset_tokens')
        .delete()
        .eq('id', tokenData.id);
      
      return NextResponse.json(
        { error: 'Le lien de réinitialisation a expiré' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe avec salt
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex');
    const finalPassword = `${salt}:${hashedPassword}`;

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase
      .from('employees')
      .update({ 
        password: finalPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Erreur mise à jour mot de passe:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du mot de passe' },
        { status: 500 }
      );
    }

    // Marquer le token comme utilisé
    const { error: markUsedError } = await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    if (markUsedError) {
      console.error('❌ Erreur marquage token utilisé:', markUsedError);
      // On continue même si ça échoue, le mot de passe a été changé
    }

    console.log('✅ Mot de passe réinitialisé avec succès pour:', email);

    // Log de sécurité
    console.log('🔒 Réinitialisation réussie:', {
      userId: user.id,
      email: email,
      tokenId: tokenData.id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'Mot de passe réinitialisé avec succès',
      success: true
    });

  } catch (error) {
    console.error('❌ Erreur API reset-password:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 