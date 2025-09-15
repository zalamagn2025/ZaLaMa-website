import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Récupérer le rôle depuis la table admin_users
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Rôle non trouvé' },
        { status: 404 }
      );
    }

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Rôle non trouvé' },
        { status: 404 }
      );
    }


    return NextResponse.json({
      success: true,
      role: adminUser.role
    });

  } catch (error) {
    console.error('💥 Erreur lors de la récupération du rôle:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
