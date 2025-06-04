import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Partenaire } from '@/types/partenaire';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } // Correct typing for dynamic route params
): Promise<NextResponse<Partenaire | { error: string }>> {
  try {
    console.log('🔍 Récupération du partenaire ID:', context.params.id);

    // Temporarily disable auth verification
    // const token = request.cookies.get('token')?.value
    // if (!token) {
    //   console.log('❌ Token manquant');
    //   return NextResponse.json(
    //     { error: 'Non authentifié' },
    //     { status: 401 }
    //   );
    // }

    // Fetch the partenaire document
    const partenaireRef = doc(db, 'partenaires', context.params.id);
    const partenaireSnap = await getDoc(partenaireRef);

    if (!partenaireSnap.exists()) {
      console.log('❌ Partenaire non trouvé');
      return NextResponse.json(
        { error: 'Partenaire non trouvé' },
        { status: 404 }
      );
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
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}