"use client"

import { UserWithEmployeData } from "@/types/employe"
import { RequestType, REQUEST_TYPES } from "@/types/salary-advance"
import { IconCheck, IconCreditCard, IconEye, IconEyeOff, IconInfoCircle, IconLock, IconShieldCheck, IconX, IconCalendar, IconCalculator, IconAlertCircle } from "@tabler/icons-react"
import PinInput from "@/components/common/PinInput"
import CurrencyInput from "@/components/ui/currency-input"
import PhoneInput from "@/components/ui/phone-input"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEmployeeDemands } from "@/hooks/useEmployeeDemands"

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
  multiMonthLimit: number
  minimumMultiMonth: number
}

type FormStep = 'form' | 'verification' | 'confirmation' | 'success';

// Fonction pour calculer l'avance disponible pour les demandes d'avance sur salaire
function calculateAvailableAdvance(salaireNet: number, avanceActive: number = 0, enableMultiMonths: boolean = false, months: number = 1): { 
  avanceDisponible: number; 
  workingDaysElapsed: number; 
  totalWorkingDays: number; 
  workingDaysPercentage: number; 
  limiteAvance: number;
  multiMonthLimit: number;
  minimumMultiMonth: number;
} {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  // Calculer le nombre de jours ouvrables écoulés ce mois (pour information)
  const workingDaysElapsed = getWorkingDaysElapsed(currentYear, currentMonth, today.getDate())
  const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
  const workingDaysPercentage = Math.round((workingDaysElapsed / totalWorkingDays) * 100)
  
  // Calculer les limites selon le mode (normal ou multi-mois)
  let limiteAvanceBase: number
  let multiMonthLimit = 0
  let minimumMultiMonth = 0
  
  if (enableMultiMonths && months > 1) {
    // Mode multi-mois : 30% du salaire net × nombre de mois
    limiteAvanceBase = Math.floor(salaireNet * 0.30 * months)
    multiMonthLimit = limiteAvanceBase
    minimumMultiMonth = Math.floor(salaireNet * 0.30 * months) // Minimum requis
  } else {
    // Mode normal : 50% du salaire net
    limiteAvanceBase = Math.floor(salaireNet * 0.50)
    multiMonthLimit = 0
    minimumMultiMonth = 0
  }
  
  const avanceDisponible = Math.max(0, limiteAvanceBase - avanceActive)
  const limiteAvance = avanceDisponible
  
  return {
    avanceDisponible,
    workingDaysElapsed,
    totalWorkingDays,
    workingDaysPercentage,
    limiteAvance,
    multiMonthLimit,
    minimumMultiMonth
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
  const [receivePhone, setReceivePhone] = useState(user.telephone || '')
  const [useDefaultPhone, setUseDefaultPhone] = useState(true)
  
  // États pour la fonctionnalité multi-mois
  const [enableMultiMonths, setEnableMultiMonths] = useState(false)
  const [selectedMonths, setSelectedMonths] = useState(2) // 2 mois par défaut quand multi-mois activé
  
  // États de l'interface
  const [currentStep, setCurrentStep] = useState<FormStep>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [avanceData, setAvanceData] = useState<AvanceData | null>(null)
  const [loadingAvance, setLoadingAvance] = useState(true)
  const [showAdvanceDetails, setShowAdvanceDetails] = useState(false)
  const [financialData, setFinancialData] = useState<any>(null)
  
  // États de confirmation
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [pinError, setPinError] = useState("")
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  
  // États pour les toasts
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    show: boolean
  }>({
    type: 'info',
    message: '',
    show: false
  })
  
  // État pour gérer le focus sur les champs
  const [isAmountFocused, setIsAmountFocused] = useState(false)
  const [isPhoneFocused, setIsPhoneFocused] = useState(false)
  
  // États pour la validation des composants
  const [isAmountValid, setIsAmountValid] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [amountNumericValue, setAmountNumericValue] = useState(0)
  
  const router = useRouter()

  // Hook pour les nouvelles APIs Edge Function
  const { demands, stats, createDemand, isLoadingDemands, isLoadingStats, isCreating } = useEmployeeDemands()

  // Fonctions pour gérer les toasts
  const showToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setToast({ type, message, show: true })
    // Auto-dismiss après 5 secondes
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 5000)
  }, [])

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, show: false }))
  }, [])

  // Log des données utilisateur pour débogage
  /*console.log('🔍 Données utilisateur dans SalaryAdvanceForm:', {
    employeId: user.employeId,
    partenaireId: user.partenaireId,
    salaireNet: user.salaireNet,
    nom: user.nom,
    prenom: user.prenom
  })*/

  // États pour les avances actives (maintenant gérés par le hook)
  const advanceRequests = demands || []
  const loadingAdvanceRequests = isLoadingDemands

  // Charger les données financières depuis l'Edge Function
  const loadFinancialData = useCallback(async () => {
    try {
      setLoadingAvance(true)
      setError("")
      
      // Récupérer le token d'accès depuis localStorage
      const accessToken = localStorage.getItem('employee_access_token')
      
      if (!accessToken) {
        setError('Token d\'accès non trouvé')
      return
    }

      // Appeler l'API getme pour récupérer les données financières
      const response = await fetch('/api/auth/getme', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          /*console.log('📊 Données financières récupérées dans le formulaire:', result.data)*/
          setFinancialData(result.data)
        } else {
          setError(result.error || 'Erreur lors du chargement des données')
        }
      } else {
        setError('Erreur de connexion au serveur')
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des données financières:', err)
      setError('Erreur de connexion')
    } finally {
      setLoadingAvance(false)
    }
  }, [])

  // Récupérer les avances actives (maintenant géré par le hook useEmployeeDemands)
  const fetchAdvanceRequests = useCallback(async () => {
    // Cette fonction n'est plus nécessaire car le hook gère automatiquement la récupération
    /*console.log('📋 Récupération des avances gérée par le hook useEmployeeDemands')*/
  }, [])

  // Calculer l'avance disponible en temps réel avec les données de l'Edge Function
  const calculateAdvanceData = useCallback(() => {
    if (!financialData?.financial) {
      setAvanceData(null)
      setLoadingAvance(false)
      return
    }

    try {
      const financial = financialData.financial
      
      // Utiliser les données de l'Edge Function
      const salaireNet = financial.salaireNet || 0
      const avanceActive = financial.avanceActif || 0
      const avanceDisponible = financial.avanceDisponible || 0
      const salaireRestant = financial.salaireRestant || 0
      
             // Calculer les jours ouvrables pour information - FORCER le calcul local
       const today = new Date()
       const currentMonth = today.getMonth()
       const currentYear = today.getFullYear()
       const currentDay = Math.max(1, today.getDate()) // S'assurer que le jour minimum est 1
       
       // Calculer directement les jours ouvrables
       let workingDaysElapsed = 0
       for (let day = 1; day <= currentDay; day++) {
         const date = new Date(currentYear, currentMonth, day)
         const dayOfWeek = date.getDay()
         if (dayOfWeek !== 0 && dayOfWeek !== 6) {
           workingDaysElapsed++
         }
       }
       
       // Calculer le total des jours ouvrables du mois
       const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate()
       let totalWorkingDays = 0
       for (let day = 1; day <= lastDay; day++) {
         const date = new Date(currentYear, currentMonth, day)
         const dayOfWeek = date.getDay()
         if (dayOfWeek !== 0 && dayOfWeek !== 6) {
           totalWorkingDays++
         }
       }
       
       const workingDaysPercentage = Math.round((workingDaysElapsed / totalWorkingDays) * 100)
       
       /*console.log('📅 Calcul FORCÉ des jours ouvrables:', {
         currentYear,
         currentMonth,
         currentDay,
         workingDaysElapsed,
         totalWorkingDays,
         workingDaysPercentage
       })*/
      
      // Calculer les limites multi-mois
      const multiMonthLimit = enableMultiMonths && selectedMonths > 1 
        ? Math.floor(salaireNet * 0.30 * selectedMonths) 
        : 0
      const minimumMultiMonth = enableMultiMonths && selectedMonths > 1 
        ? Math.floor(salaireNet * 0.30 * selectedMonths) 
        : 0

      setAvanceData({
        salaireNet: salaireNet,
        avanceActive: avanceActive, // Total des avances actives depuis l'Edge Function
        salaireRestant: salaireRestant, // Salaire restant depuis l'Edge Function
        maxAvanceMonthly: Math.floor(salaireNet * 0.30), // 30% max pour auto-approbation
        totalAvancesApprouveesMonthly: avanceActive, // Total des avances approuvées depuis l'Edge Function
        avanceDisponible: avanceDisponible, // Avance disponible depuis l'Edge Function
        workingDaysElapsed: workingDaysElapsed,
        totalWorkingDays: totalWorkingDays,
        workingDaysPercentage: workingDaysPercentage,
        limiteAvance: enableMultiMonths && selectedMonths > 1 ? multiMonthLimit : avanceDisponible,
        multiMonthLimit: multiMonthLimit,
        minimumMultiMonth: minimumMultiMonth
      })
      
      /*console.log('🔍 Données d\'avance calculées avec Edge Function:', {
        salaireNet,
        avanceActive,
        salaireRestant,
        avanceDisponible,
        workingDaysElapsed,
        totalWorkingDays
      })*/
    } catch (error) {
      console.error('Erreur lors du calcul de l\'avance disponible:', error)
    } finally {
      setLoadingAvance(false)
    }
  }, [financialData, enableMultiMonths, selectedMonths])

  // Charger les données financières au chargement
  useEffect(() => {
    loadFinancialData()
  }, [loadFinancialData])

  // Recalculer quand les données financières changent
  useEffect(() => {
    calculateAdvanceData()
  }, [calculateAdvanceData])
  
  // Forcer le calcul des jours ouvrables indépendamment des données financières
  useEffect(() => {
    const calculateWorkingDays = () => {
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()
      const currentDay = Math.max(1, today.getDate())
      
      // Calculer directement les jours ouvrables
      let workingDaysElapsed = 0
      for (let day = 1; day <= currentDay; day++) {
        const date = new Date(currentYear, currentMonth, day)
        const dayOfWeek = date.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          workingDaysElapsed++
        }
      }
      
      // Calculer le total des jours ouvrables du mois
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate()
      let totalWorkingDays = 0
      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(currentYear, currentMonth, day)
        const dayOfWeek = date.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          totalWorkingDays++
        }
      }
      
      const workingDaysPercentage = Math.round((workingDaysElapsed / totalWorkingDays) * 100)
      
      /*console.log('🚀 Calcul FORCÉ des jours ouvrables au chargement:', {
        currentYear,
        currentMonth,
        currentDay,
        workingDaysElapsed,
        totalWorkingDays,
        workingDaysPercentage
      })*/
      
      // Mettre à jour l'état si avanceData existe déjà
      if (avanceData) {
        setAvanceData(prev => prev ? {
          ...prev,
          workingDaysElapsed,
          totalWorkingDays,
          workingDaysPercentage
        } : null)
      }
    }
    
    // Exécuter immédiatement
    calculateWorkingDays()
    
    // Et aussi après un délai pour s'assurer que c'est fait
    const timer = setTimeout(calculateWorkingDays, 500)
    
    return () => clearTimeout(timer)
  }, []) // ✅ CORRECTION: Supprimer avanceData des dépendances pour éviter la boucle infinie
  


  // Actualiser les données quand le composant devient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadFinancialData()
        calculateAdvanceData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [loadFinancialData, calculateAdvanceData])


  // Validation du formulaire
  const validateForm = () => {
      const requestedAmount = amountNumericValue
      const limiteAvance = avanceData?.limiteAvance || 0
      const minimumMultiMonth = avanceData?.minimumMultiMonth || 0

      if (!isAmountValid || requestedAmount <= 0) {
        showToast('error', "Veuillez entrer un montant valide")
        throw new Error("Veuillez entrer un montant valide")
      }

      // Validation spécifique pour le mode multi-mois
      if (enableMultiMonths && selectedMonths > 1) {
        if (requestedAmount < minimumMultiMonth) {
          const errorMsg = `Le montant minimum pour ${selectedMonths} mois est de ${minimumMultiMonth.toLocaleString()} GNF (30% × ${selectedMonths} mois)`
          showToast('warning', errorMsg)
          throw new Error(errorMsg)
        }
        if (requestedAmount > limiteAvance) {
          const errorMsg = `Le montant demandé dépasse la limite pour ${selectedMonths} mois (${limiteAvance.toLocaleString()} GNF)`
          showToast('error', errorMsg)
          throw new Error(errorMsg)
        }
      } else {
        // Validation normale
        if (requestedAmount > limiteAvance) {
          const errorMsg = `Le montant demandé dépasse votre limite d'avance sur salaire ce mois-ci (${limiteAvance.toLocaleString()} GNF)`
          showToast('error', errorMsg)
          throw new Error(errorMsg)
        }
      }

      if (!requestType || requestType === "aucune") {
        showToast('error', "Veuillez sélectionner un type de motif")
        throw new Error("Veuillez sélectionner un type de motif")
      }

      if (!reason.trim()) {
        showToast('error', "Veuillez indiquer le motif de votre demande")
        throw new Error("Veuillez indiquer le motif de votre demande")
      }

      if (!isPhoneValid || !receivePhone?.trim()) {
        showToast('error', "Veuillez indiquer un numéro de téléphone valide")
        throw new Error("Veuillez indiquer un numéro de téléphone valide")
      }

      // Nettoyer le numéro de téléphone pour l'API
      const cleanPhone = receivePhone.replace(/\s+/g, '').replace(/[-()]/g, '')

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
      // L'erreur est déjà gérée par validateForm avec showToast
      setError(err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite')
    }
  }

  // Étape 2: Confirmation et passage à la saisie du mot de passe
  const handleVerificationConfirm = () => {
    setCurrentStep('confirmation')
  }

  // Étape 3: Validation du PIN et soumission
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPinError("")

    try {
      if (!pin.trim() || pin.length !== 6) {
        showToast('error', "Veuillez saisir un code PIN à 6 chiffres")
        throw new Error("Veuillez saisir un code PIN à 6 chiffres")
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
        password: pin // Envoyer le PIN comme "password" pour la compatibilité backend
      }

      /*console.log('📤 Données envoyées à l\'API:', advanceRequest)*/

      // Utiliser le hook createDemand pour soumettre la demande via Edge Function
      const demandData = {
        montant_demande: validation.requestedAmount,
        type_motif: requestType,
        motif: reason.trim(),
        numero_reception: validation.cleanPhone,
        // Ajouter les paramètres multi-mois si activés
        ...(enableMultiMonths && selectedMonths > 1 && {
          enable_multi_months: true,
          months: selectedMonths
        })
      }

      /*console.log('📝 Création de la demande via Edge Function:', demandData)*/
      
      const result = await createDemand(demandData)
      /*console.log("✅ Demande créée avec succès:", result)*/
      
      // Toast de succès
      showToast('success', `Demande d'avance de ${validation.requestedAmount.toLocaleString()} GNF envoyée avec succès !`)
      
      // Actualiser la page
      router.refresh()
      
      setCurrentStep('success')
      
      // Fermer le modal après 3 secondes
      setTimeout(() => {
        onClose()
      }, 3000)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue s\'est produite'
      showToast('error', errorMessage)
      setPinError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Fonctions de gestion du PIN
  const handlePinChange = (value: string) => {
    // Filtrer pour ne garder que les chiffres
    const numericValue = value.replace(/\D/g, '');
    // Limiter à 6 chiffres
    const limitedValue = numericValue.slice(0, 6);
    setPin(limitedValue);
    setHasUserInteracted(true);
    setPinError(''); // Effacer l'erreur quand l'utilisateur tape
  };

  const handlePinFocus = () => {
    setHasUserInteracted(true);
  };

  const handlePinBlur = () => {
    // Blur géré par le composant PinInput
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

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
      {/* Toast System */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`backdrop-blur-xl border rounded-xl px-6 py-4 shadow-2xl max-w-md ${
              toast.type === 'success' 
                ? 'bg-green-900/90 border-green-700' 
                : toast.type === 'error'
                ? 'bg-red-900/90 border-red-700'
                : toast.type === 'warning'
                ? 'bg-yellow-900/90 border-yellow-700'
                : 'bg-blue-900/90 border-blue-700'
            }`}>
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <IconCheck className="w-5 h-5 text-green-400 flex-shrink-0" />}
                {toast.type === 'error' && <IconX className="w-5 h-5 text-red-400 flex-shrink-0" />}
                {toast.type === 'warning' && <IconAlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />}
                {toast.type === 'info' && <IconInfoCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />}
                <div>
                  <p className={`font-medium text-sm ${
                    toast.type === 'success' 
                      ? 'text-green-100' 
                      : toast.type === 'error'
                      ? 'text-red-100'
                      : toast.type === 'warning'
                      ? 'text-yellow-100'
                      : 'text-blue-100'
                  }`}>
                    {toast.type === 'success' ? 'Succès' : 
                     toast.type === 'error' ? 'Erreur' :
                     toast.type === 'warning' ? 'Attention' : 'Information'}
                  </p>
                  <p className={`text-xs mt-1 ${
                    toast.type === 'success' 
                      ? 'text-green-200' 
                      : toast.type === 'error'
                      ? 'text-red-200'
                      : toast.type === 'warning'
                      ? 'text-yellow-200'
                      : 'text-blue-200'
                  }`}>
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={hideToast}
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    {/* Résumé financier simplifié */}
                    {(loadingAvance || loadingAdvanceRequests) ? (
                      <div className="mb-6 p-4 rounded-xl bg-[#0A1A5A] border border-[#1A2B6B]">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-[#1A2B6B] rounded w-3/4"></div>
                          <div className="h-3 bg-[#1A2B6B] rounded w-1/2"></div>
                        </div>
                      </div>
                    ) : avanceData && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 p-5 rounded-xl bg-gradient-to-br from-[#0A1A5A] to-[#142B7F] border border-[#1A2B6B] shadow-lg"
                      >
                        {/* Header simplifié */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF671E] to-[#FF8E53]">
                              <IconCalculator className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white">Avance Disponible</h4>
                              <p className="text-xs text-gray-400">Montant maximum que vous pouvez demander</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAdvanceDetails(!showAdvanceDetails)}
                            className="px-3 py-1.5 text-xs text-gray-400 hover:text-[#FF8E53] hover:bg-[#1A2B6B] rounded-lg transition-all duration-200"
                          >
                            {showAdvanceDetails ? "Masquer" : "Détails"}
                          </button>
                        </div>

                        {/* Montant principal mis en évidence */}
                        <div className="text-center mb-4">
                          <motion.div 
                            key={`${enableMultiMonths}-${selectedMonths}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                            className="text-3xl font-bold text-white mb-1"
                          >
                            {enableMultiMonths && selectedMonths > 1 
                              ? avanceData.multiMonthLimit.toLocaleString('fr-FR')
                              : avanceData.avanceDisponible.toLocaleString('fr-FR')
                            } GNF
                          </motion.div>
                          <motion.div 
                            key={`desc-${enableMultiMonths}-${selectedMonths}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="text-sm text-gray-300"
                          >
                            {enableMultiMonths && selectedMonths > 1 
                              ? `Limite ${selectedMonths} mois (30% × ${selectedMonths})`
                              : "Limite mensuelle (50% du salaire)"
                            }
                          </motion.div>
                        </div>

                        {/* Détails dépliables */}
                        <AnimatePresence>
                          {showAdvanceDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-[#1A2B6B] pt-4 space-y-3"
                            >
                              {/* Barre de progression du mois */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-300">Progression du mois</span>
                                  <span className="text-white font-medium">{avanceData.workingDaysPercentage}%</span>
                                </div>
                                <div className="w-full bg-[#1A2B6B] rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${avanceData.workingDaysPercentage}%` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-2 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] rounded-full"
                                  />
                                </div>
                                <div className="text-xs text-gray-400 text-center">
                                  {avanceData.workingDaysElapsed} jours écoulés sur {avanceData.totalWorkingDays}
                                </div>
                              </div>

                              {/* Informations financières */}
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Salaire net:</span>
                                    <span className="text-white font-medium">{avanceData.salaireNet.toLocaleString()} GNF</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Avances actives:</span>
                                    <span className="text-red-400">-{avanceData.avanceActive.toLocaleString()} GNF</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Auto-approbation:</span>
                                    <span className="text-blue-400">{avanceData.maxAvanceMonthly.toLocaleString()} GNF</span>
                                  </div>
                                  <div className="flex justify-between border-t border-[#1A2B6B] pt-2">
                                    <span className="text-gray-300 font-medium">Disponible:</span>
                                    <span className="text-green-400 font-bold">{avanceData.avanceDisponible.toLocaleString()} GNF</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {/* Section Montant et Options */}
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Option Multi-mois - Mise en avant */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0A1A5A] to-[#142B7F] border border-[#1A2B6B]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                              <IconCalendar className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white">Avance sur plusieurs mois</h4>
                              <p className="text-xs text-gray-400">Étalez votre avance sur 2-3 mois</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEnableMultiMonths(!enableMultiMonths)
                              if (!enableMultiMonths) {
                                // Quand on active le mode multi-mois, définir 2 mois par défaut
                                setSelectedMonths(2)
                              } else {
                                // Quand on désactive, revenir au mode normal
                                setSelectedMonths(1)
                              }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                              enableMultiMonths ? 'bg-[#FF671E]' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                enableMultiMonths ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        {enableMultiMonths && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="text-xs text-gray-400 mb-2 block">
                                Nombre de mois
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedMonths(2)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    selectedMonths === 2
                                      ? 'bg-[#FF671E] text-white shadow-lg'
                                      : 'bg-[#1A2B6B] text-gray-300 hover:bg-[#2A3B8B]'
                                  }`}
                                >
                                  2 mois
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedMonths(3)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    selectedMonths === 3
                                      ? 'bg-[#FF671E] text-white shadow-lg'
                                      : 'bg-[#1A2B6B] text-gray-300 hover:bg-[#2A3B8B]'
                                  }`}
                                >
                                  3 mois
                                </button>
                              </div>
                            </div>
                            
                            {avanceData && (
                              <div className="p-3 bg-[#1A2B6B]/50 rounded-lg">
                                <div className="text-xs text-gray-300 space-y-2">
                                  <div className="flex justify-between">
                                    <span>Montant minimum:</span>
                                    <span className="text-[#FF671E] font-medium">
                                      {avanceData.minimumMultiMonth.toLocaleString()} GNF
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Montant maximum:</span>
                                    <span className="text-green-400 font-medium">
                                      {avanceData.multiMonthLimit.toLocaleString()} GNF
                                    </span>
                                  </div>
                                  <div className="text-center text-gray-400 text-xs pt-1 border-t border-gray-600">
                                    30% du salaire × {selectedMonths} mois
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>

                      {/* Montant demandé */}
                      <div className="space-y-2">
                        <CurrencyInput
                          value={amount}
                          onChange={(value) => {
                            setAmount(value)
                            setError("")
                          }}
                          onValidationChange={(isValid, numericValue) => {
                            setIsAmountValid(isValid)
                            setAmountNumericValue(numericValue)
                            
                            // Validation personnalisée pour les limites multi-mois
                            if (isValid && avanceData) {
                              const limiteAvance = avanceData.limiteAvance
                              const minimumMultiMonth = avanceData.minimumMultiMonth

                              // Validation multi-mois
                              if (enableMultiMonths && selectedMonths > 1) {
                                if (numericValue < minimumMultiMonth) {
                                  showToast('warning', `Montant minimum pour ${selectedMonths} mois: ${minimumMultiMonth.toLocaleString()} GNF`)
                                } else if (numericValue > limiteAvance) {
                                  showToast('error', `Montant maximum pour ${selectedMonths} mois: ${limiteAvance.toLocaleString()} GNF`)
                                }
                              } else {
                                // Validation normale
                                if (numericValue > limiteAvance) {
                                  showToast('error', `Montant maximum autorisé: ${limiteAvance.toLocaleString()} GNF`)
                                }
                              }
                            }
                          }}
                          placeholder="Ex: 500000"
                          label="Montant demandé"
                          required
                          min={0}
                          max={avanceData?.limiteAvance || 999999999999}
                          className="text-white"
                          showValidation={true}
                        />
                        
                        {/* Informations sur les limites */}
                        {avanceData && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm flex justify-end"
                          >
                            <span className="text-gray-400 font-medium">
                              {enableMultiMonths && selectedMonths > 1 
                                ? `Limite ${selectedMonths} mois: ${avanceData.multiMonthLimit.toLocaleString()} GNF`
                                : `Limite mensuelle: ${avanceData.limiteAvance.toLocaleString()} GNF`
                              }
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="border-t border-gray-600/30 my-6"></div>

                    {/* Informations de la demande */}
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Type de motif */}
                      <div>
                        <label htmlFor="requestType" className="block text-sm font-medium text-gray-300 mb-2">
                          Type de motif
                        </label>
                        <div className="relative">
                          <select
                            id="requestType"
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value as RequestType)}
                            className="block w-full px-4 py-3 bg-[#0A1A5A] border border-[#1A2B6B] rounded-xl shadow-inner focus:ring-2 focus:ring-[#FF671E] focus:border-[#FF671E] focus:ring-offset-2 transition-all duration-200 text-white appearance-none cursor-pointer hover:bg-[#142B7F]"
                            required
                          >
                            {REQUEST_TYPES.map((type) => (
                              <option key={type.value} value={type.value} className="bg-[#0A1A5A] text-white">
                                {type.label}
                              </option>
                            ))}
                          </select>
                          {/* Icône de flèche personnalisée */}
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Détails du motif */}
                      <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
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

                      {/* Divider */}
                      <div className="border-t border-gray-600/30 my-4"></div>

                      {/* Numéro de téléphone */}
                      <div>
                        <PhoneInput
                          value={receivePhone || ''}
                          onChange={(value) => setReceivePhone(value)}
                          onValidationChange={(isValid, formattedValue) => {
                            setIsPhoneValid(isValid)
                            if (!isValid && receivePhone.trim()) {
                              showToast('error', "Format de numéro de téléphone invalide")
                            }
                          }}
                          placeholder="+224 612 34 56 78"
                          label="Numéro de téléphone pour réception"
                          required
                          className="text-white"
                          showValidation={true}
                        />
                      </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="border-t border-gray-600/30 my-6"></div>

                    {/* Conditions et boutons */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="space-y-4 pt-4"
                    >
                      {/* Conditions */}
                      <div className="flex items-start space-x-3 p-3 bg-[#0A1A5A]/50 rounded-lg border border-[#1A2B6B]">
                        <input
                          id="terms"
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-gray-600 text-[#FF671E] focus:ring-[#FF671E] focus:ring-offset-0"
                          required
                        />
                        <label htmlFor="terms" className="text-xs text-gray-300 leading-relaxed">
                          J&apos;accepte que cette avance soit déduite de mon prochain salaire et je comprends les conditions générales.
                        </label>
                      </div>


                      {/* Boutons d'action */}
                      <div className="flex justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={onClose}
                          className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-[#0A1A5A] hover:bg-[#142B7F] transition-colors duration-200"
                        >
                          Annuler
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF782E] hover:to-[#FF9E63] shadow-lg hover:shadow-[#FF671E]/30 transition-all duration-200"
                        >
                          Continuer
                        </motion.button>
                      </div>
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

                {/* Étape 3: Confirmation par PIN */}
                {currentStep === 'confirmation' && (
                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handlePinSubmit}
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
                      <p className="text-sm text-gray-300">Saisissez votre code PIN à 6 chiffres pour confirmer la demande</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#0A1A5A] border border-[#1A2B6B]">
                        <PinInput
                          value={pin}
                          onChange={handlePinChange}
                          onFocus={handlePinFocus}
                          onBlur={handlePinBlur}
                          placeholder="Code PIN (6 chiffres)"
                          showValue={showPin}
                          onToggleShow={togglePinVisibility}
                          hasUserInteracted={hasUserInteracted}
                          label="Code PIN de sécurité"
                          disabled={loading}
                        />
                        
                        {pinError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                            <p className="text-red-200 text-sm">{pinError}</p>
                          </motion.div>
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
                        disabled={loading || pin.length !== 6}
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