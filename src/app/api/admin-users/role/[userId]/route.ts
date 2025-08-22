import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    console.log('🔍 Récupération du rôle pour user_id:', userId);

    // Récupérer le rôle depuis la table admin_users
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.log('❌ Erreur lors de la récupération du rôle:', error);
      return NextResponse.json(
        { success: false, error: 'Rôle non trouvé' },
        { status: 404 }
      );
    }

    if (!adminUser) {
      console.log('❌ Aucun rôle trouvé pour user_id:', userId);
      return NextResponse.json(
        { success: false, error: 'Rôle non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ Rôle récupéré:', adminUser.role);

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
