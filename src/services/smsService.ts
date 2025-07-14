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
  representative_phone: string;
  rh_phone: string; // Numéro RH dynamique
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
      rh: SMSResult;
      representative: SMSResult;
    };
    summary: {
      totalSent: number;
      totalFailed: number;
      errors: string[];
    };
  }> {
    const message = this.buildPartnershipMessage(data);
    const results = {
      rh: await this.sendSMSWithRetry(data.rh_phone, message, 'RH'),
      representative: await this.sendSMSWithRetry(data.representative_phone, message, 'Représentant')
    };

    const summary = {
      totalSent: [results.rh, results.representative].filter(r => r.success).length,
      totalFailed: [results.rh, results.representative].filter(r => !r.success).length,
      errors: [results.rh, results.representative]
        .filter(r => !r.success)
        .map(r => r.error!)
    };

    // Log détaillé
    this.logSMSResults(results, summary, data);

    return {
      success: summary.totalFailed === 0,
      results,
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
        rh: {
          success: results.rh.success,
          messageId: results.rh.messageId,
          error: results.rh.error
        },
        representative: {
          success: results.representative.success,
          messageId: results.representative.messageId,
          error: results.representative.error
        }
      },
      timestamp: new Date().toISOString()
    });
  }
}

export const enhancedSmsService = new EnhancedSMSService(); 