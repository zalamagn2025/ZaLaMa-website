import { auth } from '@/lib/firebase';
import { verifyPasswordResetCode } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

interface VerifyCodeData {
  oobCode: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Vérification du code de réinitialisation...');
    
    const body: VerifyCodeData = await request.json();
    const { oobCode } = body;

    // Validation des données
    if (!oobCode) {
      return NextResponse.json(
        { error: 'Code de vérification requis' },
        { status: 400 }
      );
    }

    console.log('🔍 Vérification du code avec Firebase Auth...');

    // Vérifier le code de réinitialisation via Firebase Auth
    const email = await verifyPasswordResetCode(auth, oobCode);
    
    console.log('✅ Code de réinitialisation valide pour:', email);

    return NextResponse.json(
      { 
        message: 'Code de réinitialisation valide',
        email: email,
        valid: true
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la vérification du code:', error);
    
    // Gestion des erreurs Firebase Auth spécifiques
    let errorMessage = 'Code de vérification invalide';
    
    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'Le lien de réinitialisation a expiré';
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
        default:
          errorMessage = 'Code de vérification invalide';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        valid: false
      },
      { status: 400 }
    );
  }
} 