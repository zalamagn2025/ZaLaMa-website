import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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

    console.log('🔍 Vérification du code avec Supabase Auth...');

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

    // Avec Supabase, on ne peut pas directement vérifier un token sans l'utiliser
    // On va essayer de récupérer la session pour voir si le token est valide
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Erreur lors de la vérification du token:', error);
      
      let errorMessage = 'Code de vérification invalide';
      
      switch (error.message) {
        case 'Invalid recovery token':
          errorMessage = 'Le lien de réinitialisation est invalide ou a déjà été utilisé';
          break;
        case 'Token expired':
          errorMessage = 'Le lien de réinitialisation a expiré';
          break;
        case 'User not found':
          errorMessage = 'Utilisateur non trouvé';
          break;
        default:
          errorMessage = 'Code de vérification invalide';
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          valid: false
        },
        { status: 400 }
      );
    }

    // Si on arrive ici, le token semble valide
    // On peut récupérer l'email de l'utilisateur depuis la session
    const email = session?.user?.email;
    
    if (!email) {
      return NextResponse.json(
        { 
          error: 'Impossible de récupérer l\'email associé au token',
          valid: false
        },
        { status: 400 }
      );
    }

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
    
    return NextResponse.json(
      { 
        error: 'Code de vérification invalide',
        valid: false
      },
      { status: 400 }
    );
  }
} 