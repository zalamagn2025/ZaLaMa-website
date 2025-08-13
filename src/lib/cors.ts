import { NextResponse } from 'next/server';

// Configuration CORS pour les API routes temporaires
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Fonction pour créer une réponse CORS
export function createCorsResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders,
  });
}

// Fonction pour gérer les requêtes OPTIONS (preflight)
export function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
