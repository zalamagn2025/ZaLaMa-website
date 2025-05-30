import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { UserWithEmployeData } from '@/types/employe';

export function verifyToken(token: string): UserWithEmployeData | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non configuré');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'zalamasas.com',
      audience: 'zalamasas-employes'
    }) as UserWithEmployeData;

    return decoded;
  } catch (error) {
    console.error('❌ Token invalide:', error);
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get('auth-token')?.value;
  return token || null;
}

export function getUserFromRequest(request: NextRequest): UserWithEmployeData | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return verifyToken(token);
} 