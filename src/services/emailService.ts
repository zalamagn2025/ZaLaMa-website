import { forgotPasswordEmailTemplate, forgotPasswordEmailText } from './emailTemplates/forgotPasswordEmail';

export interface EmailData {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  userName?: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@zalama.com';
    this.fromName = 'ZaLaMa';
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
   * Envoie les emails de partenariat (3 confirmations + 1 notification)
   */
  async sendPartnershipEmails(data: any): Promise<{
    companyEmail: { success: boolean; error?: string; errorType?: string; recipient?: string };
    repEmail: { success: boolean; error?: string; errorType?: string; recipient?: string };
    hrEmail: { success: boolean; error?: string; errorType?: string; recipient?: string };
    contactEmail: { success: boolean; error?: string; errorType?: string; recipient?: string };
    overallSuccess: boolean;
  }> {
    try {
      // Importer les templates
      const { getAdminEmailTemplate, getUserEmailTemplate } = await import('../app/api/partnership/emailTemplates');

      // Préparer les données pour les templates
      const emailData = {
        companyName: data.company_name,
        legalStatus: data.legal_status,
        rccm: data.rccm,
        nif: data.nif,
        legalRepresentative: data.rep_full_name,
        position: data.rep_position,
        headquartersAddress: data.headquarters_address,
        phone: data.phone,
        email: data.email,
        employeesCount: data.employees_count,
        payroll: data.payroll,
        cdiCount: data.cdi_count,
        cddCount: data.cdd_count,
        docId: data.id,
        activityDomain: data.activity_domain,
        paymentDate: data.payment_day ? `Jour ${data.payment_day}` : 'Non spécifié',
        repEmail: data.rep_email,
        repPhone: data.rep_phone,
        repPosition: data.rep_position,
        hrFullName: data.hr_full_name,
        hrEmail: data.hr_email,
        hrPhone: data.hr_phone
      };

      // 1. Email de confirmation à l'entreprise (template utilisateur)
      const companyEmailData: EmailData = {
        to: data.email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: getUserEmailTemplate({
          legalRepresentative: data.rep_full_name,
          companyName: data.company_name,
          docId: data.id
        }),
        text: `Confirmation de reception de votre demande de partenariat pour ${data.company_name} - ID: ${data.id}`
      };

      // 2. Email de confirmation au représentant légal (template utilisateur)
      const repEmailData: EmailData = {
        to: data.rep_email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: getUserEmailTemplate({
          legalRepresentative: data.rep_full_name,
          companyName: data.company_name,
          docId: data.id
        }),
        text: `Confirmation de reception de votre demande de partenariat pour ${data.company_name} - ID: ${data.id}`
      };

      // 3. Email de confirmation au responsable RH (template utilisateur)
      const hrEmailData: EmailData = {
        to: data.hr_email,
        subject: 'Confirmation de reception de votre demande de partenariat - ZaLaMa',
        html: getUserEmailTemplate({
          legalRepresentative: data.hr_full_name,
          companyName: data.company_name,
          docId: data.id
        }),
        text: `Confirmation de reception de votre demande de partenariat pour ${data.company_name} - ID: ${data.id}`
      };

      // 4. Email de notification à contact@zalamagn.com (template admin détaillé)
      const contactEmailData: EmailData = {
        to: 'contact@zalamagn.com',
        subject: `Nouvelle demande de partenariat - ${data.company_name}`,
        html: getAdminEmailTemplate(emailData),
        text: `Nouvelle demande de partenariat de ${data.company_name} - ID: ${data.id}`
      };

      // Envoi des emails avec délai pour éviter le rate limiting
      const results = [];
      
      // Email 1: Entreprise
      console.log('📧 Envoi email entreprise...');
      const companyResult = await this.sendEmail(companyEmailData);
      results.push({
        status: 'fulfilled',
        value: companyResult,
        recipient: data.email
      });
      
      // Délai de 500ms pour éviter le rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Email 2: Représentant légal
      console.log('📧 Envoi email représentant...');
      const repResult = await this.sendEmail(repEmailData);
      results.push({
        status: 'fulfilled',
        value: repResult,
        recipient: data.rep_email
      });
      
      // Délai de 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Email 3: RH
      console.log('📧 Envoi email RH...');
      const hrResult = await this.sendEmail(hrEmailData);
      results.push({
        status: 'fulfilled',
        value: hrResult,
        recipient: data.hr_email
      });
      
      // Délai de 500ms
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Email 4: Admin
      console.log('📧 Envoi email admin...');
      const contactResult = await this.sendEmail(contactEmailData);
      results.push({
        status: 'fulfilled',
        value: contactResult,
        recipient: 'contact@zalamagn.com'
      });

      // Traitement des résultats
      const emailResults = {
        companyEmail: {
          success: companyResult,
          error: !companyResult ? 'Échec envoi' : undefined,
          errorType: !companyResult ? 'SEND_ERROR' : undefined,
          recipient: data.email
        },
        repEmail: {
          success: repResult,
          error: !repResult ? 'Échec envoi' : undefined,
          errorType: !repResult ? 'SEND_ERROR' : undefined,
          recipient: data.rep_email
        },
        hrEmail: {
          success: hrResult,
          error: !hrResult ? 'Échec envoi' : undefined,
          errorType: !hrResult ? 'SEND_ERROR' : undefined,
          recipient: data.hr_email
        },
        contactEmail: {
          success: contactResult,
          error: !contactResult ? 'Échec envoi' : undefined,
          errorType: !contactResult ? 'SEND_ERROR' : undefined,
          recipient: 'contact@zalamagn.com'
        }
      };

      const overallSuccess = emailResults.companyEmail.success && emailResults.repEmail.success && emailResults.hrEmail.success && emailResults.contactEmail.success;

      return {
        ...emailResults,
        overallSuccess
      };

    } catch (error) {
      console.error('Erreur envoi emails partenariat:', error);
      return {
        companyEmail: { 
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          errorType: 'EXCEPTION',
          recipient: data.email
        },
        repEmail: { 
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          errorType: 'EXCEPTION',
          recipient: data.rep_email
        },
        hrEmail: { 
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          errorType: 'EXCEPTION',
          recipient: data.hr_email
        },
        contactEmail: { 
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          errorType: 'EXCEPTION',
          recipient: 'contact@zalamagn.com'
        },
        overallSuccess: false
      };
    }
  }

  /**
   * Méthode générique d'envoi d'email avec Resend
   */
  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.error('Clé API Resend manquante. Veuillez configurer RESEND_API_KEY');
        return false;
      }

      const { Resend } = await import('resend');
      const resend = new Resend(this.apiKey);

      const { data, error } = await resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
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
      console.error('Erreur envoi email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService(); 