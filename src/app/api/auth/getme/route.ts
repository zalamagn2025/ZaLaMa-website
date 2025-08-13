import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createCorsResponse, handleOptions } from '@/lib/cors';

// Gestion CORS pour les requêtes OPTIONS
export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    console.log('👤 Récupération du profil employé via API temporaire...');
    
    // Vérifier que JWT_SECRET est défini
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET n\'est pas défini');
      return createCorsResponse(
        { error: 'Configuration serveur manquante' },
        500
      );
    }

    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsResponse(
        { error: 'Token d\'authentification manquant' },
        401
      );
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token JWT
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET) as any;
      console.log('✅ Token JWT vérifié pour:', decodedToken.email);
    } catch (jwtError) {
      console.error('❌ Erreur de vérification JWT:', jwtError);
      return createCorsResponse(
        { error: 'Token invalide ou expiré' },
        401
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

    // Récupérer les informations employé depuis la base de données
    console.log('📋 Recherche des informations employé par user_id:', decodedToken.uid);
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', decodedToken.uid)
      .single();

    if (employeeError) {
      console.error('❌ Erreur lors de la récupération des données employé:', employeeError);
      return createCorsResponse(
        { error: 'Erreur lors de la récupération du profil' },
        500
      );
    }

    if (!employeeData) {
      console.log('⚠️ Aucune information employé trouvée pour user_id:', decodedToken.uid);
      return createCorsResponse(
        { error: 'Profil employé non trouvé' },
        404
      );
    }

    console.log('✅ Profil employé récupéré:', employeeData.nom_complet || `${employeeData.prenom} ${employeeData.nom}`);

    // Retourner la réponse au format attendu par le service employee-auth
    return createCorsResponse({
      employee: {
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
      }
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de la récupération du profil:', error);
    
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500
    );
  }
}
