import { NextRequest, NextResponse } from 'next/server';

// Domaines autorisés pour CORS
const allowedOrigins = [
  // Localhost (tous les ports)
  /^https?:\/\/localhost:\d+$/,
  /^https?:\/\/127\.0\.0\.1:\d+$/,
  /^https?:\/\/0\.0\.0\.0:\d+$/,
  
  // Domaines de production
  'https://zalamagn.com',
  'https://www.zalamagn.com',
  'http://zalamagn.com',
  'http://www.zalamagn.com',
  
  // Domaines de développement/staging
  'https://dev.zalamagn.com',
  'https://staging.zalamagn.com',
  
  // Localhost sans port (fallback)
  'http://localhost',
  'https://localhost',
];

/**
 * Vérifier si une origine est autorisée
 */
function isOriginAllowed(origin: string): boolean {
  return allowedOrigins.some(allowedOrigin => {
    if (typeof allowedOrigin === 'string') {
      return allowedOrigin === origin;
    }
    return allowedOrigin.test(origin);
  });
}

/**
 * Obtenir l'origine CORS appropriée
 */
function getCorsOrigin(request: NextRequest): string {
  const origin = request.headers.get('origin');
  
  if (!origin) {
    // Si pas d'origine, retourner l'origine par défaut
    return 'https://zalamagn.com';
  }
  
  if (isOriginAllowed(origin)) {
    return origin;
  }
  
  // En développement, accepter toutes les origines avec avertissement
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Origine non autorisée en développement: ${origin}`);
    return origin;
  }
  
  // En production, retourner l'origine par défaut
  return 'https://zalamagn.com';
}

/**
 * Obtenir les headers CORS dynamiques
 */
export function getCorsHeaders(request: NextRequest) {
  const origin = getCorsOrigin(request);
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Headers CORS statiques (fallback)
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

/**
 * Créer une réponse avec CORS
 */
export function createCorsResponse(data: any, status: number = 200, request?: NextRequest) {
  const headers = request ? getCorsHeaders(request) : corsHeaders;
  return NextResponse.json(data, { status, headers });
}

/**
 * Gérer les requêtes OPTIONS (preflight)
 */
export function handleOptions(request?: NextRequest) {
  const headers = request ? getCorsHeaders(request) : corsHeaders;
  return new NextResponse(null, { status: 200, headers });
}

/**
 * Wrapper pour les handlers avec CORS automatique
 */
export function withCors(handler: Function) {
  return async (request: NextRequest) => {
    // Gérer les requêtes OPTIONS
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    
    try {
      const response = await handler(request);
      
      // Ajouter les headers CORS à la réponse
      const corsHeaders = getCorsHeaders(request);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      console.error('❌ Erreur dans le handler:', error);
      return createCorsResponse(
        { error: 'Erreur interne du serveur' },
        500,
        request
      );
    }
  };
}
