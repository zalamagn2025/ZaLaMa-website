import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { UserWithEmployeData } from '@/types/employe'

export async function getUserFromRequest(request: NextRequest): Promise<UserWithEmployeData | null> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PRIVATE_SUPABASE_URL!,
      process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // Ne pas modifier les cookies dans le middleware
          },
          remove(name: string, options: any) {
            // Ne pas modifier les cookies dans le middleware
          },
        },
      }
    )

    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }

    // Récupérer les données utilisateur depuis la table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (userError || !userData) {
      return null
    }

    // Récupérer les données employé si l'utilisateur est un employé
    let employeData = null
    if (userData.type === 'Salarié') {
      const { data: employe, error: employeError } = await supabase
        .from('employees')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (!employeError && employe) {
        employeData = employe
      }
    }

    // Combiner les données
    const user: UserWithEmployeData = {
      ...session.user,
      ...userData,
      ...employeData
    }

    return user
  } catch (error) {
    console.error('Erreur dans getUserFromRequest:', error)
    return null
  }
} 