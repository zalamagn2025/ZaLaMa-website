import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CONTRACT_TYPES = ['CDI', 'CDD', 'Consultant', 'Stage', 'Autre'];

export async function POST(request: NextRequest) {
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

    // Vérifier le token et récupérer les informations de l'utilisateur
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer les informations de l'utilisateur admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur admin non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a le rôle approprié (rh ou responsable)
    if (adminUser.role !== 'rh' && adminUser.role !== 'responsable') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les données du body
    const body = await request.json();
    const { salaire_net, type_contrat, date_embauche, poste } = body;

    // Validation des données
    if (!salaire_net || salaire_net <= 0 || salaire_net > 10000000) {
      return NextResponse.json(
        { success: false, error: 'Le salaire doit être entre 1 et 10 000 000 FG' },
        { status: 400 }
      );
    }

    if (!type_contrat || !CONTRACT_TYPES.includes(type_contrat)) {
      return NextResponse.json(
        { success: false, error: 'Type de contrat invalide' },
        { status: 400 }
      );
    }

    if (!date_embauche) {
      return NextResponse.json(
        { success: false, error: 'La date d\'embauche est requise' },
        { status: 400 }
      );
    }

    if (new Date(date_embauche) > new Date()) {
      return NextResponse.json(
        { success: false, error: 'La date d\'embauche ne peut pas être dans le futur' },
        { status: 400 }
      );
    }

    if (!poste || poste.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Le poste doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }

    // Récupérer l'employé actuel
    const { data: currentEmployee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (employeeError || !currentEmployee) {
      return NextResponse.json(
        { success: false, error: 'Employé non trouvé' },
        { status: 404 }
      );
    }

    const oldSalary = currentEmployee.salaire_net || 0;

    // Mettre à jour l'employé
    const { data: updatedEmployee, error: updateError } = await supabase
      .from('employees')
      .update({
        salaire_net: salaire_net,
        type_contrat: type_contrat,
        date_embauche: date_embauche,
        poste: poste,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Erreur lors de la mise à jour de l\'employé:', updateError);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la configuration du salaire' },
        { status: 500 }
      );
    }

    // Enregistrer dans l'historique
    const { error: historyError } = await supabase
      .from('salary_setup_history')
      .insert({
        user_id: user.id,
        employee_id: currentEmployee.id,
        old_salary: oldSalary,
        new_salary: salaire_net,
        changed_by: user.id,
        reason: 'Configuration initiale du salaire',
        created_at: new Date().toISOString()
      });

    if (historyError) {
      console.error('Erreur lors de l\'enregistrement de l\'historique:', historyError);
      // Ne pas échouer complètement si l'historique ne peut pas être enregistré
    }

    return NextResponse.json({
      success: true,
      message: 'Salaire configuré avec succès',
      employee: {
        id: updatedEmployee.id,
        salaire_net: updatedEmployee.salaire_net,
        poste: updatedEmployee.poste,
        type_contrat: updatedEmployee.type_contrat,
        updated_at: updatedEmployee.updated_at
      }
    });

  } catch (error) {
    console.error('Erreur lors de la configuration du salaire:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
