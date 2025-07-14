"use client"

import { UserWithEmployeData } from "@/types/employe"
import { RequestType, REQUEST_TYPES } from "@/types/salary-advance"
import { IconCheck, IconCreditCard, IconEye, IconEyeOff, IconInfoCircle, IconLock, IconShieldCheck, IconX, IconCalendar, IconCalculator } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface SalaryAdvanceFormProps {
  onClose: () => void
}

interface AvanceData {
  salaireNet: number
  avanceActive: number
  salaireRestant: number
  maxAvanceMonthly: number
  totalAvancesApprouveesMonthly: number
  avanceDisponible: number
  workingDaysElapsed: number
  totalWorkingDays: number
  workingDaysPercentage: number
  limiteAvance: number
}

type FormStep = 'form' | 'verification' | 'confirmation' | 'success';

// Fonction pour calculer l'avance disponible pour les demandes d'avance sur salaire
function calculateAvailableAdvance(salaireNet: number): { avanceDisponible: number; workingDaysElapsed: number; totalWorkingDays: number; workingDaysPercentage: number; limiteAvance: number } {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  // Calculer le nombre de jours ouvrables écoulés ce mois (pour information)
  const workingDaysElapsed = getWorkingDaysElapsed(currentYear, currentMonth, today.getDate())
  const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
  const workingDaysPercentage = Math.round((workingDaysElapsed / totalWorkingDays) * 100)
  
  // L'avance disponible pour les demandes d'avance sur salaire est limitée à 25% du salaire net
  const avanceDisponible = Math.floor(salaireNet * 0.25)
  const limiteAvance = avanceDisponible // Même valeur que l'avance disponible
  
  return {
    avanceDisponible,
    workingDaysElapsed,
    totalWorkingDays,
    workingDaysPercentage,
    limiteAvance
  }
}

// Fonction pour calculer les jours ouvrables écoulés
function getWorkingDaysElapsed(year: number, month: number, currentDay: number): number {
  let workingDays = 0
  
  for (let day = 1; day <= currentDay; day++) {
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()
    
    // Exclure samedi (6) et dimanche (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++
    }
  }
  
  return workingDays
}

// Fonction pour calculer le total de jours ouvrables dans le mois
function getTotalWorkingDaysInMonth(year: number, month: number): number {
  const lastDay = new Date(year, month + 1, 0).getDate()
  let totalWorkingDays = 0
  
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()
    
    // Exclure samedi (6) et dimanche (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      totalWorkingDays++
    }
  }
  
  return totalWorkingDays
}

export function SalaryAdvanceForm({ onClose, user }: SalaryAdvanceFormProps & { user: UserWithEmployeData }) {
  // États du formulaire
  const [amount, setAmount] = useState("")
  const [requestType, setRequestType] = useState<RequestType>('aucune')
  const [reason, setReason] = useState("")
  const [receivePhone, setReceivePhone] = useState(user.telephone)
  const [useDefaultPhone, setUseDefaultPhone] = useState(true)
  
  // États de l'interface
  const [currentStep, setCurrentStep] = useState<FormStep>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [avanceData, setAvanceData] = useState<AvanceData | null>(null)
  const [loadingAvance, setLoadingAvance] = useState(true)
  const [showAdvanceDetails, setShowAdvanceDetails] = useState(false)
  
  // États de confirmation
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  
  const router = useRouter()

  // Log des données utilisateur pour débogage
  console.log('🔍 Données utilisateur dans SalaryAdvanceForm:', {
    employeId: user.employeId,
    partenaireId: user.partenaireId,
    salaireNet: user.salaireNet,
    nom: user.nom,
    prenom: user.prenom
  })

  // Calculer l'avance disponible en temps réel
  const calculateAdvanceData = useCallback(() => {
    if (!user.salaireNet) {
      setAvanceData(null)
      setLoadingAvance(false)
      return
    }

    try {
      const calculation = calculateAvailableAdvance(user.salaireNet)
      
          setAvanceData({
        salaireNet: user.salaireNet,
        avanceActive: 0, // Sera mis à jour par l'API
        salaireRestant: user.salaireNet - calculation.avanceDisponible,
        maxAvanceMonthly: Math.floor(user.salaireNet * 0.25), // 25% max
        totalAvancesApprouveesMonthly: 0, // Sera mis à jour par l'API
        avanceDisponible: calculation.avanceDisponible,
        workingDaysElapsed: calculation.workingDaysElapsed,
        totalWorkingDays: calculation.totalWorkingDays,
        workingDaysPercentage: calculation.workingDaysPercentage,
        limiteAvance: calculation.limiteAvance
      })
      
      console.log('🔍 Données d\'avance calculées:', calculation)
    } catch (error) {
      console.error('Erreur lors du calcul de l\'avance disponible:', error)
    } finally {
      setLoadingAvance(false)
    }
  }, [user.salaireNet])

  useEffect(() => {
    calculateAdvanceData()
  }, [calculateAdvanceData])

  // Actualiser les données quand le composant devient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        calculateAdvanceData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [calculateAdvanceData])

  // Validation du formulaire
  const validateForm = () => {
      const requestedAmount = parseFloat(amount.replace(/,/g, ''))
      const limiteAvance = avanceData?.limiteAvance || 0

      if (isNaN(requestedAmount) || requestedAmount <= 0) {
        throw new Error("Veuillez entrer un montant valide")
      }

      if (requestedAmount > limiteAvance) {
        throw new Error(`Le montant demandé dépasse votre limite d'avance sur salaire ce mois-ci (${limiteAvance.toLocaleString()} GNF)`)
      }

      if (!requestType || requestType === "aucune") {
        throw new Error("Veuillez sélectionner un type de motif")
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

    return {
      requestedAmount,
      cleanPhone,
      serviceFee: Math.floor(requestedAmount * 0.065),
      totalDeduction: requestedAmount + Math.floor(requestedAmount * 0.065)
    }
  }

  // Étape 1: Validation du formulaire et passage à la vérification
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      validateForm()
      setCurrentStep('verification')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite')
    }
  }

  // Étape 2: Confirmation et passage à la saisie du mot de passe
  const handleVerificationConfirm = () => {
    setCurrentStep('confirmation')
  }

  // Étape 3: Validation du mot de passe et soumission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPasswordError("")

    try {
      if (!password.trim()) {
        throw new Error("Veuillez saisir votre mot de passe")
      }

      const validation = validateForm()

      // Données de la demande
      const advanceRequest = {
        employeId: user.employeId,
        montantDemande: validation.requestedAmount,
        typeMotif: requestType,
        motif: reason.trim(),
        numeroReception: validation.cleanPhone,
        fraisService: validation.serviceFee,
        montantTotal: validation.totalDeduction,
        salaireDisponible: user.salaireNet,
        avanceDisponible: avanceData?.avanceDisponible || 0,
        dateCreation: new Date().toISOString(),
        statut: 'EN_ATTENTE',
        entrepriseId: user.partenaireId,
        password: password
      }

      console.log('📤 Données envoyées à l\'API:', advanceRequest)

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
      
      // Actualiser la page
    router.refresh()
      
      // Actualiser les données d'avance après la soumission
      calculateAdvanceData()
      
      setCurrentStep('success')
      
      // Fermer le modal après 3 secondes
      setTimeout(() => {
        onClose()
      }, 3000)

    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite')
    } finally {
      setLoading(false)
    }
  }

  // Retour à l'étape précédente
  const goBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('form')
    } else if (currentStep === 'confirmation') {
      setCurrentStep('verification')
    }
  }

  // Calculer l'avance disponible pour l'affichage
  const availableAdvance = avanceData?.avanceDisponible ?? 0
  const totalUsedThisMonth = avanceData?.totalAvancesApprouveesMonthly ?? 0
  const maxMonthlyAdvance = avanceData?.maxAvanceMonthly ?? 0
  const avanceActive = avanceData?.avanceActive ?? 0
  const salaireRestant = avanceData?.salaireRestant ?? (user.salaireNet || 0)

  // Calculs pour l'affichage de vérification
  const requestedAmount = parseFloat(amount.replace(/,/g, '')) || 0
  const serviceFee = Math.floor(requestedAmount * 0.065)
  const totalDeduction = requestedAmount + serviceFee

  return (
    <div className="flex items-start justify-center min-h-screen pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg bg-[#010D3E] rounded-2xl shadow-2xl shadow-blue-500/10"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
          <AnimatePresence mode="wait">
            {currentStep === 'success' ? (
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
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="p-2 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53] shadow-lg"
                    >
                      <IconCreditCard className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                    <h3 className="text-2xl font-bold text-white">
                      Demande d'avance sur salaire
                    </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${currentStep === 'form' ? 'bg-[#FF671E]' : 'bg-gray-600'}`} />
                        <div className={`w-2 h-2 rounded-full ${currentStep === 'verification' ? 'bg-[#FF671E]' : 'bg-gray-600'}`} />
                        <div className={`w-2 h-2 rounded-full ${currentStep === 'confirmation' ? 'bg-[#FF671E]' : 'bg-gray-600'}`} />
                      </div>
                    </div>
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

                {/* Étape 1: Formulaire */}
                {currentStep === 'form' && (
                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-6"
                  >
                    {/* Affichage des informations d'avance */}
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
                        className="mb-4 p-4 rounded-xl bg-gradient-to-br from-[#0A1A5A] to-[#142B7F] border border-[#1A2B6B] shadow-lg"
                      >
                        {/* Header avec icône et titre */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53]">
                              <IconCalculator className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="text-sm font-semibold text-[#FF8E53]">Avance Disponible (25% du salaire net)</h4>
                          </div>
                       <button
                            type="button"
                            onClick={() => setShowAdvanceDetails(!showAdvanceDetails)}
                            className="text-xs text-gray-400 hover:text-[#FF8E53] transition-colors"
                            title={showAdvanceDetails ? "Masquer les détails" : "Voir les détails"}
                          >
                            {showAdvanceDetails ? "−" : "+"}
                       </button>
                     </div>

                        {/* Montant principal */}
                        <div className="text-center mb-3">
                          <div className="text-2xl font-bold text-white">
                            {avanceData.avanceDisponible.toLocaleString()} GNF
                          </div>
                          {/* <div className="text-xs text-gray-400 mt-1">
                            Avance disponible (25% du salaire net)
                          </div> */}
                          <div className="text-xs text-blue-400 mt-1">
                            Progression du mois: {avanceData.workingDaysElapsed}/{avanceData.totalWorkingDays} jours ({avanceData.workingDaysPercentage}%)
                          </div>
                        </div>

                        {/* Détails dépliables */}
                        <AnimatePresence>
                          {showAdvanceDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-[#1A2B6B] pt-3 space-y-2"
                            >
                              {/* Barre de progression */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">Progression du mois</span>
                                  <span className="text-white">{avanceData.workingDaysPercentage}%</span>
                                </div>
                                <div className="w-full bg-[#1A2B6B] rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${avanceData.workingDaysPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-2 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-full"
                                  />
                                </div>
                              </div>

                              {/* Informations détaillées */}
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="space-y-1">
                       <div className="flex justify-between">
                                    <span className="text-gray-400">Salaire net:</span>
                                    <span className="text-white font-medium">{avanceData.salaireNet.toLocaleString()} GNF</span>
                       </div>
                       <div className="flex justify-between">
                                    <span className="text-gray-400">Jours écoulés:</span>
                                    <span className="text-blue-400">{avanceData.workingDaysElapsed} jours</span>
                       </div>
                       <div className="flex justify-between">
                                    <span className="text-gray-400">Total jours:</span>
                                    <span className="text-blue-400">{avanceData.totalWorkingDays} jours</span>
                                  </div>
                       </div>
                                <div className="space-y-1">
                         <div className="flex justify-between">
                            <span className="text-gray-400">Limite d'avance:</span>
                            <span className="text-orange-400">{avanceData.maxAvanceMonthly.toLocaleString()} GNF</span>
                         </div>
                         <div className="flex justify-between">
                                    <span className="text-gray-400">Salaire restant:</span>
                                    <span className="text-green-400 font-medium">{avanceData.salaireRestant.toLocaleString()} GNF</span>
                         </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Avances actives:</span>
                                    <span className="text-red-400">{avanceData.avanceActive.toLocaleString()} GNF</span>
                         </div>
                       </div>
                     </div>

                              {/* Indicateur de statut */}
                              <div className="flex items-center justify-center space-x-2 pt-2">
                                <IconCalendar className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  Mis à jour le {new Date().toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                   </motion.div>
                )}

                    {/* Montant demandé */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="space-y-1"
                  >
                    <label htmlFor="amount" className="text-sm font-medium text-gray-300">
                      Montant demandé
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9,]/g, '')
                          setAmount(value)
                            setError("")
                        }}
                        className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white"
                        placeholder="Ex: 500,000"
                        required
                      />
                      <span className="absolute right-3 top-3 text-xs text-gray-400">
                        GNF
                      </span>
                    </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          Limite d'avance: {avanceData?.limiteAvance.toLocaleString() || 0} GNF
                        </span>
                        {amount && avanceData && (
                          <span className={`font-medium ${
                            parseFloat(amount.replace(/,/g, '')) > avanceData.limiteAvance 
                              ? 'text-red-400' 
                              : 'text-green-400'
                          }`}>
                            {parseFloat(amount.replace(/,/g, '')) > avanceData.limiteAvance 
                              ? 'Montant trop élevé' 
                              : 'Montant valide'
                            }
                          </span>
                        )}
                      </div>
                    
                  </motion.div>

                    {/* Type de motif et détails */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="requestType" className="block text-sm font-medium text-gray-300 mb-1">
                        Type de motif
                      </label>
                      <select
                        id="requestType"
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value as RequestType)}
                        className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 text-white"
                        required
                      >
                        {REQUEST_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-400 ml-1">Sélectionnez la catégorie de votre demande</p>
                      {error && (
                        <motion.p 
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-400"
                        >
                          {error}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">
                        Détails du motif
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
                    </div>
                  </motion.div>

                    {/* Numéro de téléphone */}
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="space-y-3"
                  >
                      {/* <div className="flex items-start space-x-3">
                        <input
                          id="useDefaultPhone"
                          type="checkbox"
                          checked={useDefaultPhone}
                          onChange={(e) => setUseDefaultPhone(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-gray-600 text-[#FF671E] focus:ring-[#FF671E] focus:ring-offset-0"
                        />
                        <label htmlFor="useDefaultPhone" className="text-sm text-gray-300">
                          Utiliser mon numéro de téléphone par défaut ({user.telephone})
                        </label>
                      </div> */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <label htmlFor="receivePhone" className="text-sm font-medium text-gray-300">
                      Numéro de téléphone pour réception
                    </label>
                    <input
                      type="tel"
                            id="receivePhone"
                      value={receivePhone}
                      onChange={(e) => setReceivePhone(e.target.value)}
                            className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white"
                            placeholder="Ex: +224 6 12 34 56 78"
                      required
                    />
                          <p className="text-xs text-gray-400">Format: +224 6/7 XX XX XX XX</p>
                  </motion.div>
                  
                  </motion.div>

                    {/* Conditions */}
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

                    {/* Boutons */}
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
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63] shadow-lg hover:shadow-[#FF671E]/30 transition-all duration-200"
                      >
                        Continuer
                      </motion.button>
                    </motion.div>
                  </motion.form>
                )}

                {/* Étape 2: Vérification */}
                {currentStep === 'verification' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg mb-4"
                      >
                        <IconShieldCheck className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">Détails de la demande</h3>
                      <p className="text-sm text-gray-300">Assurez-vous que toutes les informations sont correctes avant de continuer</p>
                    </div>

                    <div className="space-y-4 p-4 rounded-xl bg-[#0A1A5A] border border-[#1A2B6B]">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Montant demandé:</span>
                          <p className="text-white font-medium">{requestedAmount.toLocaleString()} GNF</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Frais de service (6.5%):</span>
                          <p className="text-red-400">-{serviceFee.toLocaleString()} GNF</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Total à recevoir:</span>
                          <p className="text-green-400 font-bold text-lg">{(Number(requestedAmount || 0) - Number(serviceFee || 0)).toLocaleString('fr-FR')} GNF</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-[#1A2B6B] pt-4 space-y-2">
                        <div>
                          <span className="text-gray-400">Type de motif:</span>
                          <p className="text-white">{REQUEST_TYPES.find(t => t.value === requestType)?.label}</p>
                        </div>
                        {/* <div>
                          <span className="text-gray-400">Détails:</span>
                          <p className="text-white">{reason}</p>
                        </div> */}
                        <div>
                          <span className="text-gray-400">Numéro de réception:</span>
                          <p className="text-white">{useDefaultPhone ? user.telephone : receivePhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goBack}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0A1A5A] hover:bg-[#142B7F] transition-colors duration-200"
                      >
                        Retour
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVerificationConfirm}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63] shadow-lg hover:shadow-[#FF671E]/30 transition-all duration-200"
                      >
                        Confirmer
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3: Confirmation par mot de passe */}
                {currentStep === 'confirmation' && (
                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handlePasswordSubmit}
                    autoComplete="off" // désactive l'autocomplétion au niveau du formulaire
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg mb-4"
                      >
                        <IconLock className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">Confirmation finale</h3>
                      <p className="text-sm text-gray-300">Saisissez votre mot de passe pour confirmer la demande</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                          Mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="confirmPassword" // nom modifié pour ne pas déclencher l'autoremplissage
                            autoComplete="new-password" // empêche le navigateur de proposer un mot de passe enregistré
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              setPasswordError("")
                            }}
                            className="block w-full px-4 py-3 bg-[#0A1A5A] border-0 rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:ring-offset-2 transition-all duration-200 placeholder-gray-400 text-white pr-12"
                            placeholder="Votre mot de passe"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <IconEyeOff className="h-5 w-5" /> : <IconEye className="h-5 w-5" />}
                          </button>
                        </div>
                        {passwordError && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400 mt-1"
                          >
                            {passwordError}
                          </motion.p>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
                        <div className="flex items-start space-x-3">
                          <IconInfoCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-200">
                            <p className="font-medium mb-1">⚠️ Attention</p>
                            <p>En confirmant, vous acceptez que {requestedAmount.toLocaleString()} GNF soit déduit de votre prochain salaire.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={goBack}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0A1A5A] hover:bg-[#142B7F] transition-colors duration-200"
                      >
                        Retour
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
                            <span className="opacity-0">Confirmation...</span>
                          </>
                        ) : (
                          "Confirmer la demande"
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#010D3E] to-transparent pointer-events-none" />
      </motion.div>
    </div>
  )
}