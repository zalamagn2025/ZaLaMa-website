import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Partenaire } from '@/types/partenaire'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<Partenaire | { error: string }>> {
  try {
    const { id } = await context.params
    console.log('🔍 Récupération du partenaire ID:', id)

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

    // Validation de l'ID
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      console.log('❌ ID invalide:', id)
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    console.log('🔍 Recherche dans Supabase...')

    // Récupérer le partenaire
    const { data: partenaireData, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
    }

    if (!partenaireData) {
      console.log('❌ Partenaire non trouvé pour ID:', id)
      return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 })
    }

    console.log('✅ Partenaire récupéré:', partenaireData.nom)
    return NextResponse.json(partenaireData as Partenaire)
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération du partenaire:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Erreur serveur: ${error.message}`
            : 'Erreur serveur inconnue',
      },
      { status: 500 }
    )
  }
}

// Optionnel : Activer la mise en cache pour réduire les lectures Supabase
export const revalidate = 3600 // Revalider toutes les heures