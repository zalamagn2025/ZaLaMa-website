import { NextRequest, NextResponse } from 'next/server'
import { smsAnalytics } from '@/utils/smsAnalytics'

export async function GET(request: NextRequest) {
  try {
    const analytics = smsAnalytics.getAnalytics();
    const healthStatus = smsAnalytics.getHealthStatus();
    
    return NextResponse.json({
      success: true,
      data: {
        analytics,
        healthStatus,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération analytics SMS:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'reset') {
      smsAnalytics.resetAnalytics();
      return NextResponse.json({
        success: true,
        message: 'Analytics SMS réinitialisés'
      });
    }
    
    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('❌ Erreur action analytics SMS:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'action' },
      { status: 500 }
    );
  }
} 