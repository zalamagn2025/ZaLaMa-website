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
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }


    // Essayer d'abord de récupérer les données depuis la table users (responsables/RH)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .maybeSingle() // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur

    if (userError) {
      // Ne pas retourner d'erreur ici, continuer vers employees
    }

    // Si l'utilisateur est trouvé dans la table users
    if (userData) {
      
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

    }

    // Si l'utilisateur n'est pas dans users, essayer dans employees
    
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (employeeError) {
      if (employeeError.code !== 'PGRST116') {
        console.error('❌ Erreur lors de la récupération des données employé:', employeeError)
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des données employé', details: employeeError.message },
          { status: 500 }
        )
      }
    }

    if (employeeData) {      
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
        partenaireId: employeeData.partner_id,
        // ✅ Photo de profil depuis la table employees
        photo_url: employeeData.photo_url
      }

      return NextResponse.json({ user })
    }

    // Si ni dans users ni dans employees    
    // Vérifier s'il y a des employés avec cet email
    const { data: emailCheck, error: emailError } = await supabase
      .from('employees')
      .select('user_id, email, nom, prenom')
      .eq('email', session.user.email)
    
    if (emailCheck && emailCheck.length > 0) {
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