import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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

    // Créer le client Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
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

    // Construire l'URL de réinitialisation
    const resetUrl = new URL(`/auth/reset-password`, request.nextUrl.origin);

    // Envoyer l'email de réinitialisation via Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl.toString(),
    });

    if (error) {
      console.error('❌ Erreur Supabase lors de l\'envoi de l\'email:', error);
      
      // Gestion des erreurs Supabase Auth spécifiques
      let errorMessage = 'Une erreur est survenue lors de l\'envoi de l\'email';
      
      switch (error.message) {
        case 'User not found':
          // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
          errorMessage = 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé';
          break;
        case 'Invalid email':
          errorMessage = 'Format d\'email invalide';
          break;
        case 'Too many requests':
          errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
          break;
        case 'User not found':
          // Pour des raisons de sécurité, on retourne toujours un message de succès
          return NextResponse.json(
            { 
              message: 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé',
              success: true
            },
            { status: 200 }
          );
        default:
          errorMessage = 'Une erreur est survenue lors de l\'envoi de l\'email';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
    
    console.log('✅ Email de réinitialisation envoyé avec succès');

    return NextResponse.json(
      { 
        message: 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé',
        success: true
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('💥 Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
} 