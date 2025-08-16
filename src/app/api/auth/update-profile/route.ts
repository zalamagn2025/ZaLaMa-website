import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { handleOptions, createCorsResponse } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 Mise à jour du profil utilisateur...');
    
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

    // Récupérer la session utilisateur
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erreur de session:', sessionError);
      return createCorsResponse(
        { error: 'Erreur de session', details: sessionError.message },
        401,
        request
      );
    }
    
    if (!session) {
      console.log('❌ Aucune session trouvée');
      return createCorsResponse(
        { error: 'Non authentifié' },
        401,
        request
      );
    }

    const body = await request.json();
    const { displayName, photoURL, ...otherFields } = body;

    console.log('📝 Données à mettre à jour:', { displayName, photoURL, ...otherFields });

    // Mettre à jour les métadonnées utilisateur dans Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: displayName,
        avatar_url: photoURL,
        ...otherFields
      }
    });

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour des métadonnées:', updateError);
      return createCorsResponse(
        { error: 'Erreur lors de la mise à jour du profil', details: updateError.message },
        500,
        request
      );
    }

    // Essayer de mettre à jour dans la table users (responsables/RH)
    console.log('🔍 Mise à jour dans la table users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({
        nom_complet: displayName,
        photo_url: photoURL,
        ...otherFields
      })
      .eq('email', session.user.email)
      .select()
      .maybeSingle();

    if (userError) {
      console.log('❌ Erreur lors de la mise à jour dans users:', userError.message);
    } else if (userData) {
      console.log('✅ Profil mis à jour dans la table users');
      return createCorsResponse(
        { 
          message: 'Profil mis à jour avec succès',
          user: {
            uid: session.user.id,
            email: session.user.email,
            displayName,
            photoURL,
            ...userData
          }
        },
        200,
        request
      );
    }

    // Si pas dans users, essayer dans employees
    console.log('🔍 Mise à jour dans la table employees...');
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .update({
        nom_complet: displayName,
        photo_url: photoURL,
        ...otherFields
      })
      .eq('user_id', session.user.id)
      .select()
      .maybeSingle();

    if (employeeError) {
      console.log('❌ Erreur lors de la mise à jour dans employees:', employeeError.message);
    } else if (employeeData) {
      console.log('✅ Profil mis à jour dans la table employees');
      return createCorsResponse(
        { 
          message: 'Profil mis à jour avec succès',
          user: {
            uid: session.user.id,
            email: session.user.email,
            displayName,
            photoURL,
            ...employeeData
          }
        },
        200,
        request
      );
    }

    // Si aucune mise à jour n'a été effectuée dans les tables
    console.log('⚠️ Aucune mise à jour effectuée dans les tables, mais métadonnées mises à jour');
    return createCorsResponse(
      { 
        message: 'Métadonnées mises à jour avec succès',
        user: {
          uid: session.user.id,
          email: session.user.email,
          displayName,
          photoURL
        }
      },
      200,
      request
    );

  } catch (error) {
    console.error('💥 Erreur dans /api/auth/update-profile:', error);
    return createCorsResponse(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      500,
      request
    );
  }
}
