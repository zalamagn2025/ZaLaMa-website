import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Récupérer les transactions avec les relations
    const { data: transactions, error: transactionsError, count } = await supabase
      .from('transactions')
      .select(`
        *,
        employees!transactions_employe_id_fkey (
          id,
          nom,
          prenom,
          email
        ),
        partners!transactions_entreprise_id_fkey (
          id,
          nom,
          email
        ),
        salary_advance_requests!transactions_demande_avance_id_fkey (
          id,
          montant_demande,
          motif
        )
      `, { count: 'exact' })
      .order('date_transaction', { ascending: false })
      .range(offset, offset + limit - 1);

    if (transactionsError) {
      console.error('Erreur lors de la récupération des transactions:', transactionsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des transactions' },
        { status: 500 }
      );
    }

    // Formater les données pour l'affichage
    const formattedTransactions = transactions?.map(transaction => ({
      id: transaction.id,
      demande_avance_id: transaction.demande_avance_id,
      employe_id: transaction.employe_id,
      entreprise_id: transaction.entreprise_id,
      montant: transaction.montant,
      numero_transaction: transaction.numero_transaction,
      methode_paiement: transaction.methode_paiement,
      numero_compte: transaction.numero_compte,
      numero_reception: transaction.numero_reception,
      date_transaction: transaction.date_transaction,
      recu_url: transaction.recu_url,
      date_creation: transaction.date_creation,
      statut: transaction.statut,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      description: transaction.description,
      message_callback: transaction.message_callback,
      // Données des relations
      employe: transaction.employees,
      entreprise: transaction.partners,
      demande_avance: transaction.salary_advance_requests
    })) || [];

    return NextResponse.json({
      transactions: formattedTransactions,
      total: count || 0,
      page,
      limit
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 