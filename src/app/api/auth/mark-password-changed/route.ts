import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔑 Marquage du changement de mot de passe...');
    
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
        { error: 'Vous devez être connecté pour effectuer cette action' },
        { status: 401 }
      );
    }

    console.log('🔍 Mise à jour du champ require_password_change pour:', user.email);

    // Mettre à jour le champ require_password_change à false
    const { data: updatedUser, error: updateError } = await supabase
      .from('admin_users')
      .update({ 
        require_password_change: false,
        updated_at: new Date().toISOString()
      })
      .eq('email', user.email)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut de mot de passe' },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      console.error('❌ Utilisateur non trouvé dans admin_users');
      return NextResponse.json(
        { error: 'Utilisateur non trouvé dans la base de données' },
        { status: 404 }
      );
    }

    console.log('✅ Statut de mot de passe mis à jour avec succès');

    return NextResponse.json(
      { 
        success: true,
        message: 'Statut de mot de passe mis à jour avec succès',
        requirePasswordChange: false
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('💥 Erreur lors du marquage du changement de mot de passe:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors du marquage du changement de mot de passe' },
      { status: 500 }
    );
  }
} 