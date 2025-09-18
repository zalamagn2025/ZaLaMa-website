import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    /*console.log('🔍 Vérification du token de réinitialisation...')*/
    
    const { token, email } = await request.json();

    // Validation des données
    if (!token || !email) {
      /*console.log('❌ Token ou email manquant')*/
      return NextResponse.json(
        { error: 'Token et email requis', valid: false },
        { status: 400 }
      );
    }

    /*console.log('🔍 Vérification du token pour:', email)*/

    // Vérifier si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from('employees')
      .select('id, email')
      .ilike('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      /*console.log('❌ Utilisateur non trouvé:', email)*/
      return NextResponse.json(
        { error: 'Lien de réinitialisation invalide', valid: false },
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
      /*console.log('❌ Token invalide ou déjà utilisé pour:', email)*/
      return NextResponse.json(
        { error: 'Lien de réinitialisation invalide ou expiré', valid: false },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      /*console.log('❌ Token expiré pour:', email)*/
      
      // Nettoyer le token expiré
      await supabase
        .from('password_reset_tokens')
        .delete()
        .eq('id', tokenData.id);
      
      return NextResponse.json(
        { error: 'Le lien de réinitialisation a expiré', valid: false },
        { status: 400 }
      );
    }

    /*console.log('✅ Token de réinitialisation valide pour:', email)*/

    return NextResponse.json({
      message: 'Token de réinitialisation valide',
      valid: true,
      email: email
    });

  } catch (error) {
    console.error('❌ Erreur API verify-reset-code:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur', valid: false },
      { status: 500 }
    );
  }
} 