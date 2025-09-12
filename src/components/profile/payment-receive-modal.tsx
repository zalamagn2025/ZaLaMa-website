"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconX, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { PaymentData } from "./payment-service-card"

interface PaymentReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (receivedAmount: number, notes?: string) => void
  payment: PaymentData
  isLoading?: boolean
}

export function PaymentReceiveModal({
  isOpen,
  onClose,
  onConfirm,
  payment,
  isLoading = false
}: PaymentReceiveModalProps) {
  const [receivedAmount, setReceivedAmount] = useState<number>(payment.amount)
  const [notes, setNotes] = useState<string>("")
  const [errors, setErrors] = useState<{ amount?: string; general?: string }>({})

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReceivedAmount(payment.amount)
      setNotes("")
      setErrors({})
    }
  }, [isOpen, payment.amount])

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const validateForm = () => {
    const newErrors: { amount?: string; general?: string } = {}

    if (!receivedAmount || receivedAmount <= 0) {
      newErrors.amount = "Le montant doit être supérieur à 0"
    }

    if (receivedAmount > payment.amount) {
      newErrors.amount = "Le montant reçu ne peut pas dépasser le montant attendu"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onConfirm(receivedAmount, notes.trim() || undefined)
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
    if (!isNaN(numericValue)) {
      setReceivedAmount(numericValue)
    } else if (value === '') {
      setReceivedAmount(0)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md bg-[#010D3E] rounded-2xl p-6 shadow-xl border border-gray-100/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Confirmer la réception</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconX className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Informations du paiement */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60">Client:</span>
                <span className="text-white font-medium">{payment.clientName}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60">Montant attendu:</span>
                <span className="text-white font-medium">
                  {formatAmount(payment.amount, payment.currency)}
                </span>
              </div>
              {payment.reference && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Référence:</span>
                  <span className="text-white font-medium">{payment.reference}</span>
                </div>
              )}
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Montant reçu */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Montant reçu *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={receivedAmount > 0 ? receivedAmount.toLocaleString('fr-FR') : ''}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.amount ? 'border-red-500' : 'border-white/20'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 text-sm">
                    {payment.currency}
                  </span>
                </div>
                {errors.amount && (
                  <div className="flex items-center mt-1 text-red-400 text-sm">
                    <IconAlertCircle className="h-4 w-4 mr-1" />
                    {errors.amount}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur ce paiement..."
                  disabled={isLoading}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
              </div>

              {/* Erreur générale */}
              {errors.general && (
                <div className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <IconAlertCircle className="h-4 w-4 mr-2" />
                  {errors.general}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || receivedAmount <= 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Confirmation...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <IconCheck className="h-4 w-4 mr-2" />
                      Confirmer
                    </div>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

