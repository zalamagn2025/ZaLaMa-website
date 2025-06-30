import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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

    console.log('🔍 Réinitialisation du mot de passe avec Supabase Auth...');

    // Créer le client Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Confirmer la réinitialisation du mot de passe via Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('❌ Erreur Supabase lors de la réinitialisation:', error);
      
      // Gestion des erreurs Supabase Auth spécifiques
      let errorMessage = 'Erreur lors de la réinitialisation du mot de passe';
      
      switch (error.message) {
        case 'Password should be at least 6 characters':
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
          break;
        case 'Invalid recovery token':
          errorMessage = 'Le lien de réinitialisation est invalide ou a déjà été utilisé';
          break;
        case 'Token expired':
          errorMessage = 'Le lien de réinitialisation a expiré. Demandez un nouveau lien';
          break;
        case 'User not found':
          errorMessage = 'Utilisateur non trouvé';
          break;
        case 'Password is too weak':
          errorMessage = 'Le mot de passe est trop faible';
          break;
        default:
          errorMessage = 'Erreur lors de la réinitialisation du mot de passe';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
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
    
    return NextResponse.json(
      { error: 'Erreur lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
} 