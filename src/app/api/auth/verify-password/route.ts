import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const MAX_PASSWORD_ATTEMPTS = 5
const LOCKOUT_DURATION_MINUTES = 15

export async function POST(request: NextRequest) {
  try {    
    // Vérifier l'authentification via token Bearer (pour les employés)
    const authHeader = request.headers.get('authorization')
    let employeeEmail: string | null = null
    
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
            employeeEmail = result.data.email
          }
        } 
      } catch (error) {
        console.error('Erreur lors de la validation du token:', error)
      }
    } 
    
    // Si pas de token valide, essayer l'authentification Supabase classique
    let userEmail: string | null = null
    if (!employeeEmail) {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
      )
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        return NextResponse.json(
          { success: false, message: 'Session utilisateur non trouvée' },
          { status: 401 }
        )
      }
      userEmail = session.user.email || null
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Mot de passe requis' },
        { status: 400 }
      )
    }

    // Utiliser l'email de l'employé ou de l'utilisateur Supabase
    const emailToVerify = employeeEmail || userEmail
        
    if (!emailToVerify) {
      return NextResponse.json(
        { success: false, message: 'Email utilisateur non trouvé' },
        { status: 400 }
      )
    }

    // Créer une instance Supabase pour la vérification du mot de passe
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    )

    // Vérifier le mot de passe de l'utilisateur    
    const { data: { user }, error: passwordError } = await supabase.auth.signInWithPassword({
      email: emailToVerify,
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