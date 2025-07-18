import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
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
    )
    
    // Vérifier l'authentification
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les données de l'employé
    const { data: employeData, error: employeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('actif', true)  // Seulement les employés actifs
      .single()

    if (employeError) {
      console.error('Erreur récupération employé:', employeError)
      return NextResponse.json(
        { success: false, message: 'Données employé introuvables ou employé inactif' },
        { status: 404 }
      )
    }

    console.log('🔍 Données employé récupérées:', {
      id: employeData.id,
      nom: employeData.nom,
      prenom: employeData.prenom,
      partner_id: employeData.partner_id,
      salaire_net: employeData.salaire_net
    })

    // Calculer l'avance disponible
    const salaireNet = employeData.salaire_net || 0
    const maxAvanceMonthly = Math.floor(salaireNet * 0.25)

    // Récupérer les demandes approuvées ce mois-ci
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59)

    const { data: approvedTransactions, error: transactionsError } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('utilisateur_id', session.user.id)
      .eq('type', 'Débloqué')
      .eq('statut', 'Validé')

    let totalAvancesApprouvees = 0
    if (!transactionsError && approvedTransactions) {
      approvedTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date_transaction)
        if (transactionDate >= startOfMonth && transactionDate <= endOfMonth) {
          totalAvancesApprouvees += transaction.montant || 0
        }
      })
    }

    const avanceDisponible = Math.max(0, maxAvanceMonthly - totalAvancesApprouvees)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at
        },
        employe: {
          ...employeData,
          avance_disponible: avanceDisponible,
          max_avance_mensuelle: maxAvanceMonthly,
          total_avances_ce_mois: totalAvancesApprouvees,
          partner_id: employeData.partner_id
        }
      }
    })

  } catch (error) {
    console.error('Erreur dans GET /api/user/profile:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 