import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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

    // Vérifier que l'utilisateur est un admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('type')
      .eq('email', session.user.email)
      .single()

    if (userError || userData?.type !== 'Entreprise') {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, secteur } = body

    // Validation de l'action
    if (!action || !['activate', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Action invalide' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    if (action === 'activate') {
      // Activer le partenaire
      updateData = {
        actif: true,
        secteur: secteur || 'À définir'
      }
    } else if (action === 'reject') {
      // Rejeter le partenaire (supprimer ou marquer comme rejeté)
      updateData = {
        actif: false,
        description: 'Demande rejetée'
      }
    }

    // Mettre à jour le partenaire
    const { data: updatedPartner, error } = await supabase
      .from('partners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour:', error)
      return NextResponse.json(
        { success: false, message: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedPartner,
      message: action === 'activate' ? 'Partenaire activé avec succès' : 'Partenaire rejeté'
    })

  } catch (error) {
    console.error('Erreur dans PUT /api/partnership/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
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

    // Vérifier que l'utilisateur est un admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('type')
      .eq('email', session.user.email)
      .single()

    if (userError || userData?.type !== 'Entreprise') {
      return NextResponse.json(
        { success: false, message: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Récupérer le partenaire spécifique
    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération:', error)
      return NextResponse.json(
        { success: false, message: 'Partenaire non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: partner
    })

  } catch (error) {
    console.error('Erreur dans GET /api/partnership/[id]:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 