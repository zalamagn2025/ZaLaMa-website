import { Resend } from 'resend';
import { Client } from 'nimbasms';
import { formatSmsError, logSmsError } from '@/utils/smsErrorFormatter';

// Types pour les données d'inscription employé
interface EmployeeRegistrationData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  type_contrat: string;
  salaire_net: number;
  date_embauche: string;
  company_name?: string;
}

interface NotificationResult {
  success: boolean;
  email?: {
    success: boolean;
    messageId?: string;
    error?: string;
  };
  sms?: {
    success: boolean;
    messageId?: string;
    error?: string;
  };
  errors: string[];
}

/**
 * Service de notification pour l'inscription des employés
 * Gère l'envoi d'emails et SMS automatiquement
 */
class EmployeeNotificationService {
  private resend: Resend;
  private smsClient: Client;
  private retryAttempts = 3;
  private retryDelay = 2000; // 2 secondes

  constructor() {
    // Initialisation Resend
    this.resend = new Resend(process.env.RESEND_API_KEY);

    // Initialisation NimbaSMS
    this.smsClient = new Client({
      SERVICE_ID: process.env.NIMBA_SMS_SERVICE_ID!,
      SECRET_TOKEN: process.env.NIMBA_SMS_SECRET_TOKEN!
    });
  }

  /**
   * Envoie un email de confirmation à l'employé
   */
  async sendEmployeeEmail(data: EmployeeRegistrationData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      /*console.log('📧 Envoi e-mail confirmation inscription employé pour:', data.email)*/
      
      const htmlContent = this.getEmployeeRegistrationEmailTemplate(data);
      
      const result = await this.resend.emails.send({
        from: 'ZaLaMa <noreply@zalamagn.com>',
        to: [data.email],
        subject: `Confirmation de votre inscription - ${data.prenom} ${data.nom}`,
        html: htmlContent,
        headers: {
          'X-Employee-Name': `${data.prenom} ${data.nom}`,
          'X-Employee-Email': data.email
        }
      });

      const duration = Date.now() - startTime;
      
      /*console.log('✅ E-mail confirmation inscription employé envoyé:', {
        messageId: result.data?.id,
        employee: `${data.prenom} ${data.nom}`,
        email: data.email,
        duration: `${duration}ms`
      })*/

      return {
        success: true,
        messageId: result.data?.id
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      const formattedError = this.formatEmailError(error);
      
      console.error('❌ Erreur envoi e-mail inscription employé:', {
        employee: `${data.prenom} ${data.nom}`,
        email: data.email,
        error: formattedError,
        duration: `${duration}ms`
      });

      return {
        success: false,
        error: formattedError.message
      };
    }
  }

  /**
   * Envoie un SMS de confirmation à l'employé
   */
  async sendEmployeeSMS(data: EmployeeRegistrationData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      /*console.log('📱 Envoi SMS confirmation inscription employé pour:', data.telephone)*/
      
      const message = this.buildEmployeeRegistrationSMSMessage(data);
      const formattedPhone = this.formatPhoneNumber(data.telephone);
      
      const result = await this.smsClient.messages.create({
        to: [formattedPhone],
        message: message,
        sender_name: 'ZaLaMa'
      });

      const duration = Date.now() - startTime;
      
      /*console.log('✅ SMS confirmation inscription employé envoyé:', {
        messageId: result.messageid,
        employee: `${data.prenom} ${data.nom}`,
        phone: data.telephone,
        duration: `${duration}ms`
      })*/

      return {
        success: true,
        messageId: result.messageid
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      const formattedError = formatSmsError(error, 'SMS confirmation inscription employé');
      
      console.error('❌ Erreur envoi SMS inscription employé:', {
        employee: `${data.prenom} ${data.nom}`,
        phone: data.telephone,
        error: formattedError,
        duration: `${duration}ms`
      });

      return {
        success: false,
        error: formattedError
      };
    }
  }

  /**
   * Envoie les notifications complètes (email + SMS)
   */
  async sendRegistrationNotifications(data: EmployeeRegistrationData): Promise<NotificationResult> {
    /*console.log('🚀 Envoi des notifications d\'inscription pour:', `${data.prenom} ${data.nom}`)*/
    
    const results: NotificationResult = {
      success: false,
      errors: []
    };

    try {
      // Envoi de l'email
      /*console.log('📧 Envoi email de confirmation...')*/
      const emailResult = await this.sendEmployeeEmail(data);
      results.email = emailResult;
      
      if (!emailResult.success) {
        results.errors.push(`Email: ${emailResult.error}`);
      }

      // Délai pour éviter le rate limiting
      await this.delay(500);

      // Envoi du SMS
      /*console.log('📱 Envoi SMS de confirmation...')*/
      const smsResult = await this.sendEmployeeSMS(data);
      results.sms = smsResult;
      
      if (!smsResult.success) {
        results.errors.push(`SMS: ${smsResult.error}`);
      }

      // Déterminer le succès global
      results.success = (emailResult.success || smsResult.success) && results.errors.length === 0;

      /*console.log('✅ Notifications d\'inscription terminées:', {
        employee: `${data.prenom} ${data.nom}`,
        emailSuccess: emailResult.success,
        smsSuccess: smsResult.success,
        totalErrors: results.errors.length
      })*/

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      results.errors.push(`Notification générale: ${errorMessage}`);
      
      console.error('❌ Erreur lors de l\'envoi des notifications:', error);
    }

    return results;
  }

