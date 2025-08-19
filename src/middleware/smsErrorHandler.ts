export class SMSErrorHandler {
  static handleError(error: any, context: string, data?: any): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      error: error.message,
      stack: error.stack,
      data
    };

    // Log structuré
    console.error('🚨 SMS Error:', errorLog);

    // Notification admin si critique
    if (this.isCriticalError(error)) {
      this.notifyAdmin(errorLog);
    }

    // Métriques d'erreur
    this.trackErrorMetrics(error);
  }

  private static isCriticalError(error: any): boolean {
    const criticalErrors = [
      'UNAUTHORIZED',
      'INVALID_CREDENTIALS',
      'SERVICE_UNAVAILABLE',
      'QUOTA_EXCEEDED',
      'ACCOUNT_SUSPENDED'
    ];
    
    return criticalErrors.some(critical => 
      error.message?.includes(critical)
    );
  }

  private static async notifyAdmin(errorLog: any): Promise<void> {
    // Envoi d'email d'alerte admin
    try {
      const alertMessage = `
🚨 ALERTE SMS CRITIQUE

Contexte: ${errorLog.context}
Erreur: ${errorLog.error}
Timestamp: ${errorLog.timestamp}

Données associées: ${JSON.stringify(errorLog.data, null, 2)}

Action requise: Vérification immédiate des credentials SMS
      `;

      console.error('📧 ALERTE ADMIN ENVOYÉE:', alertMessage);
      
      // Ici vous pouvez intégrer votre service d'email
      
      
    } catch (emailError) {
      console.error('❌ Erreur envoi alerte admin:', emailError);
    }
  }

  private static trackErrorMetrics(error: any): void {
    // Métriques pour monitoring
    const errorType = this.categorizeError(error);
    
    console.log('📈 Error Metrics:', {
      type: errorType,
      timestamp: new Date().toISOString(),
      severity: this.getErrorSeverity(error)
    });
  }

  private static categorizeError(error: any): string {
    const errorMessage = (error?.message || String(error) || '').toLowerCase();
    
    if (errorMessage.includes('unauthorized') || errorMessage.includes('invalid_credentials')) {
      return 'AUTH_ERROR';
    }
    if (errorMessage.includes('invalid_phone') || errorMessage.includes('format')) {
      return 'PHONE_FORMAT_ERROR';
    }
    if (errorMessage.includes('service_unavailable') || errorMessage.includes('timeout')) {
      return 'SERVICE_ERROR';
    }
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return 'QUOTA_ERROR';
    }
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return 'NETWORK_ERROR';
    }
    return 'UNKNOWN_ERROR';
  }

  private static getErrorSeverity(error: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const errorMessage = (error?.message || String(error) || '').toLowerCase();
    
    if (errorMessage.includes('unauthorized') || errorMessage.includes('account_suspended')) {
      return 'CRITICAL';
    }
    if (errorMessage.includes('quota_exceeded') || errorMessage.includes('service_unavailable')) {
      return 'HIGH';
    }
    if (errorMessage.includes('invalid_phone') || errorMessage.includes('format')) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  static validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
    // Validation basique du format téléphone
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Format Guinée: +224XXXXXXXXX ou 0XXXXXXXXX
    const guineaPattern = /^(\+224|0)[0-9]{9}$/;
    
    if (!guineaPattern.test(cleanPhone)) {
      return {
        isValid: false,
        error: 'Format de téléphone invalide. Utilisez le format: +224XXXXXXXXX ou 0XXXXXXXXX'
      };
    }
    
    return { isValid: true };
  }

  static validateMessageContent(message: string): { isValid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return {
        isValid: false,
        error: 'Le message ne peut pas être vide'
      };
    }
    
    if (message.length > 160) {
      return {
        isValid: false,
        error: 'Le message ne peut pas dépasser 160 caractères'
      };
    }
    
    return { isValid: true };
  }
} 