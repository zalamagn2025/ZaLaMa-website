import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Débogage : afficher les données reçues
    console.log('📦 Données reçues:', body);
    
    const { 
      employeId, 
      montantDemande, 
      motif, 
      numeroReception, 
      fraisService, 
      montantTotal,
      salaireDisponible,
      avanceDisponible,
      statut,
      entrepriseId 
    } = body;

    // Débogage détaillé
    console.log('employeId:', employeId);
    console.log('montantDemande:', montantDemande);
    console.log('motif:', motif);

    // Validation des données
    if (!employeId || !montantDemande || !motif) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tous les champs sont requis',
          debug: { employeId: !!employeId, montantDemande: !!montantDemande, motif: !!motif }
        },
        { status: 400 }
      );
    }

    if (parseFloat(montantDemande) <= 0) {
      return NextResponse.json(
        { success: false, message: 'Le montant doit être supérieur à 0' },
        { status: 400 }
      );
    }

    // Vérifier s'il y a déjà une demande approuvée ce mois-ci
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);

    const monthlyApprovedQuery = query(
      collection(db, 'salary_advance_requests'),
      where('employeId', '==', employeId),
      where('statut', '==', 'approuve'),
      where('dateTraitement', '>=', startOfMonth),
      where('dateTraitement', '<=', endOfMonth)
    );
    
    const monthlyApprovedSnapshot = await getDocs(monthlyApprovedQuery);
    
    if (!monthlyApprovedSnapshot.empty) {
      const existingRequest = monthlyApprovedSnapshot.docs[0].data();
      const approvalDate = existingRequest.dateTraitement?.toDate();
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Vous avez déjà une demande d'avance approuvée ce mois-ci (${approvalDate?.toLocaleDateString('fr-FR')}). Vous ne pouvez faire qu'une demande approuvée par mois.` 
        },
        { status: 400 }
      );
    }

    // Vérifier s'il y a déjà une demande en attente
    const pendingRequestQuery = query(
      collection(db, 'salary_advance_requests'),
      where('employeId', '==', employeId),
      where('statut', '==', 'EN_ATTENTE')
    );
    
    const pendingRequestSnapshot = await getDocs(pendingRequestQuery);
    
    if (!pendingRequestSnapshot.empty) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Vous avez déjà une demande d\'avance en attente. Veuillez attendre le traitement de votre demande précédente.' 
        },
        { status: 400 }
      );
    }

    // Sauvegarde dans Firestore avec tous les champs du frontend
    const requestData = {
      employeId,
      montantDemande: parseFloat(montantDemande),
      motif: motif.trim(),
      numeroReception,
      fraisService,
      montantTotal,
      salaireDisponible,
      avanceDisponible,
      statut: statut || 'EN_ATTENTE',
      entrepriseId,
      dateCreation: serverTimestamp(),
      dateModification: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'salary_advance_requests'), requestData);
    console.log('✅ Demande créée avec ID:', docRef.id);

    // Récupérer les infos de l'employé pour l'email
    const userDoc = await getDoc(doc(db, 'users', employeId));
    const userData = userDoc.data();

    if (userData?.email && userData?.nom) {
      // Vérification de la configuration Resend
      if (!process.env.RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY manquante');
        throw new Error('Configuration Resend manquante');
      }

      console.log('📧 Envoi de l\'email admin...');
      // Email à l'admin
      const adminEmailResult = await resend.emails.send({
        from: 'contact@zalamagn.com',
        to: ['contact@zalamagn.com'],
        subject: `Nouvelle demande d'avance - ${userData.nom}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Nouvelle demande d'avance</h2>
            <p><strong>Employé:</strong> ${userData.nom}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Montant:</strong> ${montantDemande.toLocaleString()} GNF</p>
            <p><strong>Motif:</strong> ${motif}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
            <p><strong>ID de la demande:</strong> ${docRef.id}</p>
            <br>
            <p>Veuillez vous connecter au système pour traiter cette demande.</p>
          </div>
        `,
      });

      console.log('✅ Email admin envoyé:', adminEmailResult.data?.id);

      console.log('📧 Envoi de l\'email employé...');
      // Email de confirmation à l'employé
      const userEmailResult = await resend.emails.send({
        from: 'contact@zalamagn.com',
        to: [userData.email],
        subject: 'Confirmation de votre demande d\'avance - Zalama SAS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Demande d'avance reçue</h2>
            <p>Bonjour ${userData.nom},</p>
            <p>Votre demande d'avance de <strong>${montantDemande.toLocaleString()} GNF</strong> a été reçue avec succès.</p>
            <p><strong>Motif:</strong> ${motif}</p>
            <p>Elle sera examinée dans les plus brefs délais par notre équipe RH.</p>
            <p>Vous recevrez une notification dès qu'une décision sera prise.</p>
            <p>Numéro de référence: ${docRef.id}</p>
            <br>
            <p>Cordialement,<br>L'équipe RH - Zalama SAS</p>
          </div>
        `,
      });

      console.log('✅ Email employé envoyé:', userEmailResult.data?.id);

      return NextResponse.json({
        success: true,
        message: "Demande d'avance créée avec succès",
        requestId: docRef.id,
        emailsSent: {
          admin: !!adminEmailResult.data,
          user: !!userEmailResult.data
        }
      });
    } else {
      // Si pas d'email, retourner quand même le succès
      return NextResponse.json({
        success: true,
        message: "Demande d'avance créée avec succès (emails non envoyés)",
        requestId: docRef.id,
        emailsSent: {
          admin: false,
          user: false
        }
      });
    }

  } catch (error) {
    console.error('💥 Erreur détaillée:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erreur interne du serveur',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeId = searchParams.get('employeId');

    if (!employeId) {
      return NextResponse.json(
        { success: false, message: 'ID employé requis.' },
        { status: 400 }
      );
    }

    // Récupérer les demandes d'avance de l'employé
    const requestsQuery = query(
      collection(db, 'salary_advance_requests'),
      where('employeId', '==', employeId),
      orderBy('dateCreation', 'desc')
    );

    const snapshot = await getDocs(requestsQuery);
    
    let demandes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{ id: string; dateCreation: string; [key: string]: any }>;

    // Trier par date côté client pour éviter l'index composite
    demandes = demandes.sort((a, b) => 
      new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    );

    return NextResponse.json({
      success: true,
      demandes
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de la récupération des demandes',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
    }, { status: 500 });
  }
} 