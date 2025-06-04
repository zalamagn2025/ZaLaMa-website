import { db } from '@/lib/firebase';
import { Partenaire } from '@/types/partenaire';
import { doc, getDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<Partenaire | { error: string }>> {
  try {
    const { id } = await context.params;
    console.log('🔍 Récupération du partenaire ID:', id);

    // Validation de l'ID
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      console.log('❌ ID invalide');
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    // Récupérer le document partenaire
    const partenaireRef = doc(db, 'partenaires', id);
    const partenaireSnap = await getDoc(partenaireRef);

    if (!partenaireSnap.exists()) {
      console.log('❌ Partenaire non trouvé');
      return NextResponse.json({ error: 'Partenaire non trouvé' }, { status: 404 });
    }

    const partenaireData: Partenaire = {
      id: partenaireSnap.id,
      ...partenaireSnap.data(),
    } as Partenaire;

    console.log('✅ Partenaire récupéré:', partenaireData.nom);
    return NextResponse.json(partenaireData);
  } catch (error) {
    console.error('💥 Erreur lors de la récupération du partenaire:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Erreur serveur: ${error.message}`
            : 'Erreur serveur inconnue',
      },
      { status: 500 }
    );
  }
}

// Optionnel : Activer la mise en cache pour réduire les lectures Firestore
export const revalidate = 3600; // Revalider toutes les heures