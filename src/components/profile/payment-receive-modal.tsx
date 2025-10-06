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
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(payment.amount)
  const [withdrawAll, setWithdrawAll] = useState<boolean>(false)
  const [accountType, setAccountType] = useState<string>("ORANGE_MONEY")
  const [accountNumber, setAccountNumber] = useState<string>("")
  const [errors, setErrors] = useState<{ amount?: string; accountType?: string; accountNumber?: string; general?: string }>({})

  // Calculer les frais selon le type de compte
  const calculateFees = (amount: number, type: string) => {
    if (type === "ESPECES") {
      return Math.round(amount * 0.02) // 2% de frais
    }
    return 0 // 0% de frais pour les autres types
  }

  const fees = calculateFees(withdrawalAmount, accountType)
  const finalAmount = withdrawalAmount - fees

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setWithdrawalAmount(payment.amount)
      setWithdrawAll(false)
      setAccountType("ORANGE_MONEY")
      setAccountNumber("")
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
    const newErrors: { amount?: string; accountType?: string; accountNumber?: string; general?: string } = {}

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      newErrors.amount = "Le montant doit être supérieur à 0"
    }

    if (withdrawalAmount > payment.amount) {
      newErrors.amount = "Le montant à retirer ne peut pas dépasser le salaire disponible"
    }

    if (!accountType) {
      newErrors.accountType = "Le type de compte est obligatoire"
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Le numéro de compte est obligatoire"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      // Appel à l'edge function employee-withdrawal
      const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')
      if (!accessToken) {
        setErrors({ general: "Token d'authentification manquant" })
        return
      }

      // L'employe_id et nom_beneficiaire sont maintenant extraits automatiquement du token JWT

      const requestData = {
        action: "create",
        montant_demande: withdrawalAmount,
        numero_reception: accountNumber,
        type_compte: accountType,
        type_retrait: "RETRAIT_SALAIRE",
        commentaire: `Retrait de salaire - ${withdrawAll ? 'Montant total' : 'Montant partiel'}`
      }
      
      console.log('📤 Données envoyées à l\'API:', requestData)
      console.log('🔑 Token utilisé:', accessToken.substring(0, 20) + '...')

      const response = await fetch('/api/employee/withdrawal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Retrait créé avec succès:', result)
        onConfirm(withdrawalAmount)
      } else {
        const errorData = await response.json()
        console.error('❌ Erreur lors de la création du retrait:', errorData)
        setErrors({ 
          general: errorData.error || errorData.message || "Erreur lors de la création du retrait" 
        })
      }
    } catch (error) {
      console.error('❌ Erreur lors du retrait:', error)
      setErrors({ 
        general: error instanceof Error ? error.message : "Erreur de connexion. Veuillez réessayer." 
      })
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
    if (!isNaN(numericValue)) {
      setWithdrawalAmount(numericValue)
    } else if (value === '') {
      setWithdrawalAmount(0)
    }
  }

  const handleWithdrawAllChange = (checked: boolean) => {
    setWithdrawAll(checked)
    if (checked) {
      setWithdrawalAmount(payment.amount)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg bg-[#010D3E] rounded-2xl shadow-2xl shadow-blue-500/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[90vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
              {/* Header avec bouton fermer */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-lg">
                    <IconCheck className="h-6 w-6 text-white" />
                  </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">Créer un retrait</h2>
                            <p className="text-sm text-gray-400">Retirez votre salaire disponible</p>
                          </div>
                </div>
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
              <div className="mb-6 p-4 bg-[#0A1A5A] rounded-xl border border-[#1A2B6B]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">
                    {payment.clientName === "Paiement de salaire" ? "Type de paiement:" : "Client:"}
                  </span>
                <span className="text-white font-medium">{payment.clientName}</span>
              </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">Salaire disponible:</span>
                  <span className="text-[#FF8E53] font-bold text-lg">
                  {formatAmount(payment.amount, payment.currency)}
                </span>
              </div>
              {payment.reference && (
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Référence:</span>
                  <span className="text-white font-medium">{payment.reference}</span>
                </div>
              )}
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-orange-300 text-sm">
                    💡 <strong>Retrait de salaire :</strong> Remplissez les informations de votre compte pour recevoir votre salaire. Le retrait sera traité sous 24h.
                  </p>
                </div>
            </div>

            {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Montant à retirer */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-gray-300 mb-2">
                    Montant à retirer *
                </label>
                <div className="relative">
                  <input
                      id="withdrawalAmount"
                    type="text"
                      value={withdrawalAmount > 0 ? withdrawalAmount.toLocaleString('fr-FR') : ''}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                      disabled={isLoading || withdrawAll}
                      className={`block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white ${
                        errors.amount ? 'ring-2 ring-red-500' : ''
                      } ${withdrawAll ? 'opacity-50' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    {payment.currency}
                  </span>
                </div>
                  
                  {/* Checkbox "Retirer tout" */}
                  <div className="mt-3 flex items-center">
                    <input
                      id="withdrawAll"
                      type="checkbox"
                      checked={withdrawAll}
                      onChange={(e) => handleWithdrawAllChange(e.target.checked)}
                      disabled={isLoading}
                      className="h-4 w-4 text-[#FF671E] bg-[#0A1A5A] border-gray-300 rounded focus:ring-[#FF671E] focus:ring-2"
                    />
                    <label htmlFor="withdrawAll" className="ml-2 text-sm text-gray-300">
                      Retirer tout le salaire disponible ({payment.amount.toLocaleString('fr-FR')} {payment.currency})
                    </label>
                  </div>

                  {/* Affichage des frais et montant final */}
                  {withdrawalAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="mt-4 p-3 bg-[#0A1A5A]/50 rounded-lg border border-gray-600/30"
                    >
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Montant demandé:</span>
                          <span>{withdrawalAmount.toLocaleString('fr-FR')} {payment.currency}</span>
                        </div>
                        {fees > 0 && (
                          <div className="flex justify-between text-orange-400">
                            <span>Frais de retrait (2%):</span>
                            <span>-{fees.toLocaleString('fr-FR')} {payment.currency}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-white font-semibold border-t border-gray-600/30 pt-2">
                          <span>Montant final reçu:</span>
                          <span>{finalAmount.toLocaleString('fr-FR')} {payment.currency}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                {errors.amount && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 mt-1"
                    >
                    {errors.amount}
                    </motion.p>
                  )}
                </motion.div>

                {/* Type de compte */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <label htmlFor="accountType" className="block text-sm font-medium text-gray-300 mb-2">
                    Type de compte *
                  </label>
                  <select
                    id="accountType"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    disabled={isLoading}
                    className={`block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 text-white ${
                      errors.accountType ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <option value="ORANGE_MONEY">Orange Money (0% frais)</option>
                    <option value="MOBILE_MONEY">Mobile Money (0% frais)</option>
                    <option value="PAYCARD">PayCard (0% frais)</option>
                    <option value="BANQUE">Banque (0% frais)</option>
                    <option value="ESPECES">Espèces (2% frais)</option>
                  </select>
                  {errors.accountType && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 mt-1"
                    >
                      {errors.accountType}
                    </motion.p>
                  )}
                </motion.div>


                {/* Numéro de compte */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-2">
                    Numéro de compte *
                </label>
                  <input
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Entrez le numéro de compte (téléphone, carte, etc.)"
                  disabled={isLoading}
                    className={`block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white ${
                      errors.accountNumber ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  {errors.accountNumber && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 mt-1"
                    >
                      {errors.accountNumber}
                    </motion.p>
                  )}
                </motion.div>

              {/* Erreur générale */}
              {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                  <IconAlertCircle className="h-4 w-4 mr-2" />
                  {errors.general}
                  </motion.div>
              )}

              {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="flex space-x-3 pt-6"
                >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-[#1A2B6B] hover:bg-[#2A3B7B] text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                    disabled={isLoading || withdrawalAmount <= 0}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63] text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Création du retrait...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <IconCheck className="h-4 w-4 mr-2" />
                        Créer le retrait
                    </div>
                  )}
                </motion.button>
                </motion.div>
              </form>
              </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

