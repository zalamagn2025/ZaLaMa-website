import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  
  try {
    const body = await request.json();
    const { email } = body;

    // Validation des données
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Simulation d'envoi d'email pour tester
    
    return NextResponse.json({
      success: true,
      message: 'Email de réinitialisation envoyé avec succès (simulation)'
    });

  } catch (error) {
    console.error('Erreur dans send-reset-email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}