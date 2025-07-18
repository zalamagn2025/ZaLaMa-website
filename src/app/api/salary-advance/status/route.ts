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

    const { searchParams } = new URL(request.url)
    const employeId = searchParams.get('employeId')

    if (!employeId) {
      return NextResponse.json(
        { success: false, message: 'employeId est requis' },
        { status: 400 }
      )
    }

    console.log(`🔍 Recherche des avances actives pour l'employé: ${employeId}`)

    // Récupérer les avances actives (approuvées ou en cours de paiement)
    const { data: avancesActives, error: avancesError } = await supabase
      .from('salary_advance_requests')
      .select('montant_demande, montant_rembourse, statut, created_at')
      .eq('employe_id', employeId)
      .in('statut', ['Validé', 'EN_COURS_PAIEMENT', 'APPROUVE'])
      .order('created_at', { ascending: false })

    if (avancesError) {
      console.error('❌ Erreur lors de la récupération des avances actives:', avancesError)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Erreur lors de la récupération des avances actives',
          details: avancesError.message
        },
        { status: 500 }
      )
    }

    // Calculer le total des avances actives
    const totalAvanceActive = (avancesActives || []).reduce((total, avance) => {
      const montantDemande = avance.montant_demande || 0
      const montantRembourse = avance.montant_rembourse || 0
      const montantRestant = montantDemande - montantRembourse
      
      console.log(`📊 Avance: ${montantDemande} GNF - Remboursé: ${montantRembourse} GNF = Restant: ${montantRestant} GNF`)
      
      return total + Math.max(0, montantRestant) // Éviter les valeurs négatives
    }, 0)

    console.log(`💰 Total des avances actives pour l'employé ${employeId}: ${totalAvanceActive} GNF`)
    console.log(`📋 Nombre d'avances actives trouvées: ${avancesActives?.length || 0}`)

    return NextResponse.json({
      success: true,
      totalAvanceActive,
      employeId,
      details: {
        nombreAvances: avancesActives?.length || 0,
        avances: avancesActives?.map(avance => ({
          montantDemande: avance.montant_demande,
          montantRembourse: avance.montant_rembourse || 0,
          montantRestant: Math.max(0, (avance.montant_demande || 0) - (avance.montant_rembourse || 0)),
          statut: avance.statut,
          dateCreation: avance.created_at
        })) || []
      }
    })

  } catch (error) {
    console.error('💥 Erreur lors de la récupération des avances actives:', error)
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