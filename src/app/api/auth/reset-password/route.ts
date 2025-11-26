import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword, confirmPassword, recaptchaToken } = body;

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded
      ? forwarded.split(',')[0]
      : request.headers.get('x-real-ip') || undefined;

    const captchaResult = await verifyRecaptchaToken(recaptchaToken, ip);
    if (!captchaResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation reCAPTCHA nécessaire',
          details: captchaResult['error-codes'],
        },
        { status: 400 }
      );
    }

    // Validation des données
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token de réinitialisation requis' },
        { status: 400 }
      );
    }

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Nouveau code PIN requis' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Les codes PIN ne correspondent pas' },
        { status: 400 }
      );
    }

    // Validation du format PIN (6 chiffres)
    if (!/^\d{6}$/.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: 'Le code PIN doit contenir exactement 6 chiffres' },
        { status: 400 }
      );
    }

    // Appel à l'edge function employe-auth pour la réinitialisation
    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/employe-auth`;
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        action: 'reset_password_confirm',
        token: token,
        newPassword: newPassword
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur edge function:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.error || 'Erreur lors de la réinitialisation du code PIN' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code PIN réinitialisé avec succès'
    });

  } catch (error) {
    console.error('Erreur dans reset-password:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}