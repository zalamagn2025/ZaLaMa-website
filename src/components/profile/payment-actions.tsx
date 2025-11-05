"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconDownload, IconShare, IconCopy, IconCheck, IconFileText, IconQrcode } from "@tabler/icons-react"
import { PaymentData } from "./payment-service-card"

interface PaymentActionsProps {
  payment: PaymentData
  onDownload?: (paymentId: string) => void
  onShare?: (paymentId: string) => void
}

export function PaymentActions({ payment, onDownload, onShare }: PaymentActionsProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generatePaymentLink = (paymentId: string) => {
    // En production, ceci devrait être l'URL réelle de votre application
    return `${window.location.origin}/payment/${paymentId}`
  }

  const generateQRCode = (paymentId: string) => {
    // En production, utilisez une vraie librairie QR code
    const paymentLink = generatePaymentLink(paymentId)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}`
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Simuler la génération du PDF
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Créer un PDF simple (en production, utilisez une vraie librairie PDF)
      const pdfContent = generateReceiptPDF(payment)
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `paiement-${payment.id}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      if (onDownload) {
        onDownload(payment.id)
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const paymentLink = generatePaymentLink(payment.id)
      
      if (navigator.share) {
        // Utiliser l'API de partage native si disponible
        await navigator.share({
          title: `Paiement de ${payment.clientName}`,
          text: `Paiement de ${payment.amount.toLocaleString()} GNF de ${payment.clientName}`,
          url: paymentLink
        })
      } else {
        // Fallback: copier le lien
        await navigator.clipboard.writeText(paymentLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
      
      if (onShare) {
        onShare(payment.id)
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      const paymentLink = generatePaymentLink(payment.id)
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
    }
  }

  const generateReceiptPDF = (payment: PaymentData) => {
    // En production, utilisez une vraie librairie PDF comme jsPDF
    const receiptContent = `
      RÉCÉPISSÉ DE PAIEMENT
      
      Référence: ${payment.reference || payment.id}
      Date: ${new Date(payment.createdAt).toLocaleDateString('fr-FR')}
      Client: ${payment.clientName}
      Email: ${payment.clientEmail}
      Montant: ${payment.amount.toLocaleString()} GNF
      Statut: ${payment.status}
      
      ${payment.notes ? `Notes: ${payment.notes}` : ''}
      
      Généré le: ${new Date().toLocaleString('fr-FR')}
    `
    
    return receiptContent
  }

  const canDownload = payment.status === 'received'
  const canShare = payment.status === 'pending' || payment.status === 'received'

  return (
    <div className="flex flex-col space-y-2">
      {/* Télécharger le reçu */}
      {canDownload && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Génération...
            </div>
          ) : (
            <div className="flex items-center">
              <IconDownload className="h-4 w-4 mr-2" />
              Télécharger PDF
            </div>
          )}
        </motion.button>
      )}

      {/* Partager */}
      {canShare && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center justify-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSharing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Partage...
            </div>
          ) : (
            <div className="flex items-center">
              <IconShare className="h-4 w-4 mr-2" />
              Partager
            </div>
          )}
        </motion.button>
      )}

      {/* Copier le lien */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopyLink}
        className="flex items-center justify-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300"
      >
        <div className="flex items-center">
          {copied ? (
            <>
              <IconCheck className="h-4 w-4 mr-2" />
              Copié !
            </>
          ) : (
            <>
              <IconCopy className="h-4 w-4 mr-2" />
              Copier le lien
            </>
          )}
        </div>
      </motion.button>

      {/* QR Code (optionnel) */}
      {canShare && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Ouvrir le QR code dans une nouvelle fenêtre
            const qrUrl = generateQRCode(payment.id)
            window.open(qrUrl, '_blank')
          }}
          className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300"
        >
          <div className="flex items-center">
            <IconQrcode className="h-4 w-4 mr-2" />
            QR Code
          </div>
        </motion.button>
      )}
    </div>
  )
}

// Hook pour gérer les actions de paiement
export function usePaymentActions() {
  const [isLoading, setIsLoading] = useState(false)

  const downloadReceipt = async (paymentId: string) => {
    setIsLoading(true)
    try {
      // Ici, vous feriez l'appel API pour télécharger le reçu
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const sharePayment = async (paymentId: string) => {
    setIsLoading(true)
    try {
      // Ici, vous feriez l'appel API pour partager le paiement
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Erreur lors du partage:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    downloadReceipt,
    sharePayment,
    isLoading
  }
}

