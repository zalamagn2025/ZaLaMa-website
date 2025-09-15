import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface LoginData {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {    
    const body: LoginData = await request.json();
    const { email, password } = body;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier que JWT_SECRET est défini
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET n\'est pas défini');
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

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
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }

    const supabaseUser = authData.user;

    // Récupérer les informations complémentaires depuis la table employees par user_id
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', supabaseUser.id)
      .single();

    if (employeeError && employeeError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la récupération des données employé:', employeeError);
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

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d',
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
      } 
    }

    const response = NextResponse.json(
      { 
        message: 'Connexion réussie',
        user: {
          uid: supabaseUser.id,
          email: supabaseUser.email,
          emailVerified: supabaseUser.email_confirmed_at ? true : false,
          displayName: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
          photoURL: supabaseUser.user_metadata?.avatar_url,
          // Informations employé (si disponibles)
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
            partenaireId: employeeData.partenaire_id
          })
        }
      },
      { status: 200 }
    );

    // Définir le cookie avec le token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    });

    return response;

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la connexion:', error);
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 