import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { createCorsResponse, handleOptions } from '@/lib/cors'

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
    // Vérifier d'abord le cookie auth-token
    let authToken = request.cookies.get('auth-token')?.value
    
    // Si pas de cookie, vérifier le header Authorization
    if (!authToken) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.replace('Bearer ', '')
      }
    }
    
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

// Fonction pour récupérer les informations de limite d'avis par jour
async function getDailyAvisLimit(supabase: any, employeeId: string): Promise<{ currentCount: number; limit: number; remaining: number; canPost: boolean }> {
  try {
    console.log('🔍 Récupération des informations de limite d\'avis quotidienne...')
    
    // Obtenir la date d'aujourd'hui (début et fin de journée)
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0).toISOString()
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString()
    
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
    const remaining = Math.max(0, MAX_AVIS_PER_DAY - currentCount)
    const canPost = currentCount < MAX_AVIS_PER_DAY
    
    console.log(`📊 Limite d'avis: ${currentCount}/${MAX_AVIS_PER_DAY} - Restant: ${remaining} - Peut poster: ${canPost}`)
    
    return {
      currentCount,
      limit: MAX_AVIS_PER_DAY,
      remaining,
      canPost
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la limite:', error)
    throw error
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🔧 GET /api/avis/limit - Début de la requête')
    
    // Vérifier l'authentification via JWT
    const userData = verifyAuthToken(request)
    if (!userData) {
      return createCorsResponse(
        { success: false, error: 'Non autorisé' },
        401,
        request
      )
    }

    console.log('✅ Utilisateur authentifié:', userData.email)

    // Créer le client Supabase
    let supabase
    try {
      supabase = createSupabaseClient()
      console.log('✅ Client Supabase créé avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la création du client Supabase:', error)
      return createCorsResponse(
        { success: false, error: 'Erreur de configuration Supabase' },
        500,
        request
      )
    }

    // Récupérer l'employé
    console.log('👤 Recherche de l\'employé...')
    
    try {
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('user_id', userData.uid)
        .single()

      if (employeeError || !employee) {
        console.error('❌ Erreur lors de la récupération de l\'employé:', employeeError)
        return createCorsResponse(
          { success: false, error: 'Employé non trouvé' },
          404,
          request
        )
      }

      console.log('✅ Employé trouvé:', employee.id)

      // Récupérer les informations de limite
      const limitInfo = await getDailyAvisLimit(supabase, employee.id)
      
      return createCorsResponse(
        { 
          success: true, 
          data: limitInfo
        },
        200,
        request
      )

    } catch (error) {
      console.error('💥 Erreur lors de la récupération des informations de limite:', error)
      return createCorsResponse(
        { success: false, error: 'Erreur interne du serveur' },
        500,
        request
      )
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error)
    return createCorsResponse(
      { success: false, error: 'Erreur interne du serveur' },
      500,
      request
    )
  }
} 