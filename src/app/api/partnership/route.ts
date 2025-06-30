import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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
  paymentDate: string
  agreement: boolean
  repFullName: string
  repEmail: string
  repPhone: string
  repPosition: string
  hrFullName: string
  hrEmail: string
  hrPhone: string
}

export async function POST(request: NextRequest) {
  try {
    // Utiliser le client Supabase avec la clé anon pour l'insertion publique
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const body = await request.json()

    // Validation des données requises
    const requiredFields = [
      'companyName', 'legalStatus', 'rccm', 'nif', 'activityDomain',
      'headquartersAddress', 'phone', 'email', 'employeesCount', 'payroll',
      'cdiCount', 'cddCount', 'paymentDate', 'repFullName', 'repPosition',
      'repEmail', 'repPhone', 'hrFullName', 'hrEmail', 'hrPhone', 'agreement'
    ]

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
      payment_date: body.paymentDate,
      rep_full_name: body.repFullName,
      rep_position: body.repPosition,
      rep_email: body.repEmail,
      rep_phone: body.repPhone,
      hr_full_name: body.hrFullName,
      hr_email: body.hrEmail,
      hr_phone: body.hrPhone,
      agreement: body.agreement,
      status: 'pending'
    }

    console.log('📤 Tentative d\'insertion des données:', partnershipData)

    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('partnership_requests')
      .insert([partnershipData])
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement de la demande', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Données insérées avec succès:', data)

    // Envoi d'email de notification (optionnel)
    try {
      // Ici vous pouvez ajouter l'envoi d'email de notification
      // Par exemple avec Resend, SendGrid, etc.
      console.log('📧 Email de notification à envoyer pour:', data.id)
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError)
      // Ne pas faire échouer la requête si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: 'Demande de partenariat enregistrée avec succès',
      data: {
        id: data.id,
        companyName: data.company_name,
        status: data.status
      }
    })

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
    // Pour la lecture, utiliser le client avec authentification
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Utiliser la clé service pour les admins
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
