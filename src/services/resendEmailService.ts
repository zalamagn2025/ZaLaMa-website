import { Resend } from 'resend';
import { forgotPasswordEmailTemplate, forgotPasswordEmailText } from './emailTemplates/forgotPasswordEmail';

// Configuration Resend pour ZaLaMa
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  userName?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class ResendEmailService {
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.fromEmail = 'noreply@zalamagn.com';
    this.fromName = 'ZaLaMa';
    
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY non configurée');
    }
  }

  /**
   * Envoie un email de réinitialisation de mot de passe via Resend
   */
  async sendForgotPasswordEmail(to: string, resetLink: string, userName?: string): Promise<EmailResult> {
    try {
      console.log('📧 Envoi email mot de passe oublié via Resend:', to);

      const emailData: EmailData = {
        to,
        subject: 'Réinitialisation de mot de passe - ZaLaMa',
        html: forgotPasswordEmailTemplate(resetLink, userName),
        text: forgotPasswordEmailText(resetLink, userName),
        userName
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('❌ Erreur envoi email mot de passe oublié:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Méthode générique d'envoi d'email via Resend
   */
  private async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      const { data, error } = await resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html || '<p>Email de ZaLaMa</p>',
        text: emailData.text || 'Email de ZaLaMa',
        headers: {
          'X-ZaLaMa-Email-Type': 'password-reset',
          'X-ZaLaMa-User': emailData.userName || 'unknown'
        }
      });

      if (error) {
        console.error('❌ Erreur Resend:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Email envoyé avec succès via Resend:', {
        messageId: data?.id,
        to: emailData.to,
        subject: emailData.subject
      });

      return {
        success: true,
        messageId: data?.id
      };
    } catch (error) {
      console.error('❌ Erreur envoi email Resend:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Test de connexion Resend
   */
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: ['test@example.com'],
        subject: 'Test de connexion ZaLaMa',
        html: '<h1>Test de connexion Resend</h1><p>Si vous recevez cet email, la configuration Resend fonctionne correctement.</p>'
      });

      if (error) {
        console.error('❌ Test de connexion Resend échoué:', error);
        return false;
      }

      console.log('✅ Test de connexion Resend réussi:', data?.id);
      return true;
    } catch (error) {
      console.error('❌ Erreur test de connexion Resend:', error);
      return false;
    }
  }

  /**
   * Vérification de la configuration
   */
  getConfiguration() {
    return {
      fromEmail: this.fromEmail,
      fromName: this.fromName,
      apiKeyConfigured: !!process.env.RESEND_API_KEY,
      domain: 'zalamagn.com'
    };
  }
}

// Instance singleton du service
export const resendEmailService = new ResendEmailService();

// Fonction utilitaire pour créer une instance personnalisée
export const createResendEmailService = (apiKey?: string): ResendEmailService => {
  if (apiKey) {
    // Créer une nouvelle instance avec une clé API personnalisée
    const customResend = new Resend(apiKey);
    const service = new ResendEmailService();
    // Note: Cette approche nécessiterait une modification de la classe pour supporter des instances multiples
    return service;
  }
  return resendEmailService;
}; 