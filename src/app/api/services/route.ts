import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Récupérer les services depuis Supabase
    const { data, error } = await supabase
      .from('services')
      .select('*')
    
    if (error) {
      console.error('❌ Erreur Supabase services:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur lors de la récupération des services',
          message: 'Service temporairement indisponible'
        }, 
        { status: 500 }
      )
    }
    
    // Retourner les données avec des headers masqués
    return NextResponse.json(
      { 
        success: true, 
        data: data || [],
        count: data?.length || 0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Powered-By': 'ZaLaMa API',
          'X-API-Version': '1.0',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Response-Time': Date.now().toString()
        }
      }
    )
    
  } catch (error) {
    console.error('💥 Erreur API services:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur',
        message: 'Une erreur inattendue s\'est produite'
      }, 
      { status: 500 }
    )
  }
}

// Gérer les requêtes OPTIONS pour CORS
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

