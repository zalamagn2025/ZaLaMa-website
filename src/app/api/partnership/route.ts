import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { enhancedSmsService } from '@/services/smsService'
import { smsAnalytics } from '@/utils/smsAnalytics'
import { SMSErrorHandler } from '@/middleware/smsErrorHandler'
import { logSmsError } from '@/utils/smsErrorFormatter'
import { emailService } from '@/services/emailService'

interface PartnershipData {
  companyName: string
  legalStatus: string
  rccm: string
  nif: string
  activityDomain: string
  headquartersAddress: string
  phone: string
  email: string
  employeesCount: string
  payroll: string
  cdiCount: string
  cddCount: string
  paymentDay: string
  agreement: boolean
  repFullName: string
  repEmail: string
  repPhone: string
  repPosition: string
  hrFullName: string
  hrEmail: string
  hrPhone: string
  motivationLetterUrl?: string // URL du fichier uploadé
  motivationLetterText?: string // Texte de la lettre rédigée
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    // Utiliser le client Supabase avec la clé anon pour l'insertion publique
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    const body = await request.json()
    
    console.log('📥 Données reçues:', body)
    console.log('📅 Payment Day reçu:', body.paymentDay)

    // Validation des données requises
    const requiredFields = [
      'companyName', 'legalStatus', 'rccm', 'nif', 'activityDomain',
      'headquartersAddress', 'phone', 'email', 'employeesCount', 'payroll',
      'cdiCount', 'cddCount', 'paymentDay', 'repFullName', 'repPosition',
      'repEmail', 'repPhone', 'hrFullName', 'hrEmail', 'hrPhone', 'agreement'
    ]

    // Validation de la lettre de motivation (au moins une option)
    const hasMotivationLetter = (body.motivationLetterUrl || body.motivation_letter_url) || 
                               (body.motivationLetterText || body.motivation_letter_text)
    
    if (!hasMotivationLetter) {
      return NextResponse.json(
        { error: 'Vous devez fournir une lettre de motivation (texte ou fichier)' },
        { status: 400 }
      )
    }

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        )
      }
    }

    // Validation de l'accord
    if (!body.agreement) {
      return NextResponse.json(
        { error: 'Vous devez accepter l\'engagement' },
        { status: 400 }
      )
    }

    // Validation des emails uniques
    const emails = [body.email, body.repEmail, body.hrEmail]
    const uniqueEmails = new Set(emails)
    if (uniqueEmails.size !== emails.length) {
      return NextResponse.json(
        { error: 'Les emails doivent être uniques' },
        { status: 400 }
      )
    }

    // Préparation des données pour Supabase
    const partnershipData = {
      company_name: body.companyName,
      legal_status: body.legalStatus,
      rccm: body.rccm,
      nif: body.nif,
      activity_domain: body.activityDomain,
      headquarters_address: body.headquartersAddress,
      phone: body.phone,
      email: body.email,
      employees_count: parseInt(body.employeesCount),
      payroll: body.payroll,
      cdi_count: parseInt(body.cdiCount),
      cdd_count: parseInt(body.cddCount),
      payment_date: new Date().toISOString().split('T')[0], // Date actuelle comme placeholder
      payment_day: body.paymentDay ? parseInt(body.paymentDay) : null,
      rep_full_name: body.repFullName,
      rep_position: body.repPosition,
      rep_email: body.repEmail,
      rep_phone: body.repPhone,
      hr_full_name: body.hrFullName,
      hr_email: body.hrEmail,
      hr_phone: body.hrPhone,
      agreement: body.agreement,
      motivation_letter_url: body.motivationLetterUrl || body.motivation_letter_url || null,
      motivation_letter_text: body.motivationLetterText || body.motivation_letter_text || null,
      status: 'pending'
    }

    console.log('📤 Tentative d\'insertion des données:', partnershipData)
    console.log('🔗 URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Clé Supabase configurée:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    console.log('📄 Lettre de motivation URL:', body.motivationLetterUrl || body.motivation_letter_url)
    console.log('📝 Lettre de motivation texte:', body.motivationLetterText || body.motivation_letter_text ? 'Présente' : 'Absente')

    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('partnership_requests')
      .insert([partnershipData])
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json(
        { 
          error: 'Erreur lors de l\'enregistrement de la demande', 
          details: error.message,
          hint: error.hint,
          code: error.code
        },
        { status: 500 }
      )
    }

    console.log('✅ Données insérées avec succès:', data)

    // Envoi SMS et e-mails de notification (non-bloquant)
    const smsStartTime = Date.now();
    const emailStartTime = Date.now();
    
    const smsPromise = enhancedSmsService.sendPartnershipNotification({
      partner_name: data.company_name,
      representative_phone: data.rep_phone,
      rh_phone: data.hr_phone, // Numéro RH dynamique depuis le formulaire
      request_id: data.id,
      submission_date: new Date()
    });

    const emailPromise = emailService.sendPartnershipEmails(data);

    // Réponse immédiate à l'utilisateur
    const response = NextResponse.json({
      success: true,
      message: 'Demande de partenariat enregistrée avec succès',
      data: {
        id: data.id,
        companyName: data.company_name,
        status: data.status
      },
      smsStatus: 'En cours d\'envoi',
      emailStatus: 'En cours d\'envoi'
    });

    // Gestion des SMS en arrière-plan
    smsPromise.then(smsResult => {
      const smsDuration = Date.now() - smsStartTime;
      
      // Tracking analytics
      smsAnalytics.trackSMSSend(smsResult, smsDuration);
      
      if (!smsResult.success) {
        console.error('❌ Échec envoi SMS:', {
          totalFailed: smsResult.summary.totalFailed,
          errors: smsResult.summary.errors,
          requestId: data.id,
          companyName: data.company_name
        });
        
        // Log détaillé des erreurs SMS
        smsResult.summary.errors.forEach((error: any, index: number) => {
          logSmsError(error, `Partnership SMS Error ${index + 1}`, {
            requestId: data.id,
            companyName: data.company_name,
            recipient: index === 0 ? 'RH' : 'Représentant'
          });
        });
        
        SMSErrorHandler.handleError(
          new Error(smsResult.summary.errors.join(', ')),
          'Partnership SMS Notification',
          { requestId: data.id, companyName: data.company_name }
        );
      } else {
        console.log('✅ SMS envoyés avec succès:', smsResult.summary);
      }
      
      // Log des performances
      console.log(`⏱️ SMS processing completed in ${smsDuration}ms`);
    }).catch(error => {
      console.error('❌ Erreur traitement SMS:', error);
      logSmsError(error, 'SMS Processing Error', { requestId: data.id });
      SMSErrorHandler.handleError(error, 'SMS Processing', { requestId: data.id });
    });

    // Gestion des e-mails en arrière-plan
    emailPromise.then(emailResult => {
      const emailDuration = Date.now() - emailStartTime;
      
      console.log('📧 Résultats envoi e-mails partenariat:', {
        company: data.company_name,
        adminSuccess: emailResult.adminEmail.success,
        userSuccess: emailResult.userEmail.success,
        overallSuccess: emailResult.overallSuccess,
        duration: `${emailDuration}ms`
      });

      // Log des erreurs d'e-mail si nécessaire
      if (!emailResult.adminEmail.success) {
        console.error('❌ Erreur e-mail admin:', {
          company: data.company_name,
          error: emailResult.adminEmail.error,
          errorType: emailResult.adminEmail.errorType
        });
      }

      if (!emailResult.userEmail.success) {
        console.error('❌ Erreur e-mail utilisateur:', {
          company: data.company_name,
          recipient: emailResult.userEmail.recipient,
          error: emailResult.userEmail.error,
          errorType: emailResult.userEmail.errorType
        });
      }

      // Log des performances
      console.log(`⏱️ Email processing completed in ${emailDuration}ms`);
    }).catch(error => {
      console.error('❌ Erreur critique e-mails:', {
        company: data.company_name,
        error: error.message || error
      });
    });

    return response;

  } catch (error) {
    console.error('💥 Erreur serveur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    
    // Pour la lecture, utiliser le client avec authentification
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Utiliser la clé service pour les admins
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Récupérer les demandes de partenariat
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des demandes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
