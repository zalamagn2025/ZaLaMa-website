import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const MAX_PASSWORD_ATTEMPTS = 5
const LOCKOUT_DURATION_MINUTES = 15

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Vérifier que l'utilisateur est connecté
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return NextResponse.json(
        { success: false, message: 'Session utilisateur non trouvée' },
        { status: 401 }
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe requis' },
        { status: 400 }
      )
    }

    // Vérifier le mot de passe de l'utilisateur
    const { data: { user }, error: passwordError } = await supabase.auth.signInWithPassword({
      email: session.user.email!,
      password: password
    })

    if (passwordError || !user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Mot de passe incorrect'
        },
        { status: 401 }
      )
    }

    // Mot de passe correct
    return NextResponse.json(
      { 
        success: true, 
        message: 'Vérification réussie'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 