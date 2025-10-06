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
    
    // Créer un élément temporaire pour le rendu
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '480px'
    tempDiv.style.backgroundColor = '#f5f7fa'
    document.body.appendChild(tempDiv)
    
    try {
      // Convertir HTML en canvas avec une meilleure qualité
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Augmenter l'échelle pour plus de netteté
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f5f7fa',
        width: 600,
        height: tempDiv.scrollHeight,
        logging: false
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
      // Nettoyer l'élément temporaire
      document.body.removeChild(tempDiv)
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
    <style>
        body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
        .img-fluid { max-width: 100% !important; height: auto !important; display: block !important; }
        .logo { height: auto !important; }
        .cta-table { margin-left: auto; margin-right: auto; max-width: 320px; }
        body { margin:0; padding:0; background-color:#f5f7fa; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .container { width:480px; max-width:100%; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e6ebf1; box-shadow:0 6px 20px rgba(2,6,23,0.06); margin: 0 auto; }
        .header { padding:12px 16px; background:#0D18B0; text-align: center; }
        .brand-name { color:#ffffff; font-weight:700; font-size:18px; line-height:1; margin-top:4px; }
        .title { margin:0; font-size:20px; line-height:26px; color:#0D18B0; font-weight:700; border-bottom:3px solid #FF6922; padding-bottom:6px; }
        .content { padding:16px 20px 6px 20px; }
        .intro { padding:0 20px 10px 20px; }
        .info-section { padding:0 20px 10px 20px; }
        .payroll-section { padding:0 20px 10px 20px; }
        .action-section { padding:6px 20px 12px 20px; text-align: center; }
        .separator { padding:6px 20px; }
        .signature { padding:10px 20px 12px 20px; }
        .footer { padding:10px 20px 12px 20px; background:#f8fafc; text-align: center; }
        .payroll-table { width:100%; max-width:500px; border:1px solid #0D18B0; margin: 0 auto; border-collapse: collapse; }
        .payroll-table th { padding:10px 8px; font-size:14px; background-color:#0D18B0; color:#ffffff; text-align:left; font-weight:600; }
        .payroll-table td { padding:8px; font-size:13px; color:#334155; border-bottom: 1px solid #e6ebf1; }
        .payroll-table .total-row { background-color:#FF6922; color:#ffffff; font-weight:700; }
        .payroll-table .available-row { background-color:#e0e0e0; color:#0D18B0; font-weight:700; }
        .payroll-table tr:last-child td { border-bottom: none; }
        .btn { display:inline-block; padding:12px 20px; font-size:15px; color:#ffffff; text-decoration:none; border-radius:6px; background-color:#FF6922; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <!-- En-tête -->
        <div class="header">
            <div style="text-align: center;">
                <img src="${payslipData.employee.photo_url || 'https://mspmrzlqhwpdkkburjiw.supabase.co/storage/v1/object/public/employee-photos/default-avatar.png'}" alt="ZaLaMa" width="100" class="logo img-fluid" style="display:block; border:0; outline:none; text-decoration:none; max-width:100px; height:auto; margin: 0 auto;">
                <div class="brand-name">ZaLaMa Guinée</div>
            </div>
        </div>

        <!-- Titre principal -->
        <div class="content">
            <h1 class="title">
                Votre Bulletin de Paie - ${currentMonth} ${currentYear}
            </h1>
        </div>

        <!-- Paragraphe d'introduction -->
        <div class="intro">
            <p style="margin:0; font-size:15px; line-height:22px; color:#334155;">
                Bonjour <span style="font-weight: bold;">${employeeName}</span>,
            </p>
            <p style="margin:12px 0 0 0; font-size:15px; line-height:22px; color:#334155;">
                Voici votre bulletin de paie pour la période de ${currentMonth} ${currentYear}. Veuillez trouver ci-dessous les détails de votre rémunération.
            </p>
        </div>

        <!-- Informations employeur/salarié -->
        <div class="info-section">
            <table style="width:100%;">
                <tr>
                    <td style="width:50%; padding-right:8px;">
                        <h3 style="margin:0 0 8px 0; font-size:16px; color:#0D18B0;">Employeur</h3>
                        <p style="margin:0; font-size:14px; line-height:20px; color:#334155;">
                            ${payslipData.company.nom}<br>
                            ${payslipData.company.adresse || 'Quartier Almamya'}<br>
                            Conakry, Guinée<br>
                            RCCM: ${payslipData.company.rccm || 'GN.CCY.2025.A123456'}
                        </p>
                    </td>
                    <td style="width:50%; padding-left:8px;">
                        <h3 style="margin:0 0 8px 0; font-size:16px; color:#0D18B0;">Salarié</h3>
                        <p style="margin:0; font-size:14px; line-height:20px; color:#334155;">
                            Nom: ${employeeName}<br>
                            Matricule: ${payslipData.employee.matricule}<br>
                            Poste: ${payslipData.employee.poste}<br>
                            Contrat: ${payslipData.employee.type_contrat}
                        </p>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Tableau du bulletin de paie -->
        <div class="payroll-section" style="text-align: center;">
            <table class="payroll-table" style="display: inline-block;">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Base</th>
                        <th>Taux</th>
                        <th class="text-right">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Salaire de base</td>
                        <td>-</td>
                        <td>-</td>
                        <td class="text-right">${payslipData.details.salaire_brut.toLocaleString()} GNF</td>
                    </tr>
                    ${payslipData.details.prime_performance ? `
                    <tr>
                        <td>Prime de performance</td>
                        <td>-</td>
                        <td>-</td>
                        <td class="text-right">${payslipData.details.prime_performance.toLocaleString()} GNF</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td>Cotisations INSS (sécurité sociale)</td>
                        <td>${(payslipData.details.salaire_brut + (payslipData.details.prime_performance || 0)).toLocaleString()} GNF</td>
                        <td>5,00 %</td>
                        <td class="text-right">-${payslipData.details.cotisations_inss.toLocaleString()} GNF</td>
                    </tr>
                    <tr>
                        <td>Impôt sur le revenu (IGR)</td>
                        <td>${(payslipData.details.salaire_brut + (payslipData.details.prime_performance || 0)).toLocaleString()} GNF</td>
                        <td>10,00 %</td>
                        <td class="text-right">-${payslipData.details.impot_revenu.toLocaleString()} GNF</td>
                    </tr>
                    ${payslipData.details.avances_deduites > 0 ? `
                    <tr>
                        <td>Avance sur salaire (active)</td>
                        <td>-</td>
                        <td>-</td>
                        <td class="text-right">-${payslipData.details.avances_deduites.toLocaleString()} GNF</td>
                    </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td colspan="3">Salaire net</td>
                        <td class="text-right">${payslipData.details.salaire_net.toLocaleString()} GNF</td>
                    </tr>
                    <tr class="available-row">
                        <td colspan="3">Salaire disponible (après avance)</td>
                        <td class="text-right">${(payslipData.details.salaire_net - payslipData.details.avances_deduites).toLocaleString()} GNF</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Bouton d'action -->
        <div class="action-section">
            <a href="mailto:contactzalamagn@gmail.com" class="btn">
                Contactez le service RH
            </a>
        </div>

        <!-- Séparateur -->
        <div class="separator">
            <hr style="border:none; border-top:1px solid #e6ebf1; margin:0;">
        </div>

        <!-- Signature -->
        <div class="signature">
            <p style="margin:0; font-size:15px; line-height:22px; color:#334155;">
                Cordialement,<br>
                ZaLaMa Guinée<br>
                Equipe RH
            </p>
            <p style="margin:8px 0 0 0; font-size:13px; line-height:20px; color:#64748b;">
                ZaLaMa • +224 625 60 78 78 • www.zalamagn.com
            </p>
        </div>

        <!-- Pied de page légal -->
        <div class="footer">
            <p style="margin:0; font-size:12px; line-height:18px; color:#94a3b8;">
                Vous recevez ce bulletin car vous êtes employé(e) de ZaLaMa Guinée.
            </p>
            <p style="margin:8px 0 0 0; font-size:12px; line-height:18px; color:#94a3b8;">
                © 2025 ZaLaMa. Tous droits réservés.
            </p>
        </div>
    </div>
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