import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Données reçues pour l\'historique:', body)
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Token d\'authentification manquant')
      return NextResponse.json(
        { error: 'Token d\'authentification manquant' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔑 Token extrait:', token.substring(0, 20) + '...')
    
    // Appel à l'edge function employee-withdrawal
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      console.error('❌ Configuration Supabase manquante')
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      )
    }

    const functionUrl = `${supabaseUrl}/functions/v1/employee-withdrawal`
    console.log('🌐 URL de l\'edge function:', functionUrl)
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    console.log('📤 Statut de la réponse:', response.status)
    console.log('📤 Headers de la réponse:', Object.fromEntries(response.headers.entries()))

    const data = await response.json()
    console.log('📥 Données de la réponse:', data)

    if (!response.ok) {
      console.error('❌ Erreur de l\'edge function:', data)
      return NextResponse.json(
        { 
          error: data.message || data.error || 'Erreur lors de la récupération de l\'historique',
          details: data
        },
        { status: response.status }
      )
    }

    console.log('✅ Historique récupéré avec succès:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Erreur dans l\'API withdrawal-history:', error)
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
