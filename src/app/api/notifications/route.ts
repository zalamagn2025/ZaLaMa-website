import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list'

    // Construire l'URL de l'Edge Function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notifications/${action}`
    
    // Préparer les paramètres de requête
    const url = new URL(edgeFunctionUrl)
    if (action === 'list') {
      url.searchParams.set('limit', searchParams.get('limit') || '20')
      url.searchParams.set('offset', searchParams.get('offset') || '0')
      url.searchParams.set('unread_only', searchParams.get('unread_only') || 'false')
    } else if (action === 'get') {
      url.searchParams.set('id', searchParams.get('id') || '')
    }

    // Appeler l'Edge Function
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || 'Erreur de l\'Edge Function' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur dans le proxy notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'mark-read'

    // Construire l'URL de l'Edge Function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notifications/${action}`
    
    // Récupérer le body de la requête
    const body = await request.json()

    // Appeler l'Edge Function
    const response = await fetch(edgeFunctionUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || 'Erreur de l\'Edge Function' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur dans le proxy notifications PUT:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'delete'

    // Construire l'URL de l'Edge Function
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/notifications/${action}`
    
    // Récupérer le body de la requête
    const body = await request.json()

    // Appeler l'Edge Function
    const response = await fetch(edgeFunctionUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || 'Erreur de l\'Edge Function' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur dans le proxy notifications DELETE:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}