import { Resend } from 'resend';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Nouveau message de contact...');
    
    const body: ContactData = await request.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validation des données
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    console.log('✅ Validation réussie pour:', email);

    // Créer le client Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PRIVATE_SUPABASE_URL!,
      process.env.NEXT_PRIVATE_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Stocker le message dans Supabase
    console.log('💾 Stockage du message dans Supabase...');
    const contactData = {
      nom: firstName,
      prenom: lastName,
      email,
      sujet: subject,
      message,
      date_creation: new Date().toISOString(),
      statut: 'nouveau' // nouveau, lu, repondu, archive
    };

    const { data: savedContact, error: saveError } = await supabase
      .from('contacts')
      .insert(contactData)
      .select()
      .single();

    if (saveError) {
      console.error('❌ Erreur lors du stockage dans Supabase:', saveError);
      // On continue quand même pour envoyer l'email
    } else {
      console.log('✅ Message stocké dans Supabase avec ID:', savedContact.id);
    }

    // Envoi de l'email
    console.log('📤 Envoi de l\'email...');
    const { data, error } = await resend.emails.send({
      from: 'contact@zalamagn.com',
      to: ['contact@zalamagn.com'], // Email de destination
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Informations du contact</h3>
            <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
            ${savedContact ? `<p><strong>ID Contact:</strong> ${savedContact.id}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Ce message a été envoyé depuis le formulaire de contact du site web Zalama SAS.</p>
          </div>
        </div>
      `,
      replyTo: email, // Permet de répondre directement au client
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    console.log('✅ Email envoyé avec succès, ID:', data?.id);

    return NextResponse.json(
      { 
        message: 'Message envoyé avec succès', 
        id: data?.id,
        contactId: savedContact?.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('💥 Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 