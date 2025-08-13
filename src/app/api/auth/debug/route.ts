import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { createCorsResponse, handleOptions } from '@/lib/cors';

// Gestion CORS pour les requêtes OPTIONS
export async function OPTIONS(request: NextRequest) {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Route de diagnostic appelée...');
    
    // Vérifier que JWT_SECRET est défini
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET n\'est pas défini');
      return createCorsResponse(
        { error: 'Configuration serveur manquante' },
        500
      );
    }

    // Récupérer le token depuis les headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createCorsResponse(
        { error: 'Token d\'authentification manquant' },
        401
      );
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token JWT
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET) as any;
      console.log('✅ Token JWT vérifié pour:', decodedToken.email);
    } catch (jwtError) {
      console.error('❌ Erreur de vérification JWT:', jwtError);
      return createCorsResponse(
        { error: 'Token invalide ou expiré' },
        401
      );
    }

    // Retourner les informations de diagnostic
    return createCorsResponse({
      success: true,
      message: 'Route de diagnostic accessible',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.emailVerified,
        employeeId: decodedToken.employeeId || null,
        prenom: decodedToken.prenom || null,
        nom: decodedToken.nom || null,
        role: decodedToken.role || null
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });

  } catch (error: unknown) {
    console.error('💥 Erreur lors de l\'appel debug:', error);
    
    return createCorsResponse(
      { error: 'Erreur interne du serveur' },
      500
    );
  }
}
