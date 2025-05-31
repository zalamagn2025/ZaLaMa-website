import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PartnershipData {
  companyName: string;
  legalRepresentative: string;
  position: string;
  headquartersAddress: string;
  phone: string;
  email: string;
  employeesCount: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Début de la requête partnership');
    
    const body: PartnershipData = await request.json();
    console.log('📝 Données reçues:', body);
    
    const {
      companyName,
      legalRepresentative,
      position,
      headquartersAddress,
      phone,
      email,
      employeesCount
    } = body;

    // Validation des données
    if (!companyName || !legalRepresentative || !position || !headquartersAddress || !phone || !email || !employeesCount) {
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
      throw new Error('Firebase non configuré');
    }

    // Sauvegarde dans Firestore
    console.log('💾 Tentative de sauvegarde dans Firestore...');
    const partnershipData = {
      companyName,
      legalRepresentative,
      position,
      headquartersAddress,
      phone,
      email,
      employeesCount: parseInt(employeesCount),
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'demandepartner'), partnershipData);
    console.log('✅ Document créé avec ID:', docRef.id);

    // Vérification de la configuration Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY manquante');
      throw new Error('Configuration Resend manquante');
    }

    console.log('📧 Envoi de l\'email admin...');
    // Email à l'admin
    const adminEmailResult = await resend.emails.send({
      from: 'noreply@zalamasas.com',
      to: [process.env.ADMIN_EMAIL || 'admin@zalamasas.com'],
      subject: `Nouvelle demande de partenariat - ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nouvelle demande de partenariat</h2>
          <p><strong>Entreprise:</strong> ${companyName}</p>
          <p><strong>Contact:</strong> ${legalRepresentative} (${position})</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Téléphone:</strong> ${phone}</p>
          <p><strong>Adresse:</strong> ${headquartersAddress}</p>
          <p><strong>Employés:</strong> ${employeesCount}</p>
          <p><strong>ID:</strong> ${docRef.id}</p>
        </div>
      `,
    });

    console.log('✅ Email admin envoyé:', adminEmailResult.data?.id);

    console.log('📧 Envoi de l\'email utilisateur...');
    // Email de confirmation à l'utilisateur
    const userEmailResult = await resend.emails.send({
      from: 'noreply@zalamasas.com',
      to: [email],
      subject: 'Confirmation de votre demande de partenariat - Zalama SAS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Confirmation de demande</h2>
          <p>Bonjour ${legalRepresentative},</p>
          <p>Nous avons bien reçu votre demande de partenariat pour <strong>${companyName}</strong>.</p>
          <p>Nous vous recontacterons sous 48-72h.</p>
          <p>Numéro de référence: ${docRef.id}</p>
        </div>
      `,
    });

    console.log('✅ Email utilisateur envoyé:', userEmailResult.data?.id);

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