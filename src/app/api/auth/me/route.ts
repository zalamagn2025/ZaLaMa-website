import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('👤 Récupération des informations utilisateur...')
    
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
    
    // Récupérer la session utilisateur
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Erreur de session:', sessionError)
      return NextResponse.json(
        { error: 'Erreur de session', details: sessionError.message },
        { status: 401 }
      )
    }
    
    if (!session) {
      console.log('❌ Aucune session trouvée')
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    console.log('✅ Session trouvée pour:', session.user.email)
    console.log('🔍 User ID:', session.user.id)

    // Essayer d'abord de récupérer les données depuis la table users (responsables/RH)
    console.log('🔍 Recherche dans la table users...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .maybeSingle() // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur

    if (userError) {
      console.log('❌ Erreur lors de la recherche dans users:', userError.message)
      // Ne pas retourner d'erreur ici, continuer vers employees
    }

    // Si l'utilisateur est trouvé dans la table users
    if (userData) {
      console.log('✅ Données utilisateur récupérées, type:', userData.type)
      
      // Combiner les données
      const user = {
        uid: session.user.id,
        email: session.user.email,
        emailVerified: session.user.email_confirmed_at ? true : false,
        displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        photoURL: session.user.user_metadata?.avatar_url,
        // Données utilisateur
        ...userData
      }

      console.log('✅ Informations utilisateur complètes récupérées')
      return NextResponse.json({ user })
    }

    // Si l'utilisateur n'est pas dans users, essayer dans employees
    console.log('🔍 Utilisateur non trouvé dans users, recherche dans employees...')
    console.log('🔍 Recherche avec user_id:', session.user.id)
    
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (employeeError) {
      console.log('❌ Erreur ou employé non trouvé:', employeeError.message)
      if (employeeError.code !== 'PGRST116') {
        console.error('❌ Erreur lors de la récupération des données employé:', employeeError)
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des données employé', details: employeeError.message },
          { status: 500 }
        )
      }
    }

    if (employeeData) {
      console.log('✅ Données employé récupérées:', employeeData.nom_complet || `${employeeData.prenom} ${employeeData.nom}`)
      
      // Créer un objet utilisateur pour les employés
      const user = {
        uid: session.user.id,
        email: session.user.email,
        emailVerified: session.user.email_confirmed_at ? true : false,
        displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
        photoURL: session.user.user_metadata?.avatar_url,
        // Type par défaut pour les employés
        type: 'Salarié',
        statut: 'Actif',
        actif: true,
        // Données employé
        employeId: employeeData.id,
        prenom: employeeData.prenom,
        nom: employeeData.nom,
        nomComplet: `${employeeData.prenom} ${employeeData.nom}`,
        telephone: employeeData.telephone,
        poste: employeeData.poste,
        role: employeeData.role,
        genre: employeeData.genre,
        adresse: employeeData.adresse,
        salaireNet: employeeData.salaire_net,
        typeContrat: employeeData.type_contrat,
        dateEmbauche: employeeData.date_embauche,
        partenaireId: employeeData.partner_id
      }

      console.log('✅ Informations employé complètes récupérées')
      return NextResponse.json({ user })
    }

    // Si ni dans users ni dans employees
    console.log('⚠️ Utilisateur non trouvé dans users ni employees')
    console.log('🔍 Email de session:', session.user.email)
    console.log('🔍 User ID de session:', session.user.id)
    
    // Vérifier s'il y a des employés avec cet email
    const { data: emailCheck, error: emailError } = await supabase
      .from('employees')
      .select('user_id, email, nom, prenom')
      .eq('email', session.user.email)
    
    if (emailCheck && emailCheck.length > 0) {
      console.log('🔍 Employés trouvés avec cet email:', emailCheck)
    }
    
    return NextResponse.json(
      { 
        error: 'Utilisateur non trouvé dans la base de données',
        sessionEmail: session.user.email,
        sessionUserId: session.user.id
      },
      { status: 404 }
    )
    
  } catch (error) {
    console.error('💥 Erreur dans /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 