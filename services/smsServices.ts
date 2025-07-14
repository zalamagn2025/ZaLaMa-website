import { Client } from 'nimbasms';

interface SMSConfig = {
  SERVICE_ID: process.env.NIMBA_SMS_SERVICE_ID;
  SECRET_TOKEN: process.env.NIMBA_SMS_SECRET_TOKEN;
};

interface PartnershipSMSData {
  partnerName: string;
  submissionDate: string;
  requestId: string;
  representativePhone: string;
}

class SMSService {
  private client: Client;
  private rhNumber: string;

  constructor() {
    const config: SMSConfig = {
      SERVICE_ID: process.env.NIMBA_SMS_SERVICE_ID!,
      SECRET_TOKEN: process.env.NIMBA_SMS_SECRET_TOKEN!
    };
    
    this.client = new Client(config);
    this.rhNumber = process.env.SMS_RH_NUMBER!;
  }

  private formatPhoneNumber(phone: string): string {
    // Formatage pour NimbaSMS (+224XXXXXXXXX)
    return phone.replace(/\s/g, '').replace(/^0/, '+224');
  }

  async sendPartnershipNotification(data: PartnershipSMSData): Promise<{
    success: boolean;
    rhSMS?: any;
    representativeSMS?: any;
    errors?: string[];
  }> {
    const errors: string[] = [];
    const message = this.buildPartnershipMessage(data);

    try {
      // SMS au RH
      const rhSMS = await this.client.messages.create({
        to: [this.rhNumber],
        message: message,
        sender_name: 'ZaLaMa'
      });

      // SMS au représentant
      const formattedPhone = this.formatPhoneNumber(data.representativePhone);
      const representativeSMS = await this.client.messages.create({
        to: [formattedPhone],
        message: message,
        sender_name: 'ZaLaMa'
      });

      return {
        success: true,
        rhSMS,
        representativeSMS
      };

    } catch (error) {
      console.error('Erreur envoi SMS partenariat:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Erreur inconnue']
      };
    }
  }

  private buildPartnershipMessage(data: PartnershipSMSData): string {
    return `Nouvelle demande de partenariat ZaLaMa

�� Partenaire: ${data.partnerName}
📅 Date: ${data.submissionDate}
🔗 Lien: https://admin.zalama.com/partenaires/${data.requestId}

Votre demande est en cours d'étude.
Nous vous contacterons sous 48h.

Cordialement,
L'équipe ZaLaMa`;
  }
}

export const smsService = new SMSService();