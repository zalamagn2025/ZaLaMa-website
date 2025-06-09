import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // Récupérer d'abord les données de l'employé pour vérifier le salaire
    console.log('🔍 Recherche des données employé pour validation:', employeId);
    const employeDocValidation = await getDoc(doc(db, 'employes', employeId));
    const employeDataValidation = employeDocValidation.data();
    
    if (!employeDocValidation.exists() || !employeDataValidation?.salaireNet) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Données employé introuvables ou salaire non défini' 
        },
        { status: 400 }
      );
    }

    const salaireNet = employeDataValidation.salaireNet;
    const maxAvanceMonthly = Math.floor(salaireNet * 0.25); // 25% du salaire mensuel

    // Vérifier le total des demandes approuvées ce mois-ci
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
    
    // Calculer le total des avances approuvées ce mois-ci
    let totalAvancesApprouvees = 0;
    monthlyApprovedSnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalAvancesApprouvees += data.montantDemande || 0;
    });

    // Vérifier si la nouvelle demande + total existant dépasse 25%
    const nouvelleDemande = parseFloat(montantDemande);
    const totalApresNouvelleDemande = totalAvancesApprouvees + nouvelleDemande;
    
    console.log('💰 Vérification des limites:', {
      salaireNet,
      maxAvanceMonthly,
      totalAvancesApprouvees,
      nouvelleDemande,
      totalApresNouvelleDemande
    });

    if (totalApresNouvelleDemande > maxAvanceMonthly) {
      const avanceDisponible = maxAvanceMonthly - totalAvancesApprouvees;
      return NextResponse.json(
        { 
          success: false, 
          message: `Cette demande dépasse votre limite mensuelle. Avance disponible ce mois-ci: ${avanceDisponible.toLocaleString()} GNF (déjà utilisé: ${totalAvancesApprouvees.toLocaleString()} GNF sur ${maxAvanceMonthly.toLocaleString()} GNF)` 
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
    console.log('🔍 Recherche des données employé pour employeId:', employeId);
    const employeDoc = await getDoc(doc(db, 'employes', employeId));
    const employeData = employeDoc.data();
    
    console.log('📄 Document employé trouvé:', employeDoc.exists());
    console.log('📋 Données employé brutes:', employeData);
    console.log('✉️ Email présent:', !!employeData?.email, employeData?.email);
    console.log('👤 Nom présent:', !!employeData?.nom, employeData?.nom);

    if (employeData?.email && employeData?.nom) {
      // Vérification de la configuration Resend
      if (!process.env.RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY manquante');
        throw new Error('Configuration Resend manquante');
      }

      try {
        console.log('📧 Envoi de l\'email admin...');
        console.log('🔧 Configuration Resend OK, clé API présente');
        console.log('👤 Données utilisateur:', { email: employeData.email, nom: employeData.nom });
        
        // Email à l'admin
        const adminEmailResult = await resend.emails.send({
          from: 'contact@zalamagn.com',
          to: ['contact@zalamagn.com'],
          subject: `Nouvelle demande d'avance - ${employeData.nom}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Nouvelle demande d'avance</h2>
              <p><strong>Employé:</strong> ${employeData.nom}</p>
              <p><strong>Email:</strong> ${employeData.email}</p>
              <p><strong>Montant:</strong> ${Number(montantDemande).toLocaleString('fr-FR')} GNF</p>
              <p><strong>Motif:</strong> ${motif}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
              <p><strong>ID de la demande:</strong> ${docRef.id}</p>
              <br>
              <p>Veuillez vous connecter au système pour traiter cette demande.</p>
            </div>
          `,
        });

        console.log('✅ Email admin envoyé:', adminEmailResult.data?.id);
        console.log('📊 Réponse complète admin:', JSON.stringify(adminEmailResult, null, 2));

        console.log('📧 Envoi de l\'email employé...');
        // Email de confirmation à l'employé
        const userEmailResult = await resend.emails.send({
          from: 'contact@zalamagn.com',
          to: [employeData.email],
          subject: 'Confirmation de votre demande d\'avance - Zalama SAS',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Demande d'avance reçue</h2>
              <p>Bonjour ${employeData.nom},</p>
              <p>Votre demande d'avance de <strong>${Number(montantDemande).toLocaleString('fr-FR')} GNF</strong> a été reçue avec succès.</p>
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
        console.log('📊 Réponse complète employé:', JSON.stringify(userEmailResult, null, 2));

        return NextResponse.json({
          success: true,
          message: "Demande d'avance créée avec succès",
          requestId: docRef.id,
          emailsSent: {
            admin: !!adminEmailResult.data,
            user: !!userEmailResult.data
          }
        });

      } catch (emailError) {
        console.error('💥 Erreur spécifique lors de l\'envoi d\'emails:', emailError);
        console.error('📋 Détails de l\'erreur email:', {
          message: emailError instanceof Error ? emailError.message : String(emailError),
          stack: emailError instanceof Error ? emailError.stack : undefined,
          name: emailError instanceof Error ? emailError.name : undefined
        });
        
        // Retourner le succès même si l'email échoue, mais avec les détails
        return NextResponse.json({
          success: true,
          message: "Demande d'avance créée avec succès (erreur d'envoi d'emails)",
          requestId: docRef.id,
          emailsSent: {
            admin: false,
            user: false
          },
          emailError: process.env.NODE_ENV === 'development' ? emailError instanceof Error ? emailError.message : String(emailError) : 'Erreur d\'envoi d\'email'
        });
      }
    } else {
      console.log('❌ Données employé manquantes:', { 
        hasEmail: !!employeData?.email, 
        hasNom: !!employeData?.nom,
        employeData: employeData ? Object.keys(employeData) : 'employeData undefined'
      });
      
      // Si pas d'email, retourner quand même le succès
      return NextResponse.json({
        success: true,
        message: "Demande d'avance créée avec succès (emails non envoyés - données utilisateur manquantes)",
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
    const action = searchParams.get('action');

    if (!employeId) {
      return NextResponse.json(
        { success: false, message: 'ID employé requis.' },
        { status: 400 }
      );
    }

    // Si demande d'avance disponible
    if (action === 'available-advance') {
      // Récupérer les données de l'employé
      const employeDoc = await getDoc(doc(db, 'employes', employeId));
      const employeData = employeDoc.data();
      
      if (!employeDoc.exists() || !employeData?.salaireNet) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Données employé introuvables ou salaire non défini' 
          },
          { status: 400 }
        );
      }

      const salaireNet = employeData.salaireNet;
      const maxAvanceMonthly = Math.floor(salaireNet * 0.25);

      // Calculer le total des avances approuvées ce mois-ci
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
      
      let totalAvancesApprouvees = 0;
      monthlyApprovedSnapshot.docs.forEach(doc => {
        const data = doc.data();
        totalAvancesApprouvees += data.montantDemande || 0;
      });

      const avanceDisponible = maxAvanceMonthly - totalAvancesApprouvees;

      return NextResponse.json({
        success: true,
        salaireNet,
        maxAvanceMonthly,
        totalAvancesApprouvees,
        avanceDisponible: Math.max(0, avanceDisponible)
      });
    }

    // Récupérer les demandes d'avance de l'employé (comportement par défaut)
    const requestsQuery = query(
      collection(db, 'salary_advance_requests'),
      where('employeId', '==', employeId),
      orderBy('dateCreation', 'desc')
    );

    const snapshot = await getDocs(requestsQuery);
    
    let demandes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{ id: string; dateCreation: string; [key: string]: string }>;

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