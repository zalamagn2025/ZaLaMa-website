import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Configuration de sécurité
const MAX_PASSWORD_ATTEMPTS = 3
const LOCKOUT_DURATION_MINUTES = 15

export async function POST(request: NextRequest) {
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

    // Extraire les données de la requête
    const {
      employeId,
      montantDemande,
      typeMotif,
      motif,
      numeroReception,
      fraisService,
      montantTotal,
      salaireDisponible,
      avanceDisponible,
      entrepriseId,
      password
    } = await request.json()

    // Validation des données
    if (!employeId || !montantDemande || !motif || !password || !entrepriseId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tous les champs sont requis, y compris l\'identifiant de l\'entreprise',
          debug: { 
            employeId: !!employeId, 
            montantDemande: !!montantDemande, 
            motif: !!motif, 
            password: !!password,
            entrepriseId: !!entrepriseId
          }
        },
        { status: 400 }
      )
    }

    if (parseFloat(montantDemande) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Le montant doit être supérieur à 0' },
        { status: 400 }
      )
    }

    // Vérifier les tentatives de mot de passe (stockage temporaire en session)
    const attemptKey = `password_attempts_${session.user.id}`
    const currentAttempts = parseInt(cookieStore.get(attemptKey)?.value || '0')
    
    if (currentAttempts >= MAX_PASSWORD_ATTEMPTS) {
      const lockoutTime = cookieStore.get(`lockout_${session.user.id}`)?.value
      if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
        const remainingMinutes = Math.ceil((parseInt(lockoutTime) - Date.now()) / (1000 * 60))
        return NextResponse.json(
          { 
            success: false, 
            message: `Trop de tentatives incorrectes. Réessayez dans ${remainingMinutes} minutes.`,
            locked: true
          },
          { status: 429 }
        )
      } else {
        // Réinitialiser les tentatives après la période de verrouillage
        cookieStore.set(attemptKey, '0', { maxAge: 0 })
        cookieStore.set(`lockout_${session.user.id}`, '', { maxAge: 0 })
      }
    }

    // Vérifier le mot de passe de l'utilisateur
    const { data: { user }, error: passwordError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: password
    })

    if (passwordError || !user) {
      // Incrémenter le compteur de tentatives
      const newAttempts = currentAttempts + 1
      cookieStore.set(attemptKey, newAttempts.toString(), { maxAge: 60 * 60 }) // 1 heure
      
      if (newAttempts >= MAX_PASSWORD_ATTEMPTS) {
        // Verrouiller le compte
        const lockoutUntil = Date.now() + (LOCKOUT_DURATION_MINUTES * 60 * 1000)
        cookieStore.set(`lockout_${session.user.id}`, lockoutUntil.toString(), { maxAge: 60 * 60 })
        
        return NextResponse.json(
          { 
            success: false, 
            message: `Mot de passe incorrect. Compte verrouillé pour ${LOCKOUT_DURATION_MINUTES} minutes.`,
            attempts: newAttempts,
            maxAttempts: MAX_PASSWORD_ATTEMPTS,
            locked: true
          },
          { status: 401 }
        )
      }
      
      const remainingAttempts = MAX_PASSWORD_ATTEMPTS - newAttempts
      return NextResponse.json(
        { 
          success: false, 
          message: `Mot de passe incorrect. Il vous reste ${remainingAttempts} tentative${remainingAttempts > 1 ? 's' : ''}.`,
          attempts: newAttempts,
          maxAttempts: MAX_PASSWORD_ATTEMPTS
        },
        { status: 401 }
      )
    }

    // Mot de passe correct - réinitialiser les tentatives
    cookieStore.set(attemptKey, '0', { maxAge: 0 })
    cookieStore.set(`lockout_${session.user.id}`, '', { maxAge: 0 })

    // Récupérer les données de l'employé pour vérifier le salaire et l'appartenance à l'entreprise
    const { data: employeDataValidation, error: employeError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeId)
      .eq('partner_id', entrepriseId) // Vérifier que l'employé appartient à l'entreprise
      .single()
    
    if (employeError || !employeDataValidation?.salaire_net) {
      console.error('❌ Erreur employé:', employeError)
      console.error('❌ Données employé:', employeDataValidation)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Données employé introuvables, salaire non défini, ou employé n\'appartient pas à l\'entreprise spécifiée' 
        },
        { status: 400 }
      )
    }

    const salaireNet = employeDataValidation.salaire_net
    const maxAvanceMonthly = Math.floor(salaireNet * 0.25) // 25% du salaire mensuel

    // Vérifier le total des demandes approuvées ce mois-ci
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59)

    // Récupérer toutes les demandes approuvées pour cet utilisateur
    const { data: allApprovedData, error: allApprovedError } = await supabase
      .from('salary_advance_requests')
      .select('*')
      .eq('employe_id', employeId)
      .eq('statut', 'Validé')
    
    if (allApprovedError) {
      console.error('Erreur lors de la récupération des transactions:', allApprovedError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la vérification des limites' },
        { status: 500 }
      )
    }
    
    // Filtrer manuellement les demandes du mois en cours et calculer le total
    let totalAvancesApprouvees = 0
    const demandesMonthly: Array<{id: string, montant: number, date: Date}> = []
    
    allApprovedData?.forEach(transaction => {
      // Vérifier si la date est dans le mois en cours
      const transactionDate = new Date(transaction.date_creation)
      if (transactionDate >= startOfMonth && transactionDate <= endOfMonth) {
        totalAvancesApprouvees += transaction.montant_demande || 0
        demandesMonthly.push({
          id: transaction.id,
          montant: transaction.montant_demande,
          date: transactionDate
        })
      }
    })
    
    console.log('📅 Demandes du mois en cours:', demandesMonthly)

    // Vérifier si la nouvelle demande + total existant dépasse 25%
    const nouvelleDemande = parseFloat(montantDemande)
    const totalApresNouvelleDemande = totalAvancesApprouvees + nouvelleDemande

    if (totalApresNouvelleDemande > maxAvanceMonthly) {
      const avanceDisponible = maxAvanceMonthly - totalAvancesApprouvees
      return NextResponse.json(
        { 
          success: false, 
          message: `Cette demande dépasse votre limite mensuelle. Avance disponible ce mois-ci: ${avanceDisponible.toLocaleString()} GNF (déjà utilisé: ${totalAvancesApprouvees.toLocaleString()} GNF sur ${maxAvanceMonthly.toLocaleString()} GNF)` 
        },
        { status: 400 }
      )
    }

    // Créer une transaction financière
    const transactionData = {
      montant: parseFloat(montantDemande),
      type: 'Débloqué' as const,
      description: `Demande d'avance: ${motif.trim()}`,
      utilisateur_id: employeId,
      partenaire_id: entrepriseId,
      statut: 'En attente' as const,
      date_transaction: new Date().toISOString(),
      reference: numeroReception || `REF-${Date.now()}`
    }

    const { data: transactionDataResult, error: transactionError } = await supabase
      .from('financial_transactions')
      .insert(transactionData)
      .select()
      .single()

    if (transactionError) {
      console.error('❌ Erreur lors de la création de la transaction:', transactionError)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la création de la demande' },
        { status: 500 }
      )
    }

    // Créer une demande d'avance dans la table salary_advance_requests
    const demandeAvanceData = {
      employe_id: employeId,
      partenaire_id: entrepriseId,
      montant_demande: parseFloat(montantDemande),
      type_motif: typeMotif.toUpperCase(),
      motif: motif.trim(),
      numero_reception: numeroReception || `REF-${Date.now()}`,
      frais_service: parseFloat(fraisService) || 0,
      montant_total: parseFloat(montantTotal),
      salaire_disponible: salaireDisponible ? parseFloat(salaireDisponible) : null,
      avance_disponible: avanceDisponible ? parseFloat(avanceDisponible) : null,
      statut: 'En attente' as const,
      date_creation: new Date().toISOString()
    }

    const { data: demandeAvanceResult, error: demandeAvanceError } = await supabase
      .from('salary_advance_requests')
      .insert(demandeAvanceData)
      .select()
      .single()

    if (demandeAvanceError) {
      console.error('❌ Erreur lors de la création de la demande d\'avance:', demandeAvanceError)
    }

    // Enregistrer l'activité de l'utilisateur (optionnel - commenté pour éviter les erreurs)
    try {
      await supabase
        .from('user_activities')
        .insert({
          user_id: session.user.id,
          action: 'demande_avance_salaire',
          details: {
            montant: montantDemande,
            motif: motif,
            transaction_id: transactionDataResult.id
          },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        })
    } catch (activityError) {
      // Ne pas faire échouer la demande pour cette raison
    }

    console.log('✅ Demande d\'avance créée:', {
      id: transactionDataResult.id,
      montant: montantDemande,
      employe: employeId,
      entreprise: entrepriseId
    })

    return NextResponse.json({
      success: true,
      message: 'Demande d\'avance créée avec succès',
      data: {
        id: transactionDataResult.id,
        montant: montantDemande,
        statut: 'En attente',
        reference: transactionData.reference
      }
    })

  } catch (error) {
    console.error('💥 Erreur lors de la création de la demande:', error)
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

    // Récupérer l'ID de l'employé pour cet utilisateur
    const { data: employeData, error: employeError } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('actif', true)
      .single()

    if (employeError || !employeData) {
      return NextResponse.json(
        { success: false, message: 'Données employé introuvables' },
        { status: 404 }
      )
    }

    // Récupérer les demandes de l'utilisateur depuis la table salary_advance_requests
    const { data: demandes, error } = await supabase
      .from('salary_advance_requests')
      .select(`
        id,
        montant_demande,
        type_motif,
        motif,
        numero_reception,
        frais_service,
        montant_total,
        salaire_disponible,
        avance_disponible,
        statut,
        date_creation,
        date_validation,
        date_rejet,
        motif_rejet,
        created_at
      `)
      .eq('employe_id', employeData.id)
      .order('date_creation', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des demandes:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la récupération des demandes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: demandes
    })

  } catch (error) {
    console.error('Erreur dans GET /api/salary-advance/request:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}