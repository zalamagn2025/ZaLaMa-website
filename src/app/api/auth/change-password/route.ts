import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔑 Demande de changement de mot de passe...');
    
    const body: ChangePasswordData = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation des données
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Ancien mot de passe et nouveau mot de passe requis' },
        { status: 400 }
      );
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit être différent de l\'ancien' },
        { status: 400 }
      );
    }

    console.log('🔍 Changement du mot de passe avec Supabase Auth...');

    // Créer le client Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PRIVATE_SUPABASE_URL!,
      process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY!,
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

    // Vérifier que l'utilisateur est connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Utilisateur non connecté:', userError);
      return NextResponse.json(
        { error: 'Vous devez être connecté pour changer votre mot de passe' },
        { status: 401 }
      );
    }

    // Vérifier l'ancien mot de passe en tentant une reconnexion
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      console.error('❌ Ancien mot de passe incorrect:', signInError);
      return NextResponse.json(
        { error: 'L\'ancien mot de passe est incorrect' },
        { status: 400 }
      );
    }

    // Changer le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('❌ Erreur Supabase lors du changement:', updateError);
      
      // Gestion des erreurs Supabase Auth spécifiques
      let errorMessage = 'Erreur lors du changement de mot de passe';
      
      switch (updateError.message) {
        case 'Password should be at least 6 characters':
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
          break;
        case 'Password is too weak':
          errorMessage = 'Le mot de passe est trop faible';
          break;
        case 'User not found':
          errorMessage = 'Utilisateur non trouvé';
          break;
        default:
          errorMessage = 'Erreur lors du changement de mot de passe';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
    
    console.log('✅ Mot de passe changé avec succès');

    return NextResponse.json(
      { 
        message: 'Mot de passe changé avec succès',
        success: true
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('💥 Erreur lors du changement de mot de passe:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    );
  }
} 