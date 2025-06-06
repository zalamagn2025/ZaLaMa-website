import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface ForgotPasswordData {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Demande de réinitialisation de mot de passe...');
    
    const body: ForgotPasswordData = await request.json();
    const { email } = body;

    // Validation des données
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    console.log('🔍 Envoi d\'email de réinitialisation pour:', email);

    // Envoyer l'email de réinitialisation via Firebase Auth
    await sendPasswordResetEmail(auth, email, {
      url: `http://localhost:3000/auth/reset-password`,
      handleCodeInApp: false,
    });
    
    console.log('✅ Email de réinitialisation envoyé avec succès');

    return NextResponse.json(
      { 
        message: 'Email de réinitialisation envoyé avec succès',
        success: true
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('💥 Erreur lors de l\'envoi de l\'email de réinitialisation:', {
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      code: error instanceof FirebaseError ? error.code : 'N/A',
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    
    // Gestion des erreurs Firebase Auth spécifiques
    let errorMessage = 'Erreur interne du serveur';
    
    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'auth/user-not-found':
          // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
          errorMessage = 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format d\'email invalide';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé';
          break;
        default:
          errorMessage = 'Une erreur est survenue lors de l\'envoi de l\'email';
      }
    }
    
    // Pour des raisons de sécurité, on retourne toujours un message de succès
    // même si l'email n'existe pas
    if (error instanceof FirebaseError && error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { 
          message: 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé',
          success: true
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 