import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
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

    const { demandeId, newStatus, motifRejet } = await request.json()

    if (!demandeId || !newStatus) {
      return NextResponse.json(
        { success: false, message: 'ID de demande et nouveau statut requis' },
        { status: 400 }
      )
    }

    // Récupérer la demande d'avance
    const { data: demande, error: demandeError } = await supabase
      .from('salary_advance_requests')
      .select('*')
      .eq('id', demandeId)
      .single()

    if (demandeError || !demande) {
      return NextResponse.json(
        { success: false, message: 'Demande introuvable' },
        { status: 404 }
      )
    }

    // Mettre à jour le statut de la demande d'avance
    const updateData: any = {
      statut: newStatus,
      updated_at: new Date().toISOString()
    }

    // Ajouter les dates selon le statut
    if (newStatus === 'Validé') {
      updateData.date_validation = new Date().toISOString()
    } else if (newStatus === 'Rejeté') {
      updateData.date_rejet = new Date().toISOString()
      updateData.motif_rejet = motifRejet || 'Aucun motif spécifié'
    }

    const { data: updatedDemande, error: updateError } = await supabase
      .from('salary_advance_requests')
      .update(updateData)
      .eq('id', demandeId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour de la demande:', updateError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    // Mettre à jour le statut de la transaction correspondante
    let transactionStatus = 'EN_COURS'
    if (newStatus === 'Validé') {
      transactionStatus = 'EFFECTUEE'
    } else if (newStatus === 'Rejeté') {
      transactionStatus = 'ECHOUE'
    }

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('demande_avance_id', demandeId)
      .single()

    if (transaction) {
      const { error: updateTransactionError } = await supabase
        .from('transactions')
        .update({
          statut: transactionStatus,
          updated_at: new Date().toISOString()
        })
        .eq('demande_avance_id', demandeId)

      if (updateTransactionError) {
        console.error('❌ Erreur lors de la mise à jour de la transaction:', updateTransactionError)
        // Ne pas faire échouer la demande pour cette raison
      } else {
        console.log('✅ Transaction mise à jour:', transactionStatus)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Statut mis à jour vers ${newStatus}`,
      data: {
        demande: updatedDemande,
        transaction_status: transactionStatus
      }
    })

  } catch (error) {
    console.error('💥 Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

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
            cookieStore.set({ name, value, '', ...options })
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

    const { searchParams } = new URL(request.url)
    const demandeId = searchParams.get('demandeId')

    if (!demandeId) {
      return NextResponse.json(
        { success: false, message: 'ID de demande requis' },
        { status: 400 }
      )
    }

    // Récupérer la demande avec sa transaction
    const { data: demande, error: demandeError } = await supabase
      .from('salary_advance_requests')
      .select(`
        *,
        transactions!transactions_demande_avance_id_fkey (
          id,
          statut,
          numero_transaction,
          methode_paiement,
          date_transaction
        )
      `)
      .eq('id', demandeId)
      .single()

    if (demandeError || !demande) {
      return NextResponse.json(
        { success: false, message: 'Demande introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: demande
    })

  } catch (error) {
    console.error('💥 Erreur lors de la récupération du statut:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 