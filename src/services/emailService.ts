import { forgotPasswordEmailTemplate, forgotPasswordEmailText } from './emailTemplates/forgotPasswordEmail';

export interface EmailConfig {
  provider: 'nodemailer' | 'sendgrid' | 'resend' | 'mailgun';
  apiKey?: string;
  fromEmail: string;
  fromName: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  userName?: string;
}

class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   */
  async sendForgotPasswordEmail(to: string, resetLink: string, userName?: string): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to,
        subject: 'Réinitialisation de mot de passe - ZaLaMa',
        html: forgotPasswordEmailTemplate(resetLink, userName),
        text: forgotPasswordEmailText(resetLink, userName),
        userName
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Erreur envoi email mot de passe oublié:', error);
      return false;
    }
  }

  /**
   * Envoie les emails de partenariat (admin et utilisateur)
   */
  async sendPartnershipEmails(data: any): Promise<{
    adminEmail: { success: boolean; error?: string; errorType?: string };
    userEmail: { success: boolean; error?: string; errorType?: string; recipient?: string };
    overallSuccess: boolean;
  }> {
    try {
      const adminEmailData: EmailData = {
        to: process.env.ADMIN_EMAIL || 'admin@zalamagn.com',
        subject: `Nouvelle demande de partenariat - ${data.company_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">Nouvelle demande de partenariat</h2>
            <p><strong>Entreprise:</strong> ${data.company_name}</p>
            <p><strong>Statut légal:</strong> ${data.legal_status}</p>
            <p><strong>RCCM:</strong> ${data.rccm}</p>
            <p><strong>NIF:</strong> ${data.nif}</p>
            <p><strong>Domaine d'activité:</strong> ${data.activity_domain}</p>
            <p><strong>Adresse:</strong> ${data.headquarters_address}</p>
            <p><strong>Téléphone:</strong> ${data.phone}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Nombre d'employés:</strong> ${data.employees_count}</p>
            <p><strong>Masse salariale:</strong> ${data.payroll}</p>
            <p><strong>CDI:</strong> ${data.cdi_count}</p>
            <p><strong>CDD:</strong> ${data.cdd_count}</p>
            <p><strong>Jour de paiement:</strong> ${data.payment_day}</p>
            <br>
            <h3>Représentant légal</h3>
            <p><strong>Nom:</strong> ${data.rep_full_name}</p>
            <p><strong>Email:</strong> ${data.rep_email}</p>
            <p><strong>Téléphone:</strong> ${data.rep_phone}</p>
            <p><strong>Poste:</strong> ${data.rep_position}</p>
            <br>
            <h3>Responsable RH</h3>
            <p><strong>Nom:</strong> ${data.hr_full_name}</p>
            <p><strong>Email:</strong> ${data.hr_email}</p>
            <p><strong>Téléphone:</strong> ${data.hr_phone}</p>
          </div>
        `,
        text: `Nouvelle demande de partenariat de ${data.company_name}`
      };

      const userEmailData: EmailData = {
        to: data.email,
        subject: 'Confirmation de votre demande de partenariat - ZaLaMa',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">Confirmation de demande de partenariat</h2>
            <p>Bonjour,</p>
            <p>Nous avons bien reçu votre demande de partenariat pour l'entreprise <strong>${data.company_name}</strong>.</p>
            <p>Notre équipe va examiner votre dossier et vous contactera dans les plus brefs délais.</p>
            <p>Merci pour votre confiance en ZaLaMa.</p>
            <br>
            <p>Cordialement,<br>L'équipe ZaLaMa</p>
          </div>
        `,
        text: `Confirmation de votre demande de partenariat pour ${data.company_name}`
      };

      const adminResult = await this.sendEmail(adminEmailData);
      const userResult = await this.sendEmail(userEmailData);

      return {
        adminEmail: { 
          success: adminResult,
          error: adminResult ? undefined : 'Échec envoi email admin',
          errorType: adminResult ? undefined : 'SEND_ERROR'
        },
        userEmail: { 
          success: userResult,
          error: userResult ? undefined : 'Échec envoi email utilisateur',
          errorType: userResult ? undefined : 'SEND_ERROR',
          recipient: data.email
        },
        overallSuccess: adminResult && userResult
      };
    } catch (error) {
      console.error('Erreur envoi emails partenariat:', error);
      return {
        adminEmail: { 
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          errorType: 'EXCEPTION'
        },
        userEmail: { 
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          errorType: 'EXCEPTION',
          recipient: data.email
        },
        overallSuccess: false
      };
    }
  }

  /**
   * Méthode générique d'envoi d'email
   */
  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'nodemailer':
          return await this.sendWithNodemailer(emailData);
        case 'sendgrid':
          return await this.sendWithSendGrid(emailData);
        case 'resend':
          return await this.sendWithResend(emailData);
        case 'mailgun':
          return await this.sendWithMailgun(emailData);
        default:
          throw new Error(`Fournisseur d'email non supporté: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  /**
   * Envoi avec Nodemailer (SMTP)
   */
  private async sendWithNodemailer(emailData: EmailData): Promise<boolean> {
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransporter({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpPort === 465,
        auth: {
          user: this.config.smtpUser,
          pass: this.config.smtpPass,
        },
      });

      const mailOptions = {
        from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html || '<p>Email de ZaLaMa</p>',
        text: emailData.text || 'Email de ZaLaMa',
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès:', info.messageId);
      return true;
    } catch (error) {
      console.error('Erreur Nodemailer:', error);
      return false;
    }
  }

  /**
   * Envoi avec SendGrid
   */
  private async sendWithSendGrid(emailData: EmailData): Promise<boolean> {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.config.apiKey);

      const msg = {
        to: emailData.to,
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName,
        },
        subject: emailData.subject,
        html: emailData.html || '<p>Email de ZaLaMa</p>',
        text: emailData.text || 'Email de ZaLaMa',
      };

      await sgMail.send(msg);
      console.log('Email envoyé avec succès via SendGrid');
      return true;
    } catch (error) {
      console.error('Erreur SendGrid:', error);
      return false;
    }
  }

  /**
   * Envoi avec Resend
   */
  private async sendWithResend(emailData: EmailData): Promise<boolean> {
    try {
      const { Resend } = require('resend');
      const resend = new Resend(this.config.apiKey);

      const { data, error } = await resend.emails.send({
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html || '<p>Email de ZaLaMa</p>',
        text: emailData.text || 'Email de ZaLaMa',
      });

      if (error) {
        console.error('Erreur Resend:', error);
        return false;
      }

      console.log('Email envoyé avec succès via Resend:', data);
      return true;
    } catch (error) {
      console.error('Erreur Resend:', error);
      return false;
    }
  }

  /**
   * Envoi avec Mailgun
   */
  private async sendWithMailgun(emailData: EmailData): Promise<boolean> {
    try {
      const formData = require('form-data');
      const Mailgun = require('mailgun.js');
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({ username: 'api', key: this.config.apiKey });

      const msg = {
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html || '<p>Email de ZaLaMa</p>',
        text: emailData.text || 'Email de ZaLaMa',
      };

      const response = await mg.messages.create(process.env.MAILGUN_DOMAIN || 'your-domain.com', msg);
      console.log('Email envoyé avec succès via Mailgun:', response);
      return true;
    } catch (error) {
      console.error('Erreur Mailgun:', error);
      return false;
    }
  }
}

// Configuration par défaut
const defaultEmailConfig: EmailConfig = {
  provider: 'nodemailer',
  fromEmail: process.env.EMAIL_FROM || 'noreply@zalama.com',
  fromName: 'ZaLaMa',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
};

export const emailService = new EmailService(defaultEmailConfig);

// Fonction utilitaire pour créer une instance avec une configuration personnalisée
export const createEmailService = (config: EmailConfig): EmailService => {
  return new EmailService(config);
}; 