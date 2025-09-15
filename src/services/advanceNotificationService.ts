import { Resend } from 'resend'
import { Client } from 'nimbasms'
import { getUserAdvanceEmailTemplate } from '@/app/api/salary-advance/request/emailAdminAdvance'
import { formatSmsError, logSmsError } from '@/utils/smsErrorFormatter'

// Types pour les données de demande d'avance
interface AdvanceNotificationData {
  employeeName: string
  employeeEmail: string
  employeePhone: string
  amount: number
  reason: string
  requestDate: string
  requestId: string
  availableSalary: number
  availableAdvance: number
  requestType: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  errorType?: 'auth' | 'quota' | 'network' | 'validation' | 'unknown'
  recipient?: string
  template?: string
}

interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
  timestamp: Date
  recipient: string
}

interface NotificationResult {
  success: boolean
  email: EmailResult
  sms: SMSResult
  summary: {
    totalSent: number
    totalFailed: number
    errors: string[]
  }
}

/**
 * Service de notification pour les demandes d'avance sur salaire
 * Gère l'envoi d'emails et SMS automatiquement
 */
class AdvanceNotificationService {
  private resend: Resend
  private smsClient: Client
  private retryAttempts = 3
  private retryDelay = 2000 // 2 secondes

  constructor() {
    // Initialisation Resend
    this.resend = new Resend(process.env.RESEND_API_KEY)

    // Initialisation NimbaSMS
    this.smsClient = new Client({
      SERVICE_ID: process.env.NIMBA_SMS_SERVICE_ID!,
      SECRET_TOKEN: process.env.NIMBA_SMS_SECRET_TOKEN!
    })
  }

  /**
   * Envoie un email de confirmation à l'employé
   */
  async sendEmployeeEmail(data: AdvanceNotificationData): Promise<EmailResult> {
    const startTime = Date.now()
    
    try {
      
      const htmlContent = getUserAdvanceEmailTemplate({
        employeeName: data.employeeName,
        amount: data.amount,
        reason: data.reason,
        requestId: data.requestId
      })
      
      const result = await this.resend.emails.send({
        from: 'ZaLaMa <noreply@zalamagn.com>',
        to: [data.employeeEmail],
        subject: `Confirmation de votre demande d'avance - ${data.amount.toLocaleString()} GNF`,
        html: htmlContent,
        headers: {
          'X-Advance-ID': data.requestId,
          'X-Employee-Name': data.employeeName
        }
      })

      return {
        success: true,
        messageId: result.data?.id,
        recipient: data.employeeEmail,
        template: 'employee-confirmation'
      }

    } catch (error) {
      const duration = Date.now() - startTime
      
      const formattedError = this.formatEmailError(error)
      
      console.error('❌ Erreur envoi e-mail employé:', {
        employee: data.employeeName,
        recipient: data.employeeEmail,
        error: formattedError,
        duration: `${duration}ms`
      })

      return {
        success: false,
        error: formattedError.message,
        errorType: formattedError.type,
        recipient: data.employeeEmail,
        template: 'employee-confirmation'
      }
    }
  }

  /**
   * Envoie un SMS de confirmation à l'employé
   */
  async sendEmployeeSMS(data: AdvanceNotificationData): Promise<SMSResult> {
    const startTime = Date.now()
    
    try {
      
      const message = this.buildAdvanceSMSMessage(data)
      const formattedPhone = this.formatPhoneNumber(data.employeePhone)
      
      const result = await this.smsClient.messages.create({
        to: [formattedPhone],
        message,
        sender_name: 'ZaLaMa'
      })

      

      return {
        success: true,
        messageId: result.messageid,
        timestamp: new Date(),
        recipient: formattedPhone
      }

    } catch (error) {
      const duration = Date.now() - startTime
      
      const formattedError = formatSmsError(error, 'SMS confirmation employé')
      logSmsError(error, 'SMS confirmation employé', {
        employee: data.employeeName,
        phone: data.employeePhone,
        duration: `${duration}ms`
      })

      return {
        success: false,
        error: formattedError,
        timestamp: new Date(),
        recipient: data.employeePhone
      }
    }
  }

  /**
   * Envoie les notifications (email + SMS) pour une demande d'avance
   */
  async sendAdvanceNotifications(data: AdvanceNotificationData): Promise<NotificationResult> {
    
    // Envoi parallèle des notifications
    const [emailResult, smsResult] = await Promise.allSettled([
      this.sendEmployeeEmail(data),
      this.sendEmployeeSMS(data)
    ])

    const email = emailResult.status === 'fulfilled' ? emailResult.value : {
      success: false,
      error: 'Envoi interrompu',
      errorType: 'unknown' as const,
      template: 'employee-confirmation'
    }

    const sms = smsResult.status === 'fulfilled' ? smsResult.value : {
      success: false,
      error: 'Envoi interrompu',
      timestamp: new Date(),
      recipient: data.employeePhone
    }

    const summary = {
      totalSent: [email, sms].filter(r => r.success).length,
      totalFailed: [email, sms].filter(r => !r.success).length,
      errors: [email, sms]
        .filter(r => !r.success)
        .map(r => r.error!)
    }

    const overallSuccess = email.success && sms.success

    return {
      success: overallSuccess,
      email,
      sms,
      summary
    }
  }

  /**
   * Construit le message SMS pour la demande d'avance
   */
  private buildAdvanceSMSMessage(data: AdvanceNotificationData): string {
    const formattedDate = new Date(data.requestDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    return `Bonjour ${data.employeeName},
ZaLaMa a bien reçu votre demande d'avance sur salaire de ${data.amount.toLocaleString()} GNF ce ${formattedDate}. 
Elle est en cours de traitement. Vous recevrez une notification dès validation.

Merci pour votre confiance.`
  }

  /**
   * Formate un numéro de téléphone pour NimbaSMS
  */
  private formatPhoneNumber(phone: string): string {
    // Supprimer les espaces et formater pour Guinée
    let formatted = phone.replace(/\s/g, '')
    
    // Si le numéro commence par 0, le remplacer par +224
    if (formatted.startsWith('0')) {
      formatted = '+224' + formatted.substring(1)
    }
    
    // Si le numéro ne commence pas par +, ajouter +224
    if (!formatted.startsWith('+')) {
      formatted = '+224' + formatted
    }
    
    return formatted
  }

  /**
   * Formate une erreur d'email pour logging
  */
  private formatEmailError(error: any): {
    message: string
    type: 'auth' | 'quota' | 'network' | 'validation' | 'unknown'
  } {
    const errorMessage = error?.message || 'Erreur inconnue'
    const errorString = errorMessage.toLowerCase()

    let type: 'auth' | 'quota' | 'network' | 'validation' | 'unknown' = 'unknown'

    if (errorString.includes('unauthorized') || errorString.includes('invalid_credentials') || errorString.includes('auth')) {
      type = 'auth'
    } else if (errorString.includes('quota') || errorString.includes('limit') || errorString.includes('exceeded')) {
      type = 'quota'
    } else if (errorString.includes('network') || errorString.includes('timeout') || errorString.includes('connection')) {
      type = 'network'
    } else if (errorString.includes('invalid') || errorString.includes('validation') || errorString.includes('format')) {
      type = 'validation'
    }

    return {
      message: `Email: ${errorMessage}`,
      type
    }
  }



  /**
   * Délai utilitaire pour le retry
  */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Instance singleton du service
export const advanceNotificationService = new AdvanceNotificationService() 