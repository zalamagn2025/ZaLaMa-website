import { Resend } from 'resend'
import { getAdminEmailTemplate, getUserEmailTemplate } from '@/app/api/partnership/emailTemplates'

// Types pour les données de partenariat
interface PartnershipEmailData {
  companyName: string
  legalStatus: string
  rccm: string
  nif: string
  legalRepresentative: string
  position: string
  headquartersAddress: string
  phone: string
  email: string
  employeesCount: string
  payroll: string
  cdiCount: string
  cddCount: string
  docId: string
  activityDomain: string
  paymentDate: string
  repEmail: string
  repPhone: string
  repPosition: string
  hrFullName: string
  hrEmail: string
  hrPhone: string
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  errorType?: 'auth' | 'quota' | 'network' | 'validation' | 'unknown'
  recipient?: string
  template?: string
}

interface EmailAnalytics {
  sentCount: number
  successCount: number
  errorCount: number
  averageResponseTime: number
  lastSent?: Date
}

class EmailService {
  private resend: Resend
  private analytics: EmailAnalytics = {
    sentCount: 0,
    successCount: 0,
    errorCount: 0,
    averageResponseTime: 0
  }

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    
    this.resend = new Resend(apiKey)
    console.log('📧 Service e-mail initialisé avec Resend')
  }

  /**
   * Envoie un e-mail de notification admin pour une nouvelle demande de partenariat
   */
  async sendAdminNotification(data: PartnershipEmailData): Promise<EmailResult> {
    const startTime = Date.now()
    
    try {
      console.log('📧 Envoi e-mail admin pour:', data.companyName)
      
      const htmlContent = getAdminEmailTemplate(data)
      
              const result = await this.resend.emails.send({
          from: 'Zalama SAS <noreply@zalamagn.com>',
          to: ['admin@zalamagn.com'], // E-mail admin principal
          cc: [data.hrEmail, data.repEmail], // Copie aux contacts de l'entreprise
          subject: `Nouvelle demande de partenariat - ${data.companyName}`,
          html: htmlContent,
          headers: {
            'X-Partnership-ID': data.docId,
            'X-Company-Name': data.companyName
          }
        })

      const duration = Date.now() - startTime
      this.updateAnalytics(true, duration)
      
      console.log('✅ E-mail admin envoyé avec succès:', {
        messageId: result.data?.id,
        company: data.companyName,
        duration: `${duration}ms`
      })

      return {
        success: true,
        messageId: result.data?.id,
        recipient: 'admin@zalamagn.com',
        template: 'admin-notification'
      }

    } catch (error) {
      const duration = Date.now() - startTime
      this.updateAnalytics(false, duration)
      
      const formattedError = this.formatEmailError(error)
      
      console.error('❌ Erreur envoi e-mail admin:', {
        company: data.companyName,
        error: formattedError,
        duration: `${duration}ms`
      })

      return {
        success: false,
        error: formattedError.message,
        errorType: formattedError.type,
        recipient: 'admin@zalamagn.com',
        template: 'admin-notification'
      }
    }
  }

  /**
   * Envoie un e-mail de confirmation au représentant de l'entreprise
   */
  async sendUserConfirmation(data: {
    legalRepresentative: string
    companyName: string
    docId: string
    repEmail: string
  }): Promise<EmailResult> {
    const startTime = Date.now()
    
    try {
      console.log('📧 Envoi e-mail confirmation utilisateur pour:', data.companyName)
      
      const htmlContent = getUserEmailTemplate(data)
      
              const result = await this.resend.emails.send({
          from: 'Zalama SAS <noreply@zalamagn.com>',
          to: [data.repEmail],
          subject: `Confirmation de votre demande de partenariat - ${data.companyName}`,
          html: htmlContent,
          headers: {
            'X-Partnership-ID': data.docId,
            'X-Company-Name': data.companyName
          }
        })

      const duration = Date.now() - startTime
      this.updateAnalytics(true, duration)
      
      console.log('✅ E-mail confirmation utilisateur envoyé:', {
        messageId: result.data?.id,
        company: data.companyName,
        recipient: data.repEmail,
        duration: `${duration}ms`
      })

      return {
        success: true,
        messageId: result.data?.id,
        recipient: data.repEmail,
        template: 'user-confirmation'
      }

    } catch (error) {
      const duration = Date.now() - startTime
      this.updateAnalytics(false, duration)
      
      const formattedError = this.formatEmailError(error)
      
      console.error('❌ Erreur envoi e-mail confirmation:', {
        company: data.companyName,
        recipient: data.repEmail,
        error: formattedError,
        duration: `${duration}ms`
      })

      return {
        success: false,
        error: formattedError.message,
        errorType: formattedError.type,
        recipient: data.repEmail,
        template: 'user-confirmation'
      }
    }
  }

  /**
   * Envoie les deux e-mails (admin + confirmation) pour une demande de partenariat
   */
  async sendPartnershipEmails(partnershipData: any): Promise<{
    adminEmail: EmailResult
    userEmail: EmailResult
    overallSuccess: boolean
  }> {
    console.log('📧 Début envoi e-mails partenariat pour:', partnershipData.company_name)
    
    // Préparation des données pour les templates
    const emailData: PartnershipEmailData = {
      companyName: partnershipData.company_name,
      legalStatus: partnershipData.legal_status,
      rccm: partnershipData.rccm,
      nif: partnershipData.nif,
      legalRepresentative: partnershipData.rep_full_name,
      position: partnershipData.rep_position,
      headquartersAddress: partnershipData.headquarters_address,
      phone: partnershipData.phone,
      email: partnershipData.email,
      employeesCount: partnershipData.employees_count.toString(),
      payroll: partnershipData.payroll,
      cdiCount: partnershipData.cdi_count.toString(),
      cddCount: partnershipData.cdd_count.toString(),
      docId: partnershipData.id.toString(),
      activityDomain: partnershipData.activity_domain,
      paymentDate: partnershipData.payment_date,
      repEmail: partnershipData.rep_email,
      repPhone: partnershipData.rep_phone,
      repPosition: partnershipData.rep_position,
      hrFullName: partnershipData.hr_full_name,
      hrEmail: partnershipData.hr_email,
      hrPhone: partnershipData.hr_phone
    }

    // Envoi parallèle des deux e-mails
    const [adminEmail, userEmail] = await Promise.allSettled([
      this.sendAdminNotification(emailData),
      this.sendUserConfirmation({
        legalRepresentative: partnershipData.rep_full_name,
        companyName: partnershipData.company_name,
        docId: partnershipData.id.toString(),
        repEmail: partnershipData.rep_email
      })
    ])

    const adminResult = adminEmail.status === 'fulfilled' ? adminEmail.value : {
      success: false,
      error: 'Envoi interrompu',
      errorType: 'unknown' as const,
      template: 'admin-notification'
    }

    const userResult = userEmail.status === 'fulfilled' ? userEmail.value : {
      success: false,
      error: 'Envoi interrompu',
      errorType: 'unknown' as const,
      template: 'user-confirmation'
    }

    const overallSuccess = adminResult.success && userResult.success

    console.log('📧 Résultats envoi e-mails partenariat:', {
      company: partnershipData.company_name,
      adminSuccess: adminResult.success,
      userSuccess: userResult.success,
      overallSuccess
    })

    return {
      adminEmail: adminResult,
      userEmail: userResult,
      overallSuccess
    }
  }

  /**
   * Formate les erreurs d'e-mail pour une meilleure lisibilité
   */
  private formatEmailError(error: any): { message: string; type: 'auth' | 'quota' | 'network' | 'validation' | 'unknown' } {
    const errorMessage = error?.message || error?.toString() || 'Erreur inconnue'
    
    // Classification des erreurs
    if (errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid API key')) {
      return { message: 'Erreur d\'authentification Resend', type: 'auth' }
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return { message: 'Quota d\'e-mails dépassé', type: 'quota' }
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return { message: 'Erreur réseau lors de l\'envoi', type: 'network' }
    }
    
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return { message: 'Données d\'e-mail invalides', type: 'validation' }
    }
    
    return { message: errorMessage, type: 'unknown' }
  }

  /**
   * Met à jour les statistiques d'envoi
   */
  private updateAnalytics(success: boolean, duration: number): void {
    this.analytics.sentCount++
    
    if (success) {
      this.analytics.successCount++
    } else {
      this.analytics.errorCount++
    }
    
    // Calcul de la moyenne des temps de réponse
    const totalTime = this.analytics.averageResponseTime * (this.analytics.sentCount - 1) + duration
    this.analytics.averageResponseTime = totalTime / this.analytics.sentCount
    
    this.analytics.lastSent = new Date()
  }

  /**
   * Récupère les statistiques d'envoi
   */
  getAnalytics(): EmailAnalytics {
    return { ...this.analytics }
  }

  /**
   * Vérifie la configuration du service
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test simple avec un e-mail de test
      await this.resend.emails.send({
        from: 'Zalama SAS <noreply@zalamagn.com>',
        to: ['test@example.com'],
        subject: 'Test de connexion',
        html: '<p>Test de connexion Resend</p>'
      })
      return true
    } catch (error) {
      console.error('❌ Test de connexion Resend échoué:', error)
      return false
    }
  }
}

// Instance singleton du service
export const emailService = new EmailService()

// Export des types pour utilisation externe
export type { EmailResult, EmailAnalytics, PartnershipEmailData } 