import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CreateAvisRequest, AvisResponse, AvisListResponse } from '@/types/avis'
import jwt from 'jsonwebtoken'

// Interface pour le token JWT
interface JWTPayload {
  uid: string
  email: string
  emailVerified: boolean
  employeeId?: string
  prenom?: string
  nom?: string
  nomComplet?: string
  telephone?: string
  poste?: string
  role?: string
  genre?: string
  adresse?: string
  salaireNet?: number
  typeContrat?: string
  dateEmbauche?: string
  partenaireId?: string
  userId?: string
}

// Constante pour la limite d'avis par jour
const MAX_AVIS_PER_DAY = 3

// Fonction pour vérifier le token JWT
function verifyAuthToken(request: NextRequest): JWTPayload | null {
  try {
    const authToken = request.cookies.get('auth-token')?.value
    
    if (!authToken) {
      console.log('❌ Aucun token d\'authentification trouvé')
      return null
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET n\'est pas défini')
      return null
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET) as JWTPayload
    console.log('✅ Token JWT vérifié pour:', decoded.email)
    return decoded
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token JWT:', error)
    return null
  }
}

// Créer un client Supabase normal (RLS désactivé)
function createSupabaseClient() {
  console.log('🔧 Création du client Supabase...')
  console.log('📡 URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Définie' : '❌ Non définie')
  console.log('🔑 Clé anon Supabase:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Définie' : '❌ Non définie')
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Variables d\'environnement Supabase manquantes')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Fonction pour vérifier la limite d'avis par jour
async function checkDailyAvisLimit(supabase: any, employeeId: string): Promise<{ canPost: boolean; currentCount: number; limit: number }> {
  try {
    console.log('🔍 Vérification de la limite d\'avis quotidienne...')
    
    // Obtenir la date d'aujourd'hui (début et fin de journée)
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0).toISOString()
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString()
    
    console.log('📅 Période de vérification:', { startOfDay, endOfDay })
    
    // Compter les avis postés aujourd'hui par cet employé
    const { count, error } = await supabase
      .from('avis')
      .select('*', { count: 'exact', head: true })
      .eq('employee_id', employeeId)
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
    
    if (error) {
      console.error('❌ Erreur lors du comptage des avis:', error)
      throw error
    }
    
    const currentCount = count || 0
    const canPost = currentCount < MAX_AVIS_PER_DAY
    
    console.log(`📊 Avis aujourd'hui: ${currentCount}/${MAX_AVIS_PER_DAY} - Peut poster: ${canPost}`)
    
    return {
      canPost,
      currentCount,
      limit: MAX_AVIS_PER_DAY
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la limite:', error)
    throw error
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<AvisResponse>> {
  try {
    console.log('🔧 POST /api/avis - Début de la requête')
    
    // Vérifier l'authentification via JWT
    const userData = verifyAuthToken(request)
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      )
    }

    console.log('✅ Utilisateur authentifié:', userData.email)
    console.log('👤 User ID:', userData.uid)

    // Créer le client Supabase (RLS désactivé)
    let supabase
    try {
      supabase = createSupabaseClient()
      console.log('✅ Client Supabase créé avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la création du client Supabase:', error)
      return NextResponse.json(
        { success: false, error: 'Erreur de configuration Supabase' },
        { status: 500 }
      )
    }

    // Récupérer les données de la requête
    console.log('📥 Récupération des données de la requête...')
    const body: CreateAvisRequest = await request.json()
    console.log('📋 Données reçues:', body)
    
    // Validation des données
    if (!body.note || body.note < 1 || body.note > 5) {
      console.log('❌ Note invalide:', body.note)
      return NextResponse.json(
        { success: false, error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      )
    }

    if (!body.commentaire || body.commentaire.trim().length === 0) {
      console.log('❌ Commentaire vide')
      return NextResponse.json(
        { success: false, error: 'Le commentaire est requis' },
        { status: 400 }
      )
    }

    if (!body.type_retour || !['positif', 'negatif'].includes(body.type_retour)) {
      console.log('❌ Type de retour invalide:', body.type_retour)
      return NextResponse.json(
        { success: false, error: 'Le type de retour doit être "positif" ou "negatif"' },
        { status: 400 }
      )
    }

    console.log('✅ Validation des données OK')

    // Récupérer l'employé et son partner_id
    console.log('👤 Recherche de l\'employé...')
    console.log('🔍 Recherche avec user_id:', userData.uid)
    
    try {
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id, partner_id')
        .eq('user_id', userData.uid)
        .single()

      console.log('📊 Résultat recherche employé:', { employee, error: employeeError })

      if (employeeError) {
        console.error('❌ Erreur lors de la récupération de l\'employé:', employeeError)
        return NextResponse.json(
          { success: false, error: 'Employé non trouvé' },
          { status: 404 }
        )
      }

      if (!employee) {
        console.log('❌ Aucun employé trouvé pour user_id:', userData.uid)
        return NextResponse.json(
          { success: false, error: 'Employé non trouvé' },
          { status: 404 }
        )
      }

      console.log('✅ Employé trouvé:', employee.id)
      console.log('✅ Partner ID:', employee.partner_id)

      // Vérifier la limite d'avis par jour
      console.log('🔍 Vérification de la limite d\'avis quotidienne...')
      const limitCheck = await checkDailyAvisLimit(supabase, employee.id)
      
      if (!limitCheck.canPost) {
        console.log('❌ Limite d\'avis quotidienne atteinte')
        return NextResponse.json(
          { 
            success: false, 
            error: `Limite d'avis quotidienne atteinte. Vous avez déjà posté ${limitCheck.currentCount} avis aujourd'hui (limite: ${limitCheck.limit}). Réessayez demain.`,
            limitInfo: {
              currentCount: limitCheck.currentCount,
              limit: limitCheck.limit,
              remaining: 0
            }
          },
          { status: 429 } // Too Many Requests
        )
      }

      console.log(`✅ Limite OK - ${limitCheck.currentCount}/${limitCheck.limit} avis utilisés`)

      // Créer l'avis avec l'employee_id
      console.log('📝 Création de l\'avis...')
      const avisData = {
        employee_id: employee.id, // Utiliser l'ID de l'employé
        partner_id: employee.partner_id,
        note: body.note,
        commentaire: body.commentaire.trim(),
        type_retour: body.type_retour,
        date_avis: new Date().toISOString(),
        approuve: false
      }
      
      console.log('📋 Données à insérer:', avisData)
      
      const { data: avis, error: insertError } = await supabase
        .from('avis')
        .insert(avisData)
        .select()
        .single()

      if (insertError) {
        console.error('❌ Erreur lors de la création de l\'avis:', insertError)
        return NextResponse.json(
          { success: false, error: 'Erreur lors de la création de l\'avis' },
          { status: 500 }
        )
      }

      console.log('✅ Avis créé avec succès:', avis.id)
      
      // Retourner les informations de limite mises à jour
      const updatedLimitInfo = {
        currentCount: limitCheck.currentCount + 1,
        limit: limitCheck.limit,
        remaining: limitCheck.limit - (limitCheck.currentCount + 1)
      }
      
      return NextResponse.json(
        { 
          success: true, 
          data: avis,
          limitInfo: updatedLimitInfo
        },
        { status: 201 }
      )

    } catch (error) {
      console.error('💥 Erreur lors de la création de l\'avis:', error)
      return NextResponse.json(
        { success: false, error: 'Erreur interne du serveur' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<AvisListResponse>> {
  try {
    console.log('🔧 GET /api/avis - Début de la requête')
    
    // Vérifier l'authentification via JWT
    const userData = verifyAuthToken(request)
    if (!userData) {
      return NextResponse.json(
        { success: false, data: [], error: 'Non autorisé' },
        { status: 401 }
      )
    }

    console.log('✅ Utilisateur authentifié:', userData.email)

    // Créer le client Supabase (RLS désactivé)
    let supabase
    try {
      supabase = createSupabaseClient()
      console.log('✅ Client Supabase créé avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la création du client Supabase:', error)
      return NextResponse.json(
        { success: false, error: 'Erreur de configuration Supabase' },
        { status: 500 }
      )
    }

    // Récupérer l'employé pour obtenir son ID
    console.log('👤 Recherche de l\'employé...')
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', userData.uid)
      .single()

    if (employeeError || !employee) {
      console.error('❌ Employé non trouvé:', employeeError)
      return NextResponse.json(
        { success: false, data: [], error: 'Employé non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer les avis de l'employé
    const { data: avis, error: fetchError } = await supabase
      .from('avis')
      .select('*')
      .eq('employee_id', employee.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Erreur lors de la récupération des avis:', fetchError)
      return NextResponse.json(
        { success: false, data: [], error: 'Erreur lors de la récupération des avis' },
        { status: 500 }
      )
    }

    console.log('✅ Avis récupérés:', avis?.length || 0)
    return NextResponse.json(
      { success: true, data: avis || [] },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json(
      { success: false, data: [], error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
} 