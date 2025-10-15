import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PayslipData {
  employee: {
    id: string
    nom: string
    prenom: string
    email: string
    telephone: string
    poste: string
    matricule: string
    type_contrat: string
    date_embauche: string
    photo_url?: string
  }
  company: {
    nom: string
    adresse?: string
    rccm?: string
    nif?: string
  }
  periode: {
    mois_nom: string
    annee: number
    debut: string
    fin: string
  }
  details: {
    salaire_brut: number
    salaire_net: number
    avances_deduites: number
    cotisations_inss: number
    impot_revenu: number
    prime_performance?: number
  }
  avances?: Array<{
    id: string
    montant: number
    date_demande: string
    statut: string
  }>
  paiement?: {
    reference: string
    date_paiement: string
    methode: string
    statut: string
    frais_intervention?: number
    montant_total_remboursement?: number
  }
  metadata: {
    generated_at: string
    generated_by: string
  }
}

export async function generatePayslipPDF(payslipData: PayslipData): Promise<Buffer> {
  try {
    console.log('📄 Génération du bulletin de paie pour:', payslipData.employee.prenom, payslipData.employee.nom)
    
    // Créer le HTML du bulletin de paie
    const htmlContent = generatePayslipHTML(payslipData)
    
    // Créer un élément temporaire pour le rendu avec isolation complète
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    
    // Isolation complète des styles
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '560px'
    tempDiv.style.backgroundColor = '#f5f7fa'
    tempDiv.style.fontFamily = 'Arial, Helvetica, sans-serif'
    tempDiv.style.fontSize = '14px'
    tempDiv.style.lineHeight = '1.4'
    tempDiv.style.color = '#000000'
    tempDiv.style.margin = '0'
    tempDiv.style.padding = '0'
    tempDiv.style.border = 'none'
    tempDiv.style.outline = 'none'
    tempDiv.style.boxShadow = 'none'
    tempDiv.style.isolation = 'isolate'
    
    // Créer un iframe pour isoler complètement les styles
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.left = '-9999px'
    iframe.style.top = '0'
    iframe.style.width = '560px'
    iframe.style.height = '800px'
    iframe.style.border = 'none'
    iframe.style.backgroundColor = '#ffffff'
    iframe.style.margin = '0'
    iframe.style.padding = '0'
    document.body.appendChild(iframe)
    
    // Écrire le contenu dans l'iframe
    iframe.contentDocument?.open()
    iframe.contentDocument?.write(htmlContent)
    iframe.contentDocument?.close()
    
    // Attendre que l'iframe soit chargé
    await new Promise(resolve => {
      iframe.onload = resolve
      iframe.onerror = resolve
    })
    
    try {
      // Attendre un peu pour que l'iframe soit complètement rendu
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Convertir HTML en canvas avec une meilleure qualité en utilisant l'iframe
      const canvas = await html2canvas(iframe.contentDocument?.body || tempDiv, {
        scale: 2, // Augmenter l'échelle pour plus de netteté
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 560,
        height: 800,
        logging: false,
        ignoreElements: (element) => {
          // Ignorer les éléments qui pourraient causer des problèmes
          return element.tagName === 'SCRIPT' || element.tagName === 'STYLE'
        }
      })
      
      // Créer le PDF
      const imgData = canvas.toDataURL('image/png', 1.0) // Qualité maximale
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // Dimensions A4
      const pageWidth = 210
      const pageHeight = 297
      const margin = 15
      
      // Calculer les dimensions de l'image pour qu'elle tienne sur une page
      const maxWidth = pageWidth - (2 * margin)
      const maxHeight = pageHeight - (2 * margin)
      
      // Calculer les dimensions proportionnelles
      const imgWidth = maxWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Centrer parfaitement - calcul précis
      const xOffset = margin
      const yOffset = margin + (maxHeight - Math.min(imgHeight, maxHeight)) / 2
      
      // Ajouter l'image centrée sur une seule page
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, Math.min(imgHeight, maxHeight), '', 'MEDIUM')
      
      // Retourner le PDF comme Buffer
      const pdfBuffer = pdf.output('arraybuffer')
      return Buffer.from(pdfBuffer)
      
    } finally {
      // Nettoyer les éléments temporaires
      if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv)
      }
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
      }
    }
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF bulletin de paie:', error)
    throw error
  }
}

function generatePayslipHTML(payslipData: PayslipData): string {
  const currentMonth = payslipData.periode.mois_nom
  const currentYear = payslipData.periode.annee
  const employeeName = `${payslipData.employee.prenom} ${payslipData.employee.nom}`
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Bulletin de Paie - ZaLaMa Guinée</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Styles responsive compatibles email clients -->
    <style>
        /* Reset de base pour les emails */
        body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
        .img-fluid { max-width: 100% !important; height: auto !important; display: block !important; }
        .logo { height: auto !important; }
        .cta-table { margin-left: auto; margin-right: auto; max-width: 320px; }
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .stack-col { display: block !important; width: 100% !important; max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
            .stack-col + .stack-col { padding-top: 8px !important; }
            .sm-px-16 { padding-left: 16px !important; padding-right: 16px !important; }
            .sm-p-16 { padding: 16px !important; }
            .sm-text-center { text-align: center !important; }
            .sm-text-left { text-align: left !important; }
            .sm-hide { display: none !important; width: 0 !important; height: 0 !important; overflow: hidden !important; }
            .btn { display: block !important; width: auto !important; max-width: 200px !important; text-align: center !important; margin-left: auto !important; margin-right: auto !important; }
            .btn-td { width: 100% !important; text-align: center !important; }
            .cta-table { width: 100% !important; max-width: 100% !important; text-align: center !important; }
            .logo { max-width: 100px !important; }
            .brand-name { font-size: 18px !important; text-align: center !important; display: block !important; margin-top: 6px !important; }
            h1 { font-size: 20px !important; line-height: 26px !important; }
            p, li { font-size: 14px !important; line-height: 20px !important; }
            table.payroll-table { width: 100% !important; }
            th, td { font-size: 14px !important; }
        }
    </style>
    <!--[if mso]>
    <style type="text/css">
        table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    </style>
    <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#ffffff;">
    <!-- Pré-en-tête (aperçu dans la boîte de réception) -->
    <div style="display:none; font-size:1px; color:#ffffff; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
        Votre bulletin de paie pour ${currentMonth} ${currentYear}
        </div>

    <!-- Conteneur principal -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding:0; background-color:#ffffff;">
                <!-- Carte -->
                <table role="presentation" class="container" border="0" cellpadding="0" cellspacing="0" width="560" style="width:560px; max-width:100%; background:#ffffff; border-radius:0; overflow:hidden; border:none; box-shadow:none;">

                    <!-- En-tête -->
                    <tr>
                        <td align="center" style="padding:14px 16px; background:#0D18B0;" class="sm-px-16 sm-p-16 sm-text-center">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center" style="font-family:Arial, Helvetica, sans-serif;">
                                        <a href="https://www.zalamagn.com" style="text-decoration:none; display:inline-block;">
                                            <img src="https://mspmrzlqhwpdkkburjiw.supabase.co/storage/v1/object/public/employee-photos/5d7582f0-20a3-4a2c-8fbd-4a9bdb85f053/1756767589759.jpg" alt="ZaLaMa" width="100" class="logo img-fluid" style="display:block; border:0; outline:none; text-decoration:none; max-width:100px; height:auto;">
                                        </a>
                                        <div class="brand-name" style="color:#ffffff; font-weight:700; font-size:20px; line-height:1; margin-top:6px;">ZaLaMa Guinée</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

        <!-- Titre principal -->
                    <tr>
                        <td align="left" style="padding:28px 24px 8px 24px;" class="sm-px-16">
                            <h1 style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:28px; color:#0D18B0; font-weight:700; border-bottom:3px solid #FF6922; padding-bottom:8px;">
                Votre Bulletin de Paie - ${currentMonth} ${currentYear}
            </h1>
                        </td>
                    </tr>

        <!-- Paragraphe d'introduction -->
                    <tr>
                        <td align="left" style="padding:0 24px 16px 24px;" class="sm-px-16">
                            <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px; color:#334155;">
                Bonjour <span style="font-weight: bold;">${employeeName}</span>,
            </p>
                            <p style="margin:12px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px; color:#334155;">
                Voici votre bulletin de paie pour la période de ${currentMonth} ${currentYear}. Veuillez trouver ci-dessous les détails de votre rémunération.
            </p>
                        </td>
                    </tr>

        <!-- Informations employeur/salarié -->
                    <tr>
                        <td align="left" style="padding:0 24px 16px 24px;" class="sm-px-16">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="stack-col" style="width:50%; padding-right:8px;" width="50%">
                                        <h3 style="margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#0D18B0;">Employeur</h3>
                                        <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:20px; color:#334155;">
                            ${payslipData.company.nom}<br>
                            ${payslipData.company.adresse || 'Quartier Almamya'}<br>
                            Conakry, Guinée<br>
                            RCCM: ${payslipData.company.rccm || 'GN.CCY.2025.A123456'}
                        </p>
                    </td>
                                    <td class="stack-col" style="width:50%; padding-left:8px;" width="50%">
                                        <h3 style="margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#0D18B0;">Salarié</h3>
                                        <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:20px; color:#334155;">
                            Nom: ${employeeName}<br>
                            Poste: ${payslipData.employee.poste}<br>
                            Contrat: ${payslipData.employee.type_contrat}
                        </p>
                    </td>
                </tr>
            </table>
                        </td>
                    </tr>

        <!-- Tableau du bulletin de paie -->
                    <tr>
                        <td align="left" style="padding:0 24px 16px 24px;" class="sm-px-16">
                            <table role="presentation" class="payroll-table" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #0D18B0;">
                <thead>
                    <tr>
                                        <th style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:15px; background-color:#0D18B0; color:#ffffff; text-align:left;">Description</th>
                                        <th style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:15px; background-color:#0D18B0; color:#ffffff; text-align:left;">Base</th>
                                        <th style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:15px; background-color:#0D18B0; color:#ffffff; text-align:left;">Taux</th>
                                        <th style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:15px; background-color:#0D18B0; color:#ffffff; text-align:right;">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155;">Salaire de base</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155;">-</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155;">-</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155; text-align:right;">${payslipData.details.salaire_brut.toLocaleString()} GNF</td>
                    </tr>
                    ${payslipData.details.avances_deduites > 0 ? `
                    <tr>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155;">Avance sur salaire (active)</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155;">-</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155;">-</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#334155; text-align:right;">-${payslipData.details.avances_deduites.toLocaleString()} GNF</td>
                    </tr>
                    ` : ''}
                                    <tr style="background-color:#FF6922; color:#ffffff;">
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:700;" colspan="3">Salaire net</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:700; text-align:right;">${payslipData.details.salaire_net.toLocaleString()} GNF</td>
                    </tr>
                                    <tr style="background-color:#e0e0e0; color:#0D18B0;">
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:700;" colspan="3">Salaire disponible (après avance)</td>
                                        <td style="padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:700; text-align:right;">${(payslipData.details.salaire_net - payslipData.details.avances_deduites).toLocaleString()} GNF</td>
                    </tr>
                </tbody>
            </table>
                        </td>
                    </tr>

        <!-- Bouton d'action -->
                    <tr>
                        <td align="center" style="padding:8px 24px 24px 24px;" class="sm-px-16">
                            <table align="center" role="presentation" border="0" cellspacing="0" cellpadding="0" class="cta-table" style="margin:0 auto;">
                                <tr>
                                    <td align="center" bgcolor="#FF6922" class="btn-td" style="border-radius:6px;">
                                        <a href="mailto:contactzalamagn@gmail.com" class="btn" style="display:inline-block; padding:12px 20px; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#ffffff; text-decoration:none; border-radius:6px; background-color:#FF6922;">
                Contactez le service RH
            </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

        <!-- Séparateur -->
                    <tr>
                        <td style="padding:12px 24px;" class="sm-px-16">
            <hr style="border:none; border-top:1px solid #e6ebf1; margin:0;">
                        </td>
                    </tr>

        <!-- Signature -->
                    <tr>
                        <td align="left" style="padding:16px 24px 24px 24px;" class="sm-px-16">
                            <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px; color:#334155;">
                Cordialement,<br>
                ZaLaMa Guinée<br>
                Equipe RH
            </p>
                            <p style="margin:8px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:20px; color:#64748b;">
                                ZaLaMa • +224 625 60 78 78 • <a href="https://www.zalamagn.com" style="color:#0D18B0; text-decoration:underline;">www.zalamagn.com</a>
            </p>
                        </td>
                    </tr>

        <!-- Pied de page légal -->
                    <tr>
                        <td align="center" style="padding:16px 24px 24px 24px; background:#f8fafc;" class="sm-px-16">
                            <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#94a3b8;">
                Vous recevez ce bulletin car vous êtes employé(e) de ZaLaMa Guinée.
            </p>
                            <p style="margin:8px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:18px; color:#94a3b8;">
                © 2025 ZaLaMa. Tous droits réservés.
            </p>
                        </td>
                    </tr>
                </table>
                <!-- /Carte -->
            </td>
        </tr>
    </table>
    <!-- /Conteneur principal -->
</body>
</html>
  `
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'
  
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'N/A'
  }
}