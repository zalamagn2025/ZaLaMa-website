
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAdminEmailTemplate, getUserEmailTemplate } from './emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PartnershipData {
  companyName: string;
  legalStatus: string;
  rccm: string;
  nif: string;
  legalRepresentative: string;
  position: string;
  headquartersAddress: string;
  phone: string;
  email: string;
  employeesCount: string;
  payroll: string;
  cdiCount: string;
  cddCount: string;
  agreement: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Début de la requête partnership');
    
    let body: PartnershipData;
    try {
      body = await request.json();
      console.log('📝 Données reçues:', body);
    } catch (e) {
      console.log('❌ Erreur de parsing JSON:', e);
      return NextResponse.json(
        { error: 'Données JSON invalides' },
        { status: 400 }
      );
    }
    
    const {
      companyName,
      legalStatus,
      rccm,
      nif,
      legalRepresentative,
      position,
      headquartersAddress,
      phone,
      email,
      employeesCount,
      payroll,
      cdiCount,
      cddCount,
      agreement
    } = body;

    // Validation des données
    if (!companyName || !legalStatus || !rccm || !nif || !legalRepresentative || !position || !headquartersAddress || !phone || !email || !employeesCount || !payroll || !cdiCount || !cddCount || !agreement) {
      console.log('❌ Validation échouée - champs manquants');
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation échouée - email invalide');
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    console.log('✅ Validation réussie');

    // Vérification de la configuration Firebase
    if (!db) {
      console.error('❌ Firebase non configuré');
      return NextResponse.json(
        { error: 'Configuration Firebase manquante' },
        { status: 500 }
      );
    }

    // Sauvegarde dans Firestore
    console.log('💾 Tentative de sauvegarde dans Firestore...');
    const partnershipData = {
      companyName,
      legalStatus,
      rccm,
      nif,
      legalRepresentative,
      position,
      headquartersAddress,
      phone,
      email,
      employeesCount: parseInt(employeesCount),
      payroll,
      cdiCount: parseInt(cdiCount),
      cddCount: parseInt(cddCount),
      agreement,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    let docRef;
    try {
      docRef = await addDoc(collection(db, 'demandepartner'), partnershipData);
      console.log('✅ Document créé avec ID:', docRef.id);
    } catch (e) {
      console.error('❌ Erreur Firestore:', e);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des données' },
        { status: 500 }
      );
    }

    // Vérification de la configuration Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY manquante');
      return NextResponse.json(
        { error: 'Configuration Resend manquante' },
        { status: 500 }
      );
    }

    console.log('📧 Envoi de l\'email admin...');
    // Email à l'admin
    let adminEmailResult;
    try {
      adminEmailResult = await resend.emails.send({
        from: 'contact@zalamagn.com',
        to: [process.env.ADMIN_EMAIL || 'contact@zalamagn.com'],
        subject: `Nouvelle demande de partenariat - ${companyName}`,
        html: getAdminEmailTemplate({
          companyName,
          legalStatus,
          rccm,
          nif,
          legalRepresentative,
          position,
          headquartersAddress,
          phone,
          email,
          employeesCount,
          payroll,
          cdiCount,
          cddCount,
          docId: docRef.id
        })
      });
      console.log('✅ Email admin envoyé:', adminEmailResult.data?.id);
    } catch (e) {
      console.error('❌ Erreur envoi email admin:', e);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email admin' },
        { status: 500 }
      );
    }

    console.log('📧 Envoi de l\'email utilisateur...');
    // Email de confirmation à l'utilisateur
    let userEmailResult;
    try {
      userEmailResult = await resend.emails.send({
        from: 'contact@zalamagn.com',
        to: [email],
        subject: 'Confirmation de votre demande de partenariat - Zalama SAS',
        html: getUserEmailTemplate({
          legalRepresentative,
          companyName,
          docId: docRef.id
        })
      });
      console.log('✅ Email utilisateur envoyé:', userEmailResult.data?.id);
    } catch (e) {
      console.error('❌ Erreur envoi email utilisateur:', e);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email utilisateur' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Demande de partenariat soumise avec succès',
        id: docRef.id,
        emailsSent: {
          admin: !!adminEmailResult.data,
          user: !!userEmailResult.data
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('💥 Erreur détaillée:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
    
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
      },
      { status: 500 }
    );
  }
}
