import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/middleware/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    console.log('🔍 Récupération des informations pour UID:', user.uid);

    // Si les informations employé sont déjà dans le token
    if (user.employeId) {
      console.log('✅ Informations employé déjà dans le token');
      return NextResponse.json({ user });
    }

    // Sinon, récupérer depuis Firestore par UID
    console.log('📋 Recherche dans Firestore par userId...');
    const employesRef = collection(db, 'employes');
    const q = query(employesRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const employeDoc = querySnapshot.docs[0];
      const employeData = employeDoc.data();
      
      console.log('👤 Informations employé trouvées:', employeData.nomComplet);

      return NextResponse.json({
        user: {
          ...user,
          employeId: employeDoc.id,
          prenom: employeData.prenom,
          nom: employeData.nom,
          nomComplet: employeData.nomComplet,
          telephone: employeData.telephone,
          poste: employeData.poste,
          role: employeData.role,
          genre: employeData.genre,
          adresse: employeData.adresse,
          salaireNet: employeData.salaireNet,
          typeContrat: employeData.typeContrat,
          dateEmbauche: employeData.dateEmbauche,
          dateCreation: employeData.dateCreation,
          partenaireId: employeData.partenaireId,
          userId: employeData.userId
        }
      });
    }

    console.log('⚠️ Aucune information employé trouvée pour UID:', user.uid);
    // Retourner les informations Firebase Auth uniquement
    return NextResponse.json({ user });

  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 