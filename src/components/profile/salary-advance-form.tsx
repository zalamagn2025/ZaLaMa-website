"use client"

import { UserWithEmployeData } from "@/types/employe"
import { IconCheck, IconCreditCard, IconInfoCircle, IconX } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SalaryAdvanceFormProps {
  onClose: () => void
}

interface AvanceData {
  salaireNet: number
  maxAvanceMonthly: number
  totalAvancesApprouvees: number
  avanceDisponible: number
}

export function SalaryAdvanceForm({ onClose, user }: SalaryAdvanceFormProps & { user: UserWithEmployeData }) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [receivePhone, setReceivePhone] = useState(user.telephone)
  const [useDefaultPhone, setUseDefaultPhone] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [avanceData, setAvanceData] = useState<AvanceData | null>(null)
  const [loadingAvance, setLoadingAvance] = useState(true)

  // Récupérer l'avance disponible en temps réel
  const fetchAvailableAdvance = async () => {
    try {
      setLoadingAvance(true)
      const response = await fetch(`/api/salary-advance/request?employeId=${user.employeId}&action=available-advance`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAvanceData({
            salaireNet: data.salaireNet,
            maxAvanceMonthly: data.maxAvanceMonthly,
            totalAvancesApprouvees: data.totalAvancesApprouvees,
            avanceDisponible: data.avanceDisponible
          })
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'avance disponible:', error)
    } finally {
      setLoadingAvance(false)
    }
  }

  useEffect(() => {
    if (user.employeId) {
      fetchAvailableAdvance()
    }
  }, [user.employeId])

  // Fonction pour calculer l'avance disponible (25% du salaire net) - DEPRECATED, remplacée par l'API
  const calculateAvailableAdvance = (salaireNet: number): number => {
    const maxAdvancePercentage = 0.25 // 25% du salaire
    return Math.floor(salaireNet * maxAdvancePercentage)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validation des données
      const requestedAmount = parseFloat(amount.replace(/,/g, ''))
      const availableAdvance = avanceData?.avanceDisponible || 0

      // Vérifications
      if (isNaN(requestedAmount) || requestedAmount <= 0) {
        throw new Error("Veuillez entrer un montant valide")
      }

      if (requestedAmount > availableAdvance) {
        throw new Error(`Le montant demandé dépasse votre avance disponible ce mois-ci (${availableAdvance.toLocaleString()} GNF)`)
      }

      if (!reason.trim()) {
        throw new Error("Veuillez indiquer le motif de votre demande")
      }

      if (!receivePhone?.trim()) {
        throw new Error("Veuillez indiquer un numéro de téléphone")
      }

      // Validation du numéro de téléphone (format guinéen)
      const phoneRegex = /^(\+224|224)?[6-7][0-9]{8}$/
      const cleanPhone = receivePhone.replace(/\s+/g, '').replace(/[-()]/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        throw new Error("Format de numéro de téléphone invalide")
      }

      // Calcul des frais de service (2%)
      const serviceFee = Math.floor(requestedAmount * 0.02)
      const totalDeduction = requestedAmount + serviceFee

      // Données de la demande
      const advanceRequest = {
        employeId: user.employeId,
        montantDemande: requestedAmount,
        motif: reason.trim(),
        numeroReception: cleanPhone,
        fraisService: serviceFee,
        montantTotal: totalDeduction,
        salaireDisponible: user.salaireNet,
        avanceDisponible: availableAdvance,
        dateCreation: new Date().toISOString(),
        statut: 'EN_ATTENTE',
        entrepriseId: user.partenaireId
      }

      // Appel API pour soumettre la demande
      const response = await fetch('/api/salary-advance/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(advanceRequest),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la soumission de la demande')
      }

      const result = await response.json()
      console.log("result", result)
      
      setSuccess(true)
      
      // Fermer le modal après 3 secondes
      setTimeout(() => {
        onClose()
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite')
    } finally {
      setLoading(false)
    }
  }

  // Calculer l'avance disponible pour l'affichage (utilise les données de l'API ou fallback)
  const availableAdvance = avanceData?.avanceDisponible ?? (user.salaireNet ? calculateAvailableAdvance(user.salaireNet) : 0)
  const totalUsedThisMonth = avanceData?.totalAvancesApprouvees ?? 0
  const maxMonthlyAdvance = avanceData?.maxAvanceMonthly ?? (user.salaireNet ? calculateAvailableAdvance(user.salaireNet) : 0)

  return (
    <div className="flex items-start justify-center min-h-screen pt-16"> {/* Changé de pt-10 à pt-16 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-[#010D3E] rounded-2xl shadow-2xl shadow-blue-500/10"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                className="text-center p-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
                  className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#FF671E] to-[#FF8E53] shadow-[0_0_15px_rgba(255,103,30,0.5)]"
                >
                  <IconCheck className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h3 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-6 text-xl font-semibold text-white"
                >
                  Demande envoyée avec succès
                </motion.h3>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mt-2 text-sm text-gray-300"
                >
                  Votre demande d&apos;avance sur salaire a été soumise et est en cours de traitement.
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53] shadow-lg"
                    >
                      <IconCreditCard className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">
                      Avance sur salaire
                    </h3>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-[#0A1A5A] transition-colors"
                  >
                    <IconX className="h-5 w-5 text-gray-300" />
                  </motion.button>
                </div>

                {/* Affichage des informations d'avance en temps réel */}
                {loadingAvance ? (
                  <div className="mb-4 p-4 rounded-xl bg-[#0A1A5A] border border-[#1A2B6B]">
                    <div className="animate-pulse">
                      <div className="h-4 bg-[#1A2B6B] rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-[#1A2B6B] rounded w-1/2"></div>
                    </div>
                  </div>
                ) : avanceData && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 p-4 rounded-xl bg-[#0A1A5A] border border-[#1A2B6B]"
                  >
                    <h4 className="text-sm font-medium text-[#FF8E53] mb-2">État de vos avances ce mois-ci</h4>
                    <div className="space-y-1 text-xs text-gray-300">
                      <div className="flex justify-between">
                        <span>Limite mensuelle (25%):</span>
                        <span className="text-white">{maxMonthlyAdvance.toLocaleString()} GNF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Déjà utilisé:</span>
                        <span className="text-orange-400">{totalUsedThisMonth.toLocaleString()} GNF</span>
                      </div>
                      <div className="flex justify-between border-t border-[#1A2B6B] pt-1">
                        <span>Disponible:</span>
                        <span className="text-green-400 font-medium">{availableAdvance.toLocaleString()} GNF</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="space-y-1"
                  >
                    <label htmlFor="amount" className="text-sm font-medium text-gray-300">
                      Montant demandé (GNF)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => {
                          // Permettre seulement les nombres et virgules
                          const value = e.target.value.replace(/[^0-9,]/g, '')
                          setAmount(value)
                          setError("") // Réinitialiser l'erreur lors de la saisie
                        }}
                        className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white"
                        placeholder="Ex: 500,000"
                        required
                      />
                      <span className="absolute right-3 top-3 text-xs text-gray-400">
                        GNF
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Disponible ce mois-ci: {availableAdvance.toLocaleString()} GNF
                    </p>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-400"
                      >
                        {error}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="space-y-1"
                  >
                    <label htmlFor="reason" className="text-sm font-medium text-gray-300">
                      Motif de la demande
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white"
                      placeholder="Expliquez pourquoi vous avez besoin de cette avance..."
                      required
                    />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <label htmlFor="receive-phone" className="text-sm font-medium text-gray-300">
                        Numéro de réception
                      </label>
                      <div className="flex items-center space-x-2">
                        <label htmlFor="use-default" className="text-xs text-gray-400">
                          Utiliser mon numéro
                        </label>
                        <div className="relative inline-flex items-center">
                          <input
                            id="use-default"
                            type="checkbox"
                            className="sr-only peer"
                            checked={useDefaultPhone}
                            onChange={() => {
                              setUseDefaultPhone(!useDefaultPhone)
                              if (!useDefaultPhone) {
                                setReceivePhone(user.telephone)
                              }
                            }}
                          />
                          <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF671E] peer-checked:to-[#FF8E53]"></div>
                        </div>
                      </div>
                    </div>
                    <input
                      type="tel"
                      id="receive-phone"
                      value={receivePhone}
                      onChange={(e) => setReceivePhone(e.target.value)}
                      disabled={useDefaultPhone}
                      className={`block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white ${useDefaultPhone ? 'opacity-60' : ''}`}
                      placeholder="Ex: +224 625 21 21 15"
                      required
                    />
                    <p className="text-xs text-gray-400">
                      L&apos;argent sera envoyé via Mobile Money
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    className="p-4 rounded-xl bg-[#0A1A5A] border border-[#1A2B6B]"
                  >
                    <div className="flex items-start space-x-3">
                      <IconInfoCircle className="h-5 w-5 text-[#FF8E53] mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-[#FF8E53]">Informations importantes</h3>
                        <ul className="mt-2 space-y-1.5 text-xs text-gray-300">
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Limite mensuelle: 25% de votre salaire net ({maxMonthlyAdvance.toLocaleString()} GNF)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Vous pouvez faire plusieurs demandes dans le mois</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Le montant sera déduit de votre prochain salaire</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Frais de service: 2% du montant</span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Traitement sous 24 heures ouvrables</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <input
                      id="terms"
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-600 text-[#FF671E] focus:ring-[#FF671E] focus:ring-offset-0"
                      required
                    />
                    <label htmlFor="terms" className="text-xs text-gray-400">
                      J&apos;accepte que cette avance soit déduite de mon prochain salaire et je comprends les conditions générales.
                    </label>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    className="flex justify-end space-x-3 pt-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0A1A5A] hover:bg-[#142B7F] transition-colors duration-200"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63] shadow-lg hover:shadow-[#FF671E]/30 disabled:opacity-70 transition-all duration-200 relative overflow-hidden"
                    >
                      {loading ? (
                        <>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          <span className="opacity-0">Soumettre</span>
                        </>
                      ) : (
                        "Soumettre la demande"
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#010D3E] to-transparent pointer-events-none" />
      </motion.div>
    </div>
  )
}