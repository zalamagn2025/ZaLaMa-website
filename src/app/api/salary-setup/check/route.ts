import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token d\'accès requis' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Pour l'instant, on va utiliser une approche simplifiée
    // On va chercher directement dans la table employees avec le token comme user_id
    // ou utiliser une autre méthode selon votre système d'auth
    
    // Essayer de récupérer l'employé directement
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select(`
        *,
        admin_users!inner(role, partner_id),
        partners!inner(company_name)
      `)
      .eq('user_id', token) // Utiliser le token comme user_id temporairement
      .single();


    if (employeeError) {
      
      // Essayer une autre approche - chercher par email ou autre identifiant
      // Pour l'instant, retourner une erreur
      return NextResponse.json(
        { success: false, error: 'Employé non trouvé' },
        { status: 404 }
      );
    }

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employé non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a le rôle approprié (rh ou responsable)
    const userRole = employee.admin_users?.role;
    
    if (userRole !== 'rh' && userRole !== 'responsable') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé - Rôle requis: rh ou responsable' },
        { status: 403 }
      );
    }

    // Déterminer si l'utilisateur a besoin de configurer son salaire
    const needsSetup = employee.salaire_net === 0 || employee.salaire_net === null;

    const response = {
      success: true,
      needsSetup,
      user: {
        id: employee.user_id,
        role: userRole,
        email: employee.email,
        display_name: `${employee.prenom} ${employee.nom}`,
        currentSalary: employee.salaire_net || 0,
        partner: {
          id: employee.partners?.id || employee.partner_id,
          company_name: employee.partners?.company_name || 'Entreprise'
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Erreur lors de la vérification du salaire:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
