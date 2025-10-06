import { useState } from 'react'
import { generatePayslipPDF, PayslipData } from '@/services/payslipService'

export function usePayslipGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePayslip = async (employeeData: any, financialData: any) => {
    try {
      setIsGenerating(true)
      setError(null)

      // Préparer les données pour le bulletin de paie
      const currentDate = new Date()
      const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long' })
      const currentYear = currentDate.getFullYear()

      const payslipData: PayslipData = {
        employee: {
          id: employeeData.id,
          nom: employeeData.nom,
          prenom: employeeData.prenom,
          email: employeeData.email,
          telephone: employeeData.telephone,
          poste: employeeData.poste,
          matricule: employeeData.matricule,
          type_contrat: employeeData.type_contrat,
          date_embauche: employeeData.date_embauche,
          photo_url: employeeData.photo_url
        },
        company: {
          nom: employeeData.partner_info?.company_name || 'ZaLaMa Guinée',
          adresse: employeeData.partner_info?.adresse || 'Quartier Almamya, Conakry',
          rccm: employeeData.partner_info?.rccm || 'GN.CCY.2025.A123456',
          nif: employeeData.partner_info?.nif || 'GN-123456789'
        },
        periode: {
          mois_nom: currentMonth,
          annee: currentYear,
          debut: `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-01`,
          fin: `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${new Date(currentYear, currentDate.getMonth() + 1, 0).getDate()}`
        },
        details: {
          salaire_brut: financialData.salaireNet || 0,
          salaire_net: financialData.salaireRestant || 0,
          avances_deduites: financialData.avanceActif || 0,
          cotisations_inss: Math.round((financialData.salaireNet || 0) * 0.05), // 5% INSS
          impot_revenu: Math.round((financialData.salaireNet || 0) * 0.10), // 10% IGR
          prime_performance: 0 // À calculer selon les règles métier
        },
        avances: [], // À récupérer depuis l'API si nécessaire
        paiement: {
          reference: `PAY-${currentYear}${String(currentDate.getMonth() + 1).padStart(2, '0')}-${employeeData.matricule}`,
          date_paiement: currentDate.toISOString(),
          methode: 'Virement bancaire',
          statut: 'Payé'
        },
        metadata: {
          generated_at: currentDate.toISOString(),
          generated_by: 'Système ZaLaMa'
        }
      }

      // Générer le PDF
      const pdfBuffer = await generatePayslipPDF(payslipData)
      
      // Créer un blob et télécharger comme PDF
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `bulletin-paie-${employeeData.prenom}-${employeeData.nom}-${currentMonth}-${currentYear}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('Erreur lors de la génération du bulletin de paie:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de la génération du PDF')
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generatePayslip,
    isGenerating,
    error
  }
}
