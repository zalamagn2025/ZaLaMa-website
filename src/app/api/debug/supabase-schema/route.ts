import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PRIVATE_SUPABASE_URL!,
      process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY!,
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
    )
    
    // Vérifier l'authentification
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      )
    }

    const debugInfo: any = {
      user: session.user,
      tables: {}
    }

    // Vérifier la table employees
    try {
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(5)
      
      debugInfo.tables.employees = {
        data: employees,
        error: employeesError,
        count: employees?.length || 0
      }
    } catch (error) {
      debugInfo.tables.employees = { error: error }
    }

    // Vérifier la table demande-avance-salaire
    try {
      const { data: demandes, error: demandesError } = await supabase
        .from('demande-avance-salaire')
        .select('*')
        .limit(5)
      
      debugInfo.tables.demande_avance_salaire = {
        data: demandes,
        error: demandesError,
        count: demandes?.length || 0
      }
    } catch (error) {
      debugInfo.tables.demande_avance_salaire = { error: error }
    }

    // Vérifier la table financial_transactions
    try {
      const { data: transactions, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select('*')
        .limit(5)
      
      debugInfo.tables.financial_transactions = {
        data: transactions,
        error: transactionsError,
        count: transactions?.length || 0
      }
    } catch (error) {
      debugInfo.tables.financial_transactions = { error: error }
    }

    // Vérifier la table partners
    try {
      const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .limit(5)
      
      debugInfo.tables.partners = {
        data: partners,
        error: partnersError,
        count: partners?.length || 0
      }
    } catch (error) {
      debugInfo.tables.partners = { error: error }
    }

    return NextResponse.json({
      success: true,
      debugInfo
    })

  } catch (error) {
    console.error('Erreur dans GET /api/debug/supabase-schema:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error },
      { status: 500 }
    )
  }
} 