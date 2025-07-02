import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/transactions - Début de la requête');
    
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    );
    
    // Vérifier l'authentification
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      console.log('❌ Erreur d\'authentification:', authError);
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    const userEmail = session.user.email;
    console.log('✅ Utilisateur authentifié:', userEmail);
    
    // Récupérer l'ID de l'employé connecté
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id, nom, prenom')
      .eq('email', userEmail)
      .single();
    
    if (employeeError || !employee) {
      console.log('❌ Employé non trouvé:', employeeError);
      return NextResponse.json({ error: 'Employé non trouvé' }, { status: 404 });
    }
    
    console.log('✅ Employé trouvé:', employee.id);
    
    // Récupérer les transactions de l'employé
    const { data: transactions, error: transactionsError } = await supabase
      .from('financial_transactions')
      .select(`
        *,
        services:service_id (
          nom,
          description
        ),
        partenaires:partenaire_id (
          nom
        )
      `)
      .eq('utilisateur_id', employee.id)
      .order('date_transaction', { ascending: false });
    
    if (transactionsError) {
      console.log('❌ Erreur lors de la récupération des transactions:', transactionsError);
      return NextResponse.json({ error: 'Erreur lors de la récupération des transactions' }, { status: 500 });
    }
    
    console.log('✅ Transactions récupérées:', transactions?.length || 0);
    
    // Formater les transactions pour l'affichage
    const formattedTransactions = transactions?.map(transaction => ({
      id: transaction.id,
      montant: transaction.montant,
      type: transaction.type,
      description: transaction.description,
      statut: transaction.statut,
      date_transaction: transaction.date_transaction,
      date_validation: transaction.date_validation,
      reference: transaction.reference,
      service: transaction.services?.nom || 'Service non spécifié',
      partenaire: transaction.partenaires?.nom || 'Partenaire non spécifié',
      transaction_id: transaction.transaction_id || transaction.id
    })) || [];
    
    return NextResponse.json({ 
      transactions: formattedTransactions,
      total: formattedTransactions.length
    });
    
  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 });
  }
} 