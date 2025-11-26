import { NextRequest, NextResponse } from 'next/server'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token reCAPTCHA manquant' },
        { status: 400 }
      )
    }

    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded
      ? forwarded.split(',')[0]
      : request.headers.get('x-real-ip') || undefined

    const validation = await verifyRecaptchaToken(token, ip)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation reCAPTCHA échouée',
          details: validation['error-codes'],
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, score: validation.score })
  } catch (error) {
    console.error('Erreur verify-recaptcha:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

