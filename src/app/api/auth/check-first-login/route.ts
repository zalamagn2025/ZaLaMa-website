import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Vérification de la première connexion...');
    
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

    // Vérifier que l'utilisateur est connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Utilisateur non connecté:', userError);
      return NextResponse.json(
        { error: 'Vous devez être connecté pour accéder à cette ressource' },
        { status: 401 }
      );
    }

    console.log('🔍 Vérification du champ require_password_change pour:', user.email);

    // Vérifier le champ require_password_change dans la table admin_users
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('require_password_change')
      .eq('email', user.email)
      .single();

    if (adminError) {
      console.error('❌ Erreur lors de la récupération des données admin:', adminError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification du statut de première connexion' },
        { status: 500 }
      );
    }

    if (!adminUser) {
      console.log('⚠️ Utilisateur non trouvé dans admin_users, considéré comme première connexion');
      return NextResponse.json(
        { 
          requirePasswordChange: true,
          message: 'Première connexion détectée'
        },
        { status: 200 }
      );
    }

    console.log('✅ Statut de première connexion récupéré:', adminUser.require_password_change);

    return NextResponse.json(
      { 
        requirePasswordChange: adminUser.require_password_change || false,
        message: adminUser.require_password_change ? 'Changement de mot de passe requis' : 'Connexion normale'
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la vérification de la première connexion:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de la première connexion' },
      { status: 500 }
    );
  }
} 