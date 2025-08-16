import { NextRequest } from 'next/server';
import { createCorsResponse, handleOptions } from '@/lib/cors';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Vérification de la première connexion...');
    
    const authHeader = request.headers.get('authorization');
    let employeeId: string | null = null;
    
    // Vérifier l'authentification via token Bearer (pour les employés)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      
      // Valider le token en appelant l'Edge Function
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl) {
          return createCorsResponse(
            { error: 'Configuration serveur manquante' },
            500
          );
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth/getme`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey || '',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            employeeId = result.data.id;
          }
        }
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error);
      }
    }
    
    // Si pas de token valide, essayer l'authentification Supabase classique
    if (!employeeId) {
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
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        return createCorsResponse(
          { error: 'Non authentifié' },
          401
        );
      }
      
      // Récupérer l'ID de l'employé pour cet utilisateur
      const { data: employeData, error: employeError } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('actif', true)
        .single();

      if (employeError || !employeData) {
        return createCorsResponse(
          { error: 'Données employé introuvables' },
          404
        );
      }
      
      employeeId = employeData.id;
    }

    // Maintenant vérifier si c'est la première connexion en utilisant admin_users
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

    // Récupérer l'email de l'employé pour chercher dans admin_users
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('email')
      .eq('id', employeeId)
      .single();

    if (employeeError) {
      console.error('❌ Erreur lors de la récupération des données employé:', employeeError);
      return createCorsResponse(
        { error: 'Erreur lors de la récupération des données employé' },
        500
      );
    }

    // Vérifier dans admin_users si le changement de mot de passe est requis
    const { data: adminUserData, error: adminUserError } = await supabase
      .from('admin_users')
      .select('require_password_change')
      .eq('email', employeeData.email)
      .single();

    if (adminUserError) {
      console.error('❌ Erreur lors de la récupération des données admin_users:', adminUserError);
      // Si l'utilisateur n'existe pas dans admin_users, considérer qu'il n'a pas besoin de changer son mot de passe
      return createCorsResponse({
        success: true,
        requirePasswordChange: false,
        message: 'Vérification terminée',
        isFirstLogin: false
      });
    }

    const requirePasswordChange = adminUserData.require_password_change || false;
    const isFirstLogin = requirePasswordChange;
    
    console.log('✅ Vérification de première connexion terminée');
    console.log('📊 Résultats:', {
      employeeId,
      employeeEmail: employeeData.email,
      isFirstLogin,
      requirePasswordChange
    });
    
    return createCorsResponse({
      success: true,
      requirePasswordChange,
      message: isFirstLogin ? 'Première connexion détectée' : 'Vérification terminée',
      isFirstLogin
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la vérification de la première connexion:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500
    );
  }
} 