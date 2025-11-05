import { NextRequest, NextResponse } from 'next/server'

// URL de l'Edge Function
const SUPABASE_EDGE_FUNCTION_URL = 'https://mspmrzlqhwpdkkburjiw.supabase.co/functions/v1/account-management'

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    // Validation des données
    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Action requise',
        details: ['Le paramètre "action" est obligatoire']
      }, { status: 400 })
    }

    // Préparer les données pour l'Edge Function
    const edgeFunctionData = {
      action,
      data
    }

    // Configuration du timeout (30 secondes)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    // Préparer les headers pour l'Edge Function
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    }

    // Transmettre le token d'authentification utilisateur si présent et si nécessaire
    const userAuthHeader = request.headers.get('Authorization')
    const publicActions = ['get_accounts', 'verify_pin', 'update_last_login', 'remove_account']
    
    console.log('🔍 API Route Debug:', {
      action,
      hasUserAuthHeader: !!userAuthHeader,
      isPublicAction: publicActions.includes(action),
      willSendUserAuth: userAuthHeader && !publicActions.includes(action)
    })
    
    if (userAuthHeader && !publicActions.includes(action)) {
      headers['X-User-Authorization'] = userAuthHeader
    } else {
      console.log('🚫 Pas d\'envoi du token utilisateur (action publique)')
    }

    let response
    try {
      response = await fetch(SUPABASE_EDGE_FUNCTION_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(edgeFunctionData),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('❌ Erreur de connexion avec l\'Edge Function:', fetchError)
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: 'Timeout de connexion',
          details: ['L\'Edge Function n\'a pas répondu dans les 30 secondes'],
          debug: 'Connection timeout'
        }, { status: 408 })
      }
      
      return NextResponse.json({
        success: false,
        error: 'Erreur de connexion',
        details: ['Impossible de joindre l\'Edge Function'],
        debug: fetchError instanceof Error ? fetchError.message : 'Erreur inconnue'
      }, { status: 503 })
    }

    let result
    try {
      result = await response.json()
    } catch (parseError) {
      console.error('❌ Erreur de parsing JSON de l\'Edge Function:', parseError)
      return NextResponse.json({
        success: false,
        error: 'Réponse invalide de l\'Edge Function',
        details: ['L\'Edge Function a retourné une réponse non-JSON'],
        debug: `Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`
      }, { status: 502 })
    }

    if (!response.ok) {
      console.error('❌ Edge Function error:', {
        status: response.status,
        result: result
      })
      
      return NextResponse.json({
        success: false,
        error: result.error || 'Erreur lors de la requête',
        details: result.details || [],
        debug: {
          edgeFunctionStatus: response.status,
          edgeFunctionResponse: result
        }
      }, { status: response.status })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Erreur dans l\'API route account-management:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur interne du serveur',
      details: ['Erreur de traitement de la requête'],
      debug: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 })
  }
}

// Gérer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Méthode non autorisée',
    details: ['Seule la méthode POST est supportée']
  }, { status: 405 })
}
