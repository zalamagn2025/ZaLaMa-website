import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import jwt from 'jsonwebtoken';

interface LoginData {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Tentative de connexion avec Firebase Auth...');
    
    const body: LoginData = await request.json();
    const { email, password } = body;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier que JWT_SECRET est défini
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET n\'est pas défini');
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    console.log('🔍 Authentification Firebase pour:', email);

    // Authentification avec Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    console.log('✅ Authentification Firebase réussie pour UID:', firebaseUser.uid);

    // Récupérer les informations complémentaires depuis la collection employes par UID
    console.log('📋 Recherche des informations employé par UID...');
    const employesRef = collection(db, 'employes');
    const q = query(employesRef, where('userId', '==', firebaseUser.uid));
    const querySnapshot = await getDocs(q);

    let employeData = null;
    let employeDocRef = null;
    let employeDocId = null;

    if (!querySnapshot.empty) {
      const employeDoc = querySnapshot.docs[0];
      employeData = employeDoc.data();
      employeDocRef = employeDoc.ref;
      employeDocId = employeDoc.id;
      console.log('👤 Informations employé trouvées:', employeData.nomComplet || `${employeData.prenom} ${employeData.nom}`);
    } else {
      console.log('⚠️ Aucune information employé trouvée pour UID:', firebaseUser.uid);
      console.log('💡 Vérifiez que le champ userId dans la collection employes correspond à l\'UID Firebase');
    }

    // Créer un token JWT avec toutes les informations disponibles
    const tokenPayload = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified,
      // Informations depuis la collection employes (si disponibles)
      ...(employeData && {
        employeId: employeDocId,
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
        partenaireId: employeData.partenaireId,
        userId: employeData.userId
      })
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d',
        issuer: 'zalamasas.com',
        audience: 'zalamasas-employes'
      }
    );

    // Mettre à jour la dernière connexion dans la collection employes (si elle existe)
    if (employeDocRef) {
      await updateDoc(employeDocRef, {
        lastLogin: new Date(),
        dateModification: new Date()
      });
    }

    const response = NextResponse.json(
      { 
        message: 'Connexion réussie',
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          // Informations employé (si disponibles)
          ...(employeData && {
            employeId: employeDocId,
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
            partenaireId: employeData.partenaireId
          })
        }
      },
      { status: 200 }
    );

    // Définir le cookie avec le token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    });

    return response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: unknown) {
    console.error('💥 Erreur lors de la connexion:', error);
    
    // Gestion des erreurs Firebase Auth spécifiques
    let errorMessage = 'Erreur interne du serveur';
    
    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cet email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Format d\'email invalide';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Identifiants invalides';
          break;
        default:
          errorMessage = 'Identifiants invalides';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
} 