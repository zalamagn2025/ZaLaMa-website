"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconDownload, IconCheck, IconClock, IconX, IconEye } from "@tabler/icons-react"
import { PaymentReceiveModal } from "./payment-receive-modal"

export interface PaymentData {
  id: string
  clientName: string
  clientEmail: string
  amount: number
  currency: string
  status: 'pending' | 'received' | 'cancelled' | 'expired'
  createdAt: string
  receivedAt?: string
  notes?: string
  reference?: string
  // Propriétés spécifiques aux retraits
  type?: 'RETRAIT' | 'PAIEMENT'
  typeCompte?: string
  numeroReception?: string
  fraisRetrait?: number
  transfer?: any
}

interface PaymentServiceCardProps {
  payment: PaymentData
  onStatusChange?: (paymentId: string, newStatus: PaymentData['status']) => void
  onDownload?: (paymentId: string) => void
}

export function PaymentServiceCard({ 
  payment, 
  onStatusChange, 
  onDownload
}: PaymentServiceCardProps) {
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getStatusConfig = (status: PaymentData['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En attente',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/20',
          borderColor: 'border-yellow-400/30',
          icon: IconClock
        }
      case 'received':
        return {
          label: 'Reçu',
          color: 'text-green-400',
          bgColor: 'bg-green-400/20',
          borderColor: 'border-green-400/30',
          icon: IconCheck
        }
      case 'cancelled':
        return {
          label: 'Annulé',
          color: 'text-red-400',
          bgColor: 'bg-red-400/20',
          borderColor: 'border-red-400/30',
          icon: IconX
        }
      case 'expired':
        return {
          label: 'Expiré',
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/20',
          borderColor: 'border-gray-400/30',
          icon: IconClock
        }
      default:
        return {
          label: 'Inconnu',
          color: 'text-gray-400',
          bgColor: 'bg-gray-400/20',
          borderColor: 'border-gray-400/30',
          icon: IconClock
        }
    }
  }

  const statusConfig = getStatusConfig(payment.status)
  const StatusIcon = statusConfig.icon

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleReceive = async () => {
    setIsReceiveModalOpen(true)
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload(payment.id)
    }
  }


  const handleReceiveConfirm = async (receivedAmount: number, notes?: string) => {
    setIsLoading(true)
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onStatusChange) {
        onStatusChange(payment.id, 'received')
      }
      
      setIsReceiveModalOpen(false)
    } catch (error) {
      console.error('Erreur lors de la réception du paiement:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const canReceive = payment.status === 'pending'
  const canDownload = payment.status === 'received'
  const canShare = payment.status === 'pending' || payment.status === 'received'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border ${statusConfig.borderColor} transition-all duration-300 relative overflow-hidden`}
      >
        {/* Header avec statut */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{payment.clientName}</h3>
              <p className="text-sm text-white/60">{payment.clientEmail}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
            {statusConfig.label}
          </div>
        </div>

        {/* Montant et référence */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">
              {formatAmount(payment.amount, payment.currency)}
            </span>
            {payment.reference && (
              <span className="text-sm text-white/60">
                Ref: {payment.reference}
              </span>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="mb-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Créé le:</span>
            <span className="text-white">{formatDate(payment.createdAt)}</span>
          </div>
          {payment.receivedAt && (
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Reçu le:</span>
              <span className="text-white">{formatDate(payment.receivedAt)}</span>
            </div>
          )}
        </div>

        {/* Notes si présentes */}
        {payment.notes && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <p className="text-sm text-white/80">{payment.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {canReceive && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReceive}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Traitement...' : 'Recevoir'}
            </motion.button>
          )}
          
          {canDownload && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
            >
              <IconDownload className="h-4 w-4" />
            </motion.button>
          )}
          
        </div>
      </motion.div>

      {/* Modal de réception */}
      <PaymentReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        onConfirm={handleReceiveConfirm}
        payment={payment}
        isLoading={isLoading}
      />
    </>
  )
}

