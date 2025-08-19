import { NextRequest } from 'next/server';
import { handleOptions, createCorsResponse } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Test des variables d\'environnement côté serveur...');
    
         // Vérifier les variables d'environnement
     const envVars = {
       NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
       NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
       SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
       // Vérifier si les variables sont définies
       hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
       hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
       hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
       // Vérifier la longueur des clés
       urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
       anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
       serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
     };
    
    console.log('📊 Variables d\'environnement côté serveur:', envVars);
    
    // Test de création du client Supabase
    let supabaseTest = 'non testé';
    try {
      const { createServerClient } = await import('@supabase/ssr');
      const { cookies } = await import('next/headers');
      
      const cookieStore = await cookies();
             const supabase = createServerClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL!,
         process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
      
      supabaseTest = 'client créé avec succès';
      console.log('✅ Client Supabase créé avec succès');
      
    } catch (error) {
      supabaseTest = `erreur: ${error.message}`;
      console.error('❌ Erreur création client Supabase:', error);
    }
    
    return createCorsResponse({
      success: true,
      message: 'Variables d\'environnement côté serveur',
      envVars: envVars,
      supabaseTest: supabaseTest,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Erreur dans la route test-env-vars:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500
    );
  }
}
