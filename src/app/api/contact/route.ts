import { Resend } from "resend";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

// Rate limiting simple en mémoire (en production, utilisez Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuration de sécurité
const SECURITY_CONFIG = {
  MAX_REQUESTS_PER_HOUR: 3, // Maximum 3 messages par heure par IP
  MAX_MESSAGE_LENGTH: 2000, // Maximum 2000 caractères
  MIN_MESSAGE_LENGTH: 10, // Minimum 10 caractères
  BLOCKED_DOMAINS: [
    "mailinator.com",
    "tempmail.org",
    "10minutemail.com",
    "guerrillamail.com",
  ], // Domaines temporaires
  ALLOWED_DOMAINS: [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "zalamagn.com",
  ], // Domaines autorisés
  MAX_SUBJECT_LENGTH: 100,
  MIN_SUBJECT_LENGTH: 3,
  COOLDOWN_MINUTES: 60, // Délai entre les messages
};

// Fonction de validation de sécurité
function validateSecurity(
  email: string,
  message: string,
  subject: string,
  ip: string
): { valid: boolean; error?: string } {
  // Vérification du domaine de l'email
  const emailDomain = email.split("@")[1]?.toLowerCase();

  if (!emailDomain) {
    return { valid: false, error: "Format d'email invalide" };
  }

  // Bloquer les domaines temporaires
  if (
    SECURITY_CONFIG.BLOCKED_DOMAINS.some((domain) =>
      emailDomain.includes(domain)
    )
  ) {
    return {
      valid: false,
      error: "Les emails temporaires ne sont pas autorisés",
    };
  }

  // Vérifier la longueur du message
  if (message.length > SECURITY_CONFIG.MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Le message ne peut pas dépasser ${SECURITY_CONFIG.MAX_MESSAGE_LENGTH} caractères`,
    };
  }

  if (message.length < SECURITY_CONFIG.MIN_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Le message doit contenir au moins ${SECURITY_CONFIG.MIN_MESSAGE_LENGTH} caractères`,
    };
  }

  // Vérifier la longueur du sujet
  if (subject.length > SECURITY_CONFIG.MAX_SUBJECT_LENGTH) {
    return {
      valid: false,
      error: `Le sujet ne peut pas dépasser ${SECURITY_CONFIG.MAX_SUBJECT_LENGTH} caractères`,
    };
  }

  if (subject.length < SECURITY_CONFIG.MIN_SUBJECT_LENGTH) {
    return {
      valid: false,
      error: `Le sujet doit contenir au moins ${SECURITY_CONFIG.MIN_SUBJECT_LENGTH} caractères`,
    };
  }

  // Vérifier le contenu du message (anti-spam basique)
  const spamKeywords = [
    "viagra",
    "casino",
    "loan",
    "credit",
    "make money fast",
    "click here",
  ];
  const messageLower = message.toLowerCase();
  if (spamKeywords.some((keyword) => messageLower.includes(keyword))) {
    return { valid: false, error: "Le contenu du message semble être du spam" };
  }

  // Rate limiting
  const now = Date.now();
  const userKey = `${ip}:${email}`;
  const userLimit = rateLimitMap.get(userKey);

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_HOUR) {
        const remainingMinutes = Math.ceil(
          (userLimit.resetTime - now) / (1000 * 60)
        );
        return {
          valid: false,
          error: `Trop de messages envoyés. Réessayez dans ${remainingMinutes} minutes`,
        };
      }
      userLimit.count++;
    } else {
      rateLimitMap.set(userKey, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.COOLDOWN_MINUTES * 60 * 1000,
      });
    }
  } else {
    rateLimitMap.set(userKey, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.COOLDOWN_MINUTES * 60 * 1000,
    });
  }

  return { valid: true };
}

// Nettoyer le rate limiting toutes les heures
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  },
  60 * 60 * 1000
); // Toutes les heures

export async function POST(request: NextRequest) {
  try {
    /*console.log("📧 Nouveau message de contact...")*/

    // Récupérer l'IP du client
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";
    /*console.log("🌐 IP du client:", ip)*/

    const body: ContactData = await request.json();
    const { firstName, lastName, email, subject, message, recaptchaToken } = body;

    const captchaResult = await verifyRecaptchaToken(recaptchaToken, ip);
    if (!captchaResult.success) {
      return NextResponse.json(
        {
          error: "Validation reCAPTCHA nécessaire",
          details: captchaResult["error-codes"],
        },
        { status: 400 }
      );
    }

    // Validation des données de base
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation de sécurité
    const securityCheck = validateSecurity(email, message, subject, ip);
    if (!securityCheck.valid) {
      /*console.log("🚫 Validation de sécurité échouée:", securityCheck.error)*/
      return NextResponse.json({ error: securityCheck.error }, { status: 400 });
    }

    /*console.log("✅ Validation réussie pour:", email)*/

    // Créer le client Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Stocker le message dans Supabase avec l'IP
    /*console.log("💾 Stockage du message dans Supabase...")*/
    const contactData = {
      nom: firstName,
      prenom: lastName,
      email,
      sujet: subject,
      message,
      date_creation: new Date().toISOString(),
      statut: "nouveau",
      /* ip_address: ip  */ // Stocker l'IP pour le suivi
    };

    const { data: savedContact, error: saveError } = await supabase
      .from("contacts")
      .insert(contactData)
      .select()
      .single();

    if (saveError) {
      console.error("❌ Erreur lors du stockage dans Supabase:", saveError);
      // On continue quand même pour envoyer l'email
    } else {
      /*console.log("✅ Message stocké dans Supabase avec ID:", savedContact.id)*/
    }

    // Envoi de l'email avec protection anti-boucle
    /*console.log("📤 Envoi de l'email...")*/
    const { data, error } = await resend.emails.send({
      from: "contact@zalamagn.com",
      to: ["support@zalamagn.com"], // Email de destination
      subject: `[CONTACT] ${subject} - ${firstName} ${lastName}`,
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
            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString("fr-FR")}</p>
            ${savedContact ? `<p><strong>ID Contact:</strong> ${savedContact.id}</p>` : ""}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Ce message a été envoyé depuis le formulaire de contact du site web ZaLaMa.</p>
            <p><strong>⚠️ IMPORTANT:</strong> Ne répondez pas directement à cet email. Utilisez l'adresse de l'expéditeur pour répondre.</p>
          </div>
        </div>
      `,
      replyTo: email, // Permet de répondre directement au client
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    /*console.log("✅ Email envoyé avec succès, ID:", data?.id)*/

    return NextResponse.json(
      {
        message: "Message envoyé avec succès",
        id: data?.id,
        contactId: savedContact?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
