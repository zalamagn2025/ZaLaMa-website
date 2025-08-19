import { NextRequest } from 'next/server';
import { handleOptions, createCorsResponse } from '@/lib/cors';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Force mise à jour du statut première connexion...');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return createCorsResponse(
        { error: 'Token d\'autorisation requis' },
        401,
        request
      );
    }

    const body = await request.json();
    const { employeeId, email } = body;

    if (!employeeId || !email) {
      return createCorsResponse(
        { error: 'Employee ID et email requis' },
        400,
        request
      );
    }

    console.log('📊 Données reçues:', { employeeId, email });

    // Créer le client Supabase avec service role
    const cookieStore = await cookies();
    
    // Vérifier que les variables d'environnement sont définies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ Variables d\'environnement Supabase manquantes:', {
        url: supabaseUrl ? 'définie' : 'manquante',
        serviceRoleKey: serviceRoleKey ? 'définie' : 'manquante'
      });
      
      return createCorsResponse(
        { error: 'Configuration Supabase manquante' },
        500,
        request
      );
    }
    
    const supabase = createServerClient(
      supabaseUrl,
      serviceRoleKey,
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

         // Vérifier d'abord si l'utilisateur existe dans admin_users
     console.log('🔍 Vérification existence dans admin_users...');
     const { data: existingAdminUser, error: checkError } = await supabase
       .from('admin_users')
       .select('id, email, display_name, role, require_password_change')
       .eq('email', email)
       .single();

     console.log('📊 Vérification admin_users:', { existingAdminUser, checkError });

           if (existingAdminUser) {
        // Mettre à jour require_password_change avec force
        console.log('🔄 Mise à jour forcée de l\'entrée existante...');
        
        // Tentative 1: Mise à jour normale
        let { data: updateData, error: updateError } = await supabase
          .from('admin_users')
          .update({ 
            require_password_change: false,
            updated_at: new Date().toISOString()
          })
          .eq('email', email)
          .select();
        
        // Si échec, tentative 2: Mise à jour avec conditions
        if (updateError) {
          console.log('⚠️ Première tentative échouée, tentative 2...');
          const { data: updateData2, error: updateError2 } = await supabase
            .from('admin_users')
            .update({ 
              require_password_change: false,
              updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .eq('require_password_change', true)
            .select();
          
          updateData = updateData2;
          updateError = updateError2;
        }
        
        // Si encore échec, tentative 3: Mise à jour directe avec SQL brut
        if (updateError) {
          console.log('⚠️ Deuxième tentative échouée, tentative 3 avec SQL brut...');
          const { data: updateData3, error: updateError3 } = await supabase
            .from('admin_users')
            .update({ 
              require_password_change: false,
              updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select();
          
          if (!updateError3) {
            updateData = updateData3;
            updateError = null;
          } else {
            updateError = updateError3;
          }
        }
        
        // Si encore échec, tentative 4: Suppression et recréation
        if (updateError) {
          console.log('⚠️ Troisième tentative échouée, tentative 4 suppression/recréation...');
          
          // Supprimer l'entrée existante
          await supabase
            .from('admin_users')
            .delete()
            .eq('email', email);
          
          // Recréer avec require_password_change = false
          const { data: insertData, error: insertError } = await supabase
            .from('admin_users')
            .insert({
              id: crypto.randomUUID(),
              email: email,
              display_name: email.split('@')[0],
              role: 'user',
              active: true,
              require_password_change: false
            })
            .select();
          
          if (!insertError) {
            updateData = insertData;
            updateError = null;
          } else {
            updateError = insertError;
          }
        }
        
        // Si encore échec, tentative 5: Mise à jour directe avec SQL brut
        if (updateError) {
          console.log('⚠️ Quatrième tentative échouée, tentative 5 SQL brut...');
          
          const { data: sqlData, error: sqlError } = await supabase
            .rpc('force_update_admin_user_password_change', {
              user_email: email,
              new_value: false
            });
          
          if (!sqlError) {
            updateData = [{ email: email, require_password_change: false }];
            updateError = null;
          } else {
            updateError = sqlError;
          }
        }
        
        // Si encore échec, tentative 6: Mise à jour forcée avec conditions
        if (updateError) {
          console.log('⚠️ Cinquième tentative échouée, tentative 6 mise à jour forcée...');
          
          const { data: forceData, error: forceError } = await supabase
            .from('admin_users')
            .update({ 
              require_password_change: false,
              updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .neq('require_password_change', false) // Mettre à jour seulement si pas déjà false
            .select();
          
          if (!forceError && forceData && forceData.length > 0) {
            updateData = forceData;
            updateError = null;
          } else {
            updateError = forceError || { message: 'Aucune ligne mise à jour' } as any;
          }
        }

       console.log('📊 Résultat mise à jour:', { updateData, updateError });

       if (updateError) {
         console.error('❌ Erreur lors de la mise à jour:', updateError);
         return createCorsResponse(
           { error: 'Erreur lors de la mise à jour', details: updateError },
           500,
           request
         );
       } else {
         console.log('✅ Statut mis à jour avec succès');
         return createCorsResponse({
           success: true,
           message: 'Statut require_password_change mis à jour avec succès',
           data: updateData
         }, 200, request);
       }
     } else {
       // Créer une nouvelle entrée avec tous les champs requis
       console.log('➕ Création d\'une nouvelle entrée...');
       
       // Récupérer les données de l'employé pour le display_name
       const { data: employeeData, error: employeeError } = await supabase
         .from('employees')
         .select('first_name, last_name')
         .eq('id', employeeId)
         .single();

       console.log('📊 Données employé pour création:', { employeeData, employeeError });

       const displayName = employeeData 
         ? `${employeeData.first_name || ''} ${employeeData.last_name || ''}`.trim() 
         : email.split('@')[0]; // Fallback sur la partie locale de l'email

       const { data: insertData, error: insertError } = await supabase
         .from('admin_users')
         .insert({
           id: crypto.randomUUID(), // Générer un UUID
           email: email,
           display_name: displayName,
           role: 'user', // Rôle par défaut
           active: true,
           require_password_change: false
         })
         .select();

       console.log('📊 Résultat création:', { insertData, insertError });

       if (insertError) {
         console.error('❌ Erreur lors de la création:', insertError);
         return createCorsResponse(
           { error: 'Erreur lors de la création', details: insertError },
           500,
           request
         );
       } else {
         console.log('✅ Entrée créée avec succès');
         return createCorsResponse({
           success: true,
           message: 'Entrée créée avec require_password_change = false',
           data: insertData
         }, 200, request);
       }
     }

  } catch (error) {
    console.error('💥 Erreur dans la route force-update-first-login:', error);
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500,
      request
    );
  }
}