  /**
   * Template HTML pour l'email de confirmation d'inscription
   */
  private getEmployeeRegistrationEmailTemplate(data: EmployeeRegistrationData): string {
    const salaireFormatted = data.salaire_net.toLocaleString('fr-FR');
    const dateEmbauche = new Date(data.date_embauche).toLocaleDateString('fr-FR');
    
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation d'inscription - ZaLaMa</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #FF671E;
          }
          .logo {
            color: #FF671E;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .title {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #666;
            font-size: 16px;
          }
          .content {
            margin-bottom: 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
          }
          .details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
          }
          .detail-value {
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #666;
            font-size: 14px;
          }
          .highlight {
            color: #FF671E;
            font-weight: 600;
          }
          .button {
            display: inline-block;
            background-color: #FF671E;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ZaLaMa</div>
            <div class="title">Confirmation d'inscription</div>
            <div class="subtitle">Votre demande a été reçue avec succès</div>
          </div>
          
          <div class="content">
            <div class="greeting">
              Bonjour <span class="highlight">${data.prenom} ${data.nom}</span>,
            </div>
            
            <p>
              Nous avons bien reçu votre demande d'inscription sur la plateforme ZaLaMa. 
              Votre dossier est actuellement en cours de traitement par notre équipe.
            </p>
            
            <div class="details">
              <h3 style="margin-top: 0; color: #FF671E;">Détails de votre inscription :</h3>
              
              <div class="detail-row">
                <span class="detail-label">Nom complet :</span>
                <span class="detail-value">${data.prenom} ${data.nom}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Poste :</span>
                <span class="detail-value">${data.poste}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Type de contrat :</span>
                <span class="detail-value">${data.type_contrat}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Salaire net :</span>
                <span class="detail-value">${salaireFormatted} GNF</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Date d'embauche :</span>
                <span class="detail-value">${dateEmbauche}</span>
              </div>
              
              ${data.company_name ? `
              <div class="detail-row">
                <span class="detail-label">Entreprise :</span>
                <span class="detail-value">${data.company_name}</span>
              </div>
              ` : ''}
            </div>
            
            <p>
              <strong>Prochaines étapes :</strong>
            </p>
            <ul>
              <li>Notre équipe va examiner votre dossier sous 24-48 heures</li>
              <li>Vous recevrez un email de confirmation avec vos identifiants de connexion</li>
              <li>Vous pourrez alors accéder à votre espace personnel ZaLaMa</li>
            </ul>
            
            <p>
              Si vous avez des questions, n'hésitez pas à nous contacter à 
              <a href="mailto:contact@zalamagn.com" style="color: #FF671E;">contact@zalamagn.com</a>
            </p>
          </div>
          
          <div class="footer">
            <p>
              <strong>ZaLaMa</strong><br>
              Plateforme de gestion des avances sur salaire<br>
              <a href="https://zalamagn.com" style="color: #FF671E;">www.zalamagn.com</a>
            </p>
            <p style="font-size: 12px; color: #999;">
              Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Construction du message SMS de confirmation
   */
  private buildEmployeeRegistrationSMSMessage(data: EmployeeRegistrationData): string {
    const salaireFormatted = data.salaire_net.toLocaleString('fr-FR');
    
    return `ZaLaMa - Confirmation d'inscription

✅ Bonjour ${data.prenom} ${data.nom},

Votre demande d'inscription a été reçue avec succès.

📋 Détails :
• Poste : ${data.poste}
• Contrat : ${data.type_contrat}
• Salaire : ${salaireFormatted} GNF

⏰ Prochaines étapes :
Votre dossier sera traité sous 24-48h.
Vous recevrez vos identifiants par email.

📧 Contact : contact@zalamagn.com

Cordialement,
L'équipe ZaLaMa`;
  }

  /**
   * Formatage du numéro de téléphone pour NimbaSMS
   */
  private formatPhoneNumber(phone: string): string {
    // Formatage pour NimbaSMS (+224XXXXXXXXX)
    return phone.replace(/\s/g, '').replace(/^0/, '+224');
  }

  /**
   * Formatage des erreurs d'email
   */
  private formatEmailError(error: any): {
    message: string;
    type: 'auth' | 'quota' | 'network' | 'validation' | 'unknown';
  } {
    let errorMessage = 'Erreur inconnue';
    let type: 'auth' | 'quota' | 'network' | 'validation' | 'unknown' = 'unknown';

    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
        type = 'auth';
      } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        type = 'quota';
      } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
        type = 'network';
      } else if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
        type = 'validation';
      }
    }

    return {
      message: `Email: ${errorMessage}`,
      type
    };
  }

  /**
   * Délai utilitaire pour le retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instance singleton du service
export const employeeNotificationService = new EmployeeNotificationService();
