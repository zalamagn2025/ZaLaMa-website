import { Client } from 'nimbasms';
import { formatSmsError, logSmsError } from '@/utils/smsErrorFormatter';

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
  recipient: string;
}

interface PartnershipSMSData {
  partnerName: string;
  submissionDate: string;
  requestId: string;
  representativePhone: string;
  partnerEmail?: string;
}

interface PartnershipNotificationData {
  partner_name: string;
  company_phone: string; // Téléphone de l'entreprise
  representative_phone: string; // Téléphone du représentant
  rh_phone: string; // Téléphone du RH
  admin_phone: string; // Téléphone admin ZaLaMa
  request_id: string;
  submission_date: Date;
}

class EnhancedSMSService {
  private client: Client;
  private retryAttempts = 3;
  private retryDelay = 2000; // 2 secondes

  constructor() {
    this.client = new Client({
      SERVICE_ID: process.env.NIMBA_SMS_SERVICE_ID!,
      SECRET_TOKEN: process.env.NIMBA_SMS_SECRET_TOKEN!
    });
  }

  private async sendSMSWithRetry(phone: string, message: string, context: string): Promise<SMSResult> {
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const result = await this.client.messages.create({
          to: [this.formatPhoneNumber(phone)],
          message,
          sender_name: 'ZaLaMa'
        });

        return {
          success: true,
          messageId: result.messageid,
          timestamp: new Date(),
          recipient: phone
        };

      } catch (error) {
        // Utilisation de la fonction utilitaire pour formater l'erreur
        lastError = formatSmsError(error, `Tentative ${attempt}/${this.retryAttempts} échouée pour ${context}`);
        
        // Log structuré de l'erreur
        logSmsError(error, `${context} - Tentative ${attempt}`, {
          attempt,
          totalAttempts: this.retryAttempts,
          phone: phone,
          context
        });
        
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt); // Backoff exponentiel
        }
      }
    }

    return {
      success: false,
      error: lastError,
      timestamp: new Date(),
      recipient: phone
    };
  }

  async sendPartnershipNotification(data: PartnershipNotificationData): Promise<{
    success: boolean;
    results: {
      company: SMSResult;
      representative: SMSResult;
      rh: SMSResult;
      admin: SMSResult;
    };
    summary: {
      totalSent: number;
      totalFailed: number;
      errors: string[];
    };
  }> {
    const message = this.buildPartnershipMessage(data);
    
    // Envoi parallèle aux 4 entités
    const results = await Promise.allSettled([
      this.sendSMSWithRetry(data.company_phone, message, 'Entreprise'),
      this.sendSMSWithRetry(data.representative_phone, message, 'Représentant'),
      this.sendSMSWithRetry(data.rh_phone, message, 'RH'),
      this.sendSMSWithRetry(data.admin_phone, message, 'Admin ZaLaMa')
    ]);

    // Traitement des résultats
    const processedResults = {
      company: results[0].status === 'fulfilled' ? results[0].value : {
        success: false,
        error: results[0].reason || 'Erreur inconnue',
        timestamp: new Date(),
        recipient: data.company_phone
      },
      representative: results[1].status === 'fulfilled' ? results[1].value : {
        success: false,
        error: results[1].reason || 'Erreur inconnue',
        timestamp: new Date(),
        recipient: data.representative_phone
      },
      rh: results[2].status === 'fulfilled' ? results[2].value : {
        success: false,
        error: results[2].reason || 'Erreur inconnue',
        timestamp: new Date(),
        recipient: data.rh_phone
      },
      admin: results[3].status === 'fulfilled' ? results[3].value : {
        success: false,
        error: results[3].reason || 'Erreur inconnue',
        timestamp: new Date(),
        recipient: data.admin_phone
      }
    };

    const summary = {
      totalSent: Object.values(processedResults).filter(r => r.success).length,
      totalFailed: Object.values(processedResults).filter(r => !r.success).length,
      errors: Object.values(processedResults)
        .filter(r => !r.success)
        .map(r => r.error!)
    };

    // Log détaillé
    this.logSMSResults(processedResults, summary, data);

    return {
      success: summary.totalFailed === 0,
      results: processedResults,
      summary
    };
  }

  private buildPartnershipMessage(data: PartnershipNotificationData): string {
    return `Bonjour ${data.partner_name},

Nous vous confirmons la réception de votre demande de partenariat effectuée via la plateforme ZaLaMa.

Notre équipe procède actuellement à la vérification des informations fournies. Vous recevrez une notification dès que votre demande aura été traitée.

Merci pour votre confiance.

L'équipe ZaLaMa`;
  }

  private formatPhoneNumber(phone: string): string {
    return phone
      .replace(/\s/g, '')
      .replace(/^0/, '+224')
      .replace(/^224/, '+224');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logSMSResults(results: any, summary: any, data: PartnershipNotificationData): void {
    console.log('📱 SMS Partnership Results:', {
      partner: data.partner_name,
      requestId: data.request_id,
      summary,
      details: {
        company: {
          success: results.company.success,
          messageId: results.company.messageId,
          error: results.company.error,
          recipient: data.company_phone
        },
        representative: {
          success: results.representative.success,
          messageId: results.representative.messageId,
          error: results.representative.error,
          recipient: data.representative_phone
        },
        rh: {
          success: results.rh.success,
          messageId: results.rh.messageId,
          error: results.rh.error,
          recipient: data.rh_phone
        },
        admin: {
          success: results.admin.success,
          messageId: results.admin.messageId,
          error: results.admin.error,
          recipient: data.admin_phone
        }
      },
      timestamp: new Date().toISOString()
    });
  }
}

export const enhancedSmsService = new EnhancedSMSService(); 