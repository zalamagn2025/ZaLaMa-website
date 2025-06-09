import { auth } from '@/lib/firebase';
import { confirmPasswordReset } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface ResetPasswordData {
  oobCode: string;
  newPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔑 Demande de réinitialisation de mot de passe...');
    
    const body: ResetPasswordData = await request.json();
    const { oobCode, newPassword } = body;

    // Validation des données
    if (!oobCode || !newPassword) {
      return NextResponse.json(
        { error: 'Code et nouveau mot de passe requis' },
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

    console.log('🔍 Réinitialisation du mot de passe avec Firebase Auth...');

    // Confirmer la réinitialisation du mot de passe via Firebase Auth
    await confirmPasswordReset(auth, oobCode, newPassword);
    
    console.log('✅ Mot de passe réinitialisé avec succès');

    return NextResponse.json(
      { 
        message: 'Mot de passe réinitialisé avec succès',
        success: true
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la réinitialisation du mot de passe:', error);
    
    // Gestion des erreurs Firebase Auth spécifiques
    let errorMessage = 'Erreur interne du serveur';
    
    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'Le lien de réinitialisation a expiré. Demandez un nouveau lien';
          break;
        case 'auth/invalid-action-code':
          errorMessage = 'Le lien de réinitialisation est invalide ou a déjà été utilisé';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Utilisateur non trouvé';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible';
          break;
        default:
          errorMessage = 'Erreur lors de la réinitialisation du mot de passe';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
} 