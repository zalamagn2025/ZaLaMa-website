import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { advanceNotificationService } from '@/services/advanceNotificationService'

// Configuration de sécurité
const MAX_PASSWORD_ATTEMPTS = 3
const LOCKOUT_DURATION_MINUTES = 15

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via token Bearer (pour les employés)
    const authHeader = request.headers.get('authorization')
    let employeeId: string | null = null
    let session: any = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      
      // Valider le token en appelant l'Edge Function
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl) {
          return NextResponse.json(
            { success: false, message: 'Configuration serveur manquante' },
            { status: 500 }
          )
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/employee-auth/getme`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey || '',
          },
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            employeeId = result.data.id
          }
        }
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error)
      }
    }
    
    // Si pas de token valide, essayer l'authentification Supabase classique
    if (!employeeId) {
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
      
      const { data: { session: sessionData }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !sessionData) {
        return NextResponse.json(
          { success: false, message: 'Non authentifié' },
          { status: 401 }
        )
      }
      
      session = sessionData
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

    // Récupérer les cookies pour la gestion des tentatives
    const cookieStore = await cookies()
    
    // Vérifier les tentatives de mot de passe (stockage temporaire en session)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Session utilisateur non trouvée' },
        { status: 401 }
      )
    }
    
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

    // Créer une instance Supabase pour la vérification du mot de passe
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
    const maxAvanceMonthly = Math.floor(salaireNet * 0.30) // 30% du salaire mensuel

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

    // Vérifier si la nouvelle demande + total existant dépasse 30%
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
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la création de la demande d\'avance' },
        { status: 500 }
      )
    }

    // Créer une entrée dans la table transactions
    const transactionData = {
      demande_avance_id: demandeAvanceResult.id,
      employe_id: employeId,
      entreprise_id: entrepriseId,
      montant: parseFloat(montantDemande),
      numero_transaction: numeroReception || `TXN-${Date.now()}`,
      methode_paiement: 'MOBILE_MONEY' as const, // Par défaut, sera mis à jour lors du paiement
      numero_reception: numeroReception || `REF-${Date.now()}`,
      date_transaction: new Date().toISOString(),
      statut: 'EN_COURS' as const,
      description: `Demande d'avance sur salaire: ${motif.trim()}`,
      date_creation: new Date().toISOString()
    }

    const { data: transactionResult, error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single()

    if (transactionError) {
      console.error('❌ Erreur lors de la création de la transaction:', transactionError)
      // Ne pas faire échouer la demande pour cette raison, mais logger l'erreur
    } else {
      console.log('✅ Transaction créée:', transactionResult.id)
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
            transaction_id: demandeAvanceResult.id
          },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        })
    } catch (activityError) {
      // Ne pas faire échouer la demande pour cette raison
    }

    console.log('✅ Demande d\'avance créée:', {
      id: demandeAvanceResult.id,
      montant: montantDemande,
      employe: employeId,
      entreprise: entrepriseId
    })

    // Envoi des notifications (email + SMS) en arrière-plan
    try {
      // Récupérer les données de l'employé pour les notifications
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('nom, prenom, email, telephone')
        .eq('id', employeId)
        .single()

      if (!employeeError && employeeData) {
        const notificationData = {
          employeeName: `${employeeData.prenom} ${employeeData.nom}`,
          employeeEmail: employeeData.email,
          employeePhone: employeeData.telephone,
          amount: parseFloat(montantDemande),
          reason: motif.trim(),
          requestDate: new Date().toISOString(),
          requestId: demandeAvanceResult.id,
          availableSalary: salaireDisponible ? parseFloat(salaireDisponible) : 0,
          availableAdvance: avanceDisponible ? parseFloat(avanceDisponible) : 0,
          requestType: typeMotif
        }

        // Envoi non-bloquant des notifications
        advanceNotificationService.sendAdvanceNotifications(notificationData)
          .then(result => {
            console.log('📧 Notifications avance envoyées:', {
              employee: notificationData.employeeName,
              requestId: notificationData.requestId,
              emailSuccess: result.email.success,
              smsSuccess: result.sms.success,
              summary: result.summary
            })
          })
          .catch(error => {
            console.error('❌ Erreur envoi notifications avance:', error)
          })
      }
    } catch (notificationError) {
      // Ne pas faire échouer la demande pour les erreurs de notification
      console.error('❌ Erreur lors de l\'envoi des notifications:', notificationError)
    }

    return NextResponse.json({
      success: true,
      message: 'Demande d\'avance créée avec succès',
      data: {
        id: demandeAvanceResult.id,
        montant: montantDemande,
        statut: 'En attente',
        reference: demandeAvanceData.numero_reception
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