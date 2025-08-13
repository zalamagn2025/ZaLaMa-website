import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createCorsResponse, handleOptions } from '@/lib/cors';

interface LoginData {
  email: string;
  password: string;
}

// Gestion CORS pour les requêtes OPTIONS
export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Tentative de connexion via API temporaire...');
    
    const body: LoginData = await request.json();
    const { email, password } = body;

        // Validation des données
    if (!email || !password) {
      return createCorsResponse(
        { success: false, error: 'Email et mot de passe requis' },
        400
      );
    }

    // Vérifier que JWT_SECRET est défini
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET n\'est pas défini');
      return createCorsResponse(
        { success: false, error: 'Configuration serveur manquante' },
        500
      );
    }

    console.log('🔍 Authentification Supabase pour:', email);

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

    // Authentification avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('❌ Erreur d\'authentification Supabase:', authError);
      
      // Gestion des erreurs Supabase Auth spécifiques
      let errorMessage = 'Identifiants invalides';
      
      switch (authError.message) {
        case 'Invalid login credentials':
          errorMessage = 'Email ou mot de passe incorrect';
          break;
        case 'Email not confirmed':
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
          break;
        case 'User not found':
          errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'Too many requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard';
          break;
        default:
          errorMessage = 'Identifiants invalides';
      }
      
      return createCorsResponse(
        { success: false, error: errorMessage },
        401
      );
    }

    const supabaseUser = authData.user;
    console.log('✅ Authentification Supabase réussie pour UID:', supabaseUser.id);

    // Récupérer les informations complémentaires depuis la table employees par user_id
    console.log('📋 Recherche des informations employé par user_id...');
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', supabaseUser.id)
      .single();

    if (employeeError && employeeError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la récupération des données employé:', employeeError);
    }

    if (employeeData) {
      console.log('👤 Informations employé trouvées:', employeeData.nom_complet || `${employeeData.prenom} ${employeeData.nom}`);
    } else {
      console.log('⚠️ Aucune information employé trouvée pour user_id:', supabaseUser.id);
    }

    // Créer un token JWT avec toutes les informations disponibles
    const tokenPayload = {
      uid: supabaseUser.id,
      email: supabaseUser.email,
      emailVerified: supabaseUser.email_confirmed_at ? true : false,
      // Informations depuis la table employees (si disponibles)
      ...(employeeData && {
        employeeId: employeeData.id,
        prenom: employeeData.prenom,
        nom: employeeData.nom,
        nomComplet: employeeData.nom_complet,
        telephone: employeeData.telephone,
        poste: employeeData.poste,
        role: employeeData.role,
        genre: employeeData.genre,
        adresse: employeeData.adresse,
        salaireNet: employeeData.salaire_net,
        typeContrat: employeeData.type_contrat,
        dateEmbauche: employeeData.date_embauche,
        partenaireId: employeeData.partenaire_id,
        userId: employeeData.user_id
      })
    };

    const accessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d',
        issuer: 'zalamasas.com',
        audience: 'zalamasas-employes'
      }
    );

    const refreshToken = jwt.sign(
      { uid: supabaseUser.id, type: 'refresh' },
      process.env.JWT_SECRET,
      { 
        expiresIn: '30d',
        issuer: 'zalamasas.com',
        audience: 'zalamasas-employes'
      }
    );

    // Mettre à jour la dernière connexion dans la table employees (si elle existe)
    if (employeeData) {
      const { error: updateError } = await supabase
        .from('employees')
        .update({
          last_login: new Date().toISOString(),
          date_modification: new Date().toISOString()
        })
        .eq('id', employeeData.id);

      if (updateError) {
        console.error('⚠️ Erreur lors de la mise à jour last_login:', updateError);
      } else {
        console.log('✅ Dernière connexion mise à jour');
      }
    }

    // Retourner la réponse au format attendu par le service employee-auth
    return createCorsResponse({
      success: true,
      access_token: accessToken,
      refresh_token: refreshToken,
      employee: employeeData ? {
        id: employeeData.id,
        user_id: employeeData.user_id,
        nom: employeeData.nom,
        prenom: employeeData.prenom,
        nomComplet: employeeData.nom_complet,
        telephone: employeeData.telephone,
        email: employeeData.email,
        genre: employeeData.genre,
        adresse: employeeData.adresse,
        poste: employeeData.poste,
        role: employeeData.role,
        type_contrat: employeeData.type_contrat,
        salaire_net: employeeData.salaire_net,
        date_embauche: employeeData.date_embauche,
        photo_url: employeeData.photo_url,
        actif: employeeData.actif,
        partner_id: employeeData.partenaire_id,
        created_at: employeeData.created_at,
        updated_at: employeeData.updated_at
      } : null
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la connexion:', error);
    
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500
    );
  }
}
