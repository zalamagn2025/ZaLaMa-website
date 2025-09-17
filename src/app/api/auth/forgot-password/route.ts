import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    /*console.log('🔐 Demande de réinitialisation pour:', email)*/

    // URL de redirection pour la réinitialisation
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;

    // Utiliser Supabase Auth pour envoyer l'email de réinitialisation
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('❌ Erreur Supabase Auth:', error);
      
      // Gestion des erreurs spécifiques
      let errorMessage = 'Une erreur est survenue lors de l\'envoi de l\'email';
      
      switch (error.message) {
        case 'User not found':
          // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
          /*console.log('📧 Utilisateur non trouvé:', email)*/
          return NextResponse.json({
            message: 'Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.'
          });
        case 'Invalid email':
          return NextResponse.json(
            { error: 'Format d\'email invalide' },
            { status: 400 }
          );
        case 'Too many requests':
          return NextResponse.json(
            { error: 'Trop de tentatives. Veuillez réessayer plus tard.' },
            { status: 429 }
          );
        default:
          errorMessage = 'Erreur lors de l\'envoi de l\'email de réinitialisation';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    /*console.log('✅ Email de réinitialisation envoyé avec succès pour:', email)*/

    // Log de sécurité
    /*console.log('🔒 Demande de réinitialisation traitée:', {
      email: email,
      redirectUrl: redirectUrl,
      timestamp: new Date()*/.toISOString()
    });

    return NextResponse.json({
      message: 'Si un compte est associé à cette adresse, un lien de réinitialisation vous a été envoyé.',
      success: true
    });

  } catch (error) {
    console.error('❌ Erreur API forgot-password:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 