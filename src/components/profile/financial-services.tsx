import { IconArrowRight } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SalaryAdvanceForm } from "./salary-advance-form"
import { AI } from "@/components/profile/AI"
import { UserWithEmployeData } from "@/types/employe"
import { supabase } from '@/lib/supabase'
import { PendingPayments } from "./pending-payments"
import { PaymentData } from "./payment-service-card"
import { apiService } from '@/services/api-service'
import { usePayslipGenerator } from '@/hooks/usePayslipGenerator'

interface Service {
  id: string
  nom: string
  description: string
  categorie: string
  frais_attribues: number
  pourcentage_max: number
  duree: string
  disponible: boolean
  image_url?: string
  date_creation: string
  created_at: string
  updated_at: string
}

export function FinancialServices({ user }: { user: UserWithEmployeData }) {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // État local pour le service de paiement (retard salaire) - basé sur salaire_disponible
  const [isPaymentActive, setIsPaymentActive] = useState<boolean>(false)
  const [salaireDisponible, setSalaireDisponible] = useState<number>(0)
  // État pour la gestion des paiements
  const [showPaymentManagement, setShowPaymentManagement] = useState(false)
  // État pour le type de contrat
  const [typeContrat, setTypeContrat] = useState<string | null>(null)
  
  // Hook pour la génération du bulletin de paie
  const { generatePayslip, isGenerating: isGeneratingPayslip, error: payslipError } = usePayslipGenerator()
  
  // Récupérer les données financières de l'utilisateur pour vérifier salaire_disponible
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        console.log("💰 Récupération des données financières...")
        
        // Récupérer les données via l'edge function employee-auth
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')
        if (!accessToken) {
          console.warn("⚠️ Token d'authentification manquant")
          return
        }

        const response = await fetch('/api/auth/getme', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const result = await response.json()
          console.log("📊 Données financières récupérées:", result.data)
          
          // Récupérer le type de contrat depuis contractInfo
          if (result.data?.contractInfo?.type_contrat) {
            const contratType = result.data.contractInfo.type_contrat
            setTypeContrat(contratType)
            console.log("📋 Type de contrat récupéré:", contratType)
          } else if (result.data?.type_contrat) {
            // Fallback si le type de contrat est directement dans data
            setTypeContrat(result.data.type_contrat)
            console.log("📋 Type de contrat récupéré (fallback):", result.data.type_contrat)
          }
          
          if (result.data?.financial?.salaire_disponible) {
            const salaireDispo = result.data.financial.salaire_disponible
            setSalaireDisponible(salaireDispo)
            // Activer automatiquement le service si salaire_disponible > 0
            setIsPaymentActive(salaireDispo > 0)
            console.log("✅ Service de paiement:", salaireDispo > 0 ? "Activé" : "Désactivé", "- Montant:", salaireDispo)
          } else {
            console.log("ℹ️ Aucun salaire disponible trouvé")
            setSalaireDisponible(0)
            setIsPaymentActive(false)
          }
        } else {
          console.error("❌ Erreur lors de la récupération des données financières:", response.status)
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des données financières:", error)
      }
    }

    fetchFinancialData()
  }, [])

  // Fetch services from ZaLaMa API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        /*console.log("🔍 Récupération des services via API ZaLaMa...")*/
        /*console.log("🔑 API ZaLaMa configurée")*/
        
        // Utiliser notre service API au lieu de Supabase directement
        const response = await apiService.getServices()
        
        /*console.log("📊 Réponse API services:", response)*/
        /*console.log("📊 Nombre de services:", response.data?.length || 0)*/
        /*console.log("❌ Erreur API:", response.error)*/
        
        if (!response.success) {
          console.error("Erreur API services:", response.error)
          setError(response.message || response.error || "Erreur lors de la récupération des services")
          return
        }
        
        const data = response.data
        
        if (!data || data.length === 0) {
          console.warn("⚠️ Aucun service trouvé via l'API")
          setError("Aucun service disponible")
        } else {
          /*console.log("✅ Services chargés avec succès via API:", data.length, "services")*/
        }
        
        setServices(data || [])
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error)
        setError("Erreur de connexion")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Map API services to the format used in the component
  const mappedServices = services.map(service => {
    /*console.log("🔄 Mapping service:", service.nom, service.disponible)*/
    
    // Vérifier si le service est une demande d'avance
    const isAvanceService = service.nom.toLowerCase().includes("avance")
    
    // Déterminer si le service doit être désactivé
    let isServiceDisabled = !service.disponible
    
    // Si c'est un service d'avance, vérifier le type de contrat
    if (isAvanceService) {
      // Si le type de contrat est disponible, vérifier s'il est valide
      if (typeContrat) {
        // Désactiver si le type de contrat n'est ni CDD ni CDI
        const contratValide = typeContrat.toUpperCase() === "CDD" || typeContrat.toUpperCase() === "CDI"
        if (!contratValide) {
          isServiceDisabled = true
          console.log("🚫 Service d'avance désactivé - Type de contrat non éligible:", typeContrat)
        }
      } else {
        // Si le type de contrat n'est pas encore chargé, on attend (le service reste dans son état actuel)
        // Mais si le service est déjà désactivé, on le garde désactivé
      }
    }
    
    return {
      id: service.id,
      nom: service.nom,
      title: service.nom,
      description: service.description,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-8 w-8 ${
            service.nom.toLowerCase().includes("avance") ? "text-blue-500" :
            service.nom.toLowerCase().includes("prêt") ? "text-orange-500" :
            "text-green-500"
          }`}
        >
          {service.nom.toLowerCase().includes("avance") && (
            <>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <line x1="7" y1="15" x2="9" y2="15" />
              <line x1="11" y1="15" x2="13" y2="15" />
            </>
          )}
          {service.nom.toLowerCase().includes("prêt") && (
            <>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </>
          )}
          {service.nom.toLowerCase().includes("conseil") && (
            <>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </>
          )}
        </svg>
      ),
      maxpourcent: service.nom.toLowerCase().includes("prêt") ? undefined : `${service.pourcentage_max}%`,
      maxAmount: service.nom.toLowerCase().includes("prêt") ? "25 000 000" : undefined,
      eligibility: isServiceDisabled 
        ? (service.nom.toLowerCase().includes("conseil") ? "Indisponible" : "Désactivé")
        : "Disponible"
    }
  })

  /*console.log("🎯 Services mappés:", mappedServices.length)*/
  /*console.log("🎯 Services disponibles:", mappedServices.filter(s => s.eligibility === "Disponible").length)*/

  // Données de démonstration pour tous les paiements
  const allPayments: PaymentData[] = [
    {
      id: "user-1",
      clientName: "Entreprise ABC",
      clientEmail: "contact@entreprise-abc.com",
      amount: 150000,
      currency: "GNF",
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z",
      reference: "PAY-USER-001"
    },
    {
      id: "user-2",
      clientName: "Société XYZ",
      clientEmail: "admin@societe-xyz.com",
      amount: 250000,
      currency: "GNF",
      status: "received",
      createdAt: "2024-01-14T14:20:00Z",
      receivedAt: "2024-01-14T16:45:00Z",
      reference: "PAY-USER-002",
      notes: "Paiement reçu via virement"
    },
    {
      id: "user-3",
      clientName: "Client Direct",
      clientEmail: "client@direct.com",
      amount: 75000,
      currency: "GNF",
      status: "received",
      createdAt: "2024-01-13T09:15:00Z",
      receivedAt: "2024-01-13T11:30:00Z",
      reference: "PAY-USER-003",
      notes: "Paiement en espèces"
    },
    {
      id: "user-4",
      clientName: "Nouveau Client",
      clientEmail: "nouveau@client.com",
      amount: 200000,
      currency: "GNF",
      status: "pending",
      createdAt: "2024-01-16T09:15:00Z",
      reference: "PAY-USER-004"
    }
  ]

  // Gestion des actions de paiement
  const handlePaymentAction = (action: string) => {
    switch (action) {
      case 'manage':
        setShowPaymentManagement(true)
        break
    }
  }

  // Gestion de la génération du bulletin de paie
  const handleGeneratePayslip = async () => {
    if (!user) {
      console.error('Données utilisateur manquantes')
      return
    }

    try {
      // Utiliser les données financières disponibles
      const financialData = {
        salaireNet: user.salaireNet || 0,
        salaireRestant: salaireDisponible,
        avanceActif: 0, // À récupérer depuis l'API si nécessaire
        // Autres données financières...
      }
      
      const success = await generatePayslip(user, financialData)
      if (success) {
        console.log('✅ Bulletin de paie généré avec succès')
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération du bulletin de paie:', error)
    }
  }

  const handleStatusChange = (paymentId: string, newStatus: PaymentData['status']) => {
    console.log('Status change:', paymentId, newStatus)
  }

  const handleDownload = (paymentId: string) => {
    console.log('Download:', paymentId)
  }

  const handleShare = (paymentId: string) => {
    console.log('Share:', paymentId)
  }

  return (
    <div className="py-8 bg-[#010D3E]">
      {/* Contenu des services */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border border-gray-100/30 animate-pulse"
            >
              <div className="h-8 w-8 bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-full mb-4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">Erreur: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Recharger
          </button>
        </div>
      ) : mappedServices.length === 0 ? (
        <div className="text-center text-white">
          <p className="mb-4">Aucun service disponible</p>
          <p className="text-sm text-gray-400">Vérifiez que les services ont été ajoutés à la base de données</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {mappedServices
            .filter(service => !service.nom.toLowerCase().includes("marketing") && !service.nom.toLowerCase().includes("conseil"))
            .map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={service.eligibility === "Disponible" ? { 
                  scale: 1.03,
                  boxShadow: service.nom.toLowerCase().includes("avance") ? "0 8px 20px rgba(59, 130, 246, 0.3)" : 
                            service.nom.toLowerCase().includes("conseil") ? "0 8px 20px rgba(34, 197, 94, 0.3)" : 
                            "0 8px 20px rgba(249, 115, 22, 0.3)"
                } : {}}
                className={`bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border ${
                  service.nom.toLowerCase().includes("avance") ? "border-blue-500/30" : 
                  service.nom.toLowerCase().includes("conseil") ? "border-green-500/30" : 
                  "border-orange-500/30"
                } ${service.eligibility === "Disponible" ? "cursor-pointer" : "cursor-not-allowed opacity-60"} transition-all duration-300 relative overflow-hidden flex flex-col h-64`}
                onClick={() => {
                  if (service.eligibility === "Disponible") {
                    if (service.nom.toLowerCase().includes("conseil")) {
                      setIsChatbotOpen(true)
                    } else {
                      setActiveService(service.id)
                    }
                  }
                }}
              >
                <motion.div
                  className={`absolute top-2 right-2 text-white text-xs font-medium px-2 py-1 rounded-full ${
                    service.eligibility === "Disponible" 
                      ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53]" 
                      : "bg-gray-500"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
                >
                  {service.eligibility}
                </motion.div>
                <div className="flex items-center mb-4">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    {service.icon}
                  </motion.div>
                  <h3 className="ml-3 text-lg font-semibold text-white">{service.title}</h3>
                </div>
                <p className="text-white/80 text-sm mb-4 flex-grow">{service.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-xs text-white/60">
                      {service.nom.toLowerCase().includes("prêt") ? "Montant max" : "Pourcentage max"}
                    </p>
                    <p className="font-semibold text-white">{service.nom.toLowerCase().includes("prêt") ? service.maxAmount : service.maxpourcent}</p>
                  </div>
                  <motion.button
                    whileHover={service.eligibility === "Disponible" ? { scale: 1.1, x: 5 } : {}}
                    whileTap={service.eligibility === "Disponible" ? { scale: 0.95 } : {}}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (service.eligibility === "Disponible") {
                        if (service.nom.toLowerCase().includes("conseil")) {
                          setIsChatbotOpen(true)
                        } else {
                          setActiveService(service.id)
                        }
                      }
                    }}
                    className={`inline-flex items-center text-sm font-medium text-white px-4 py-2 rounded-lg transition-all duration-300 ${
                      service.eligibility === "Disponible"
                        ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF551E] hover:to-[#FF7E53]"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={service.eligibility !== "Disponible"}
                  >
                    Demander <IconArrowRight className="ml-1 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          
          {/* Carte Paiement de salaire - au milieu */}
          <motion.div
            key="payment-mock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 transition-all duration-300 relative overflow-hidden flex flex-col h-64`}
          >
            <motion.div
              className={`absolute top-2 right-2 text-white text-xs font-medium px-2 py-1 rounded-full ${
                isPaymentActive
                  ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53]"
                  : "bg-gray-500"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {isPaymentActive ? "Activé" : "Désactivé"}
            </motion.div>
            <div className="flex items-center mb-4">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-orange-500">
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="8" cy="15" r="1" />
                  <circle cx="12" cy="15" r="1" />
                  <circle cx="16" cy="15" r="1" />
                </svg>
              </motion.div>
              <h3 className="ml-3 text-lg font-semibold text-white">Paiement de salaire</h3>
            </div>
            <p className="text-white/80 text-sm mb-4 flex-grow">
              Votre entreprise peut vous payer via ZaLaMa. Le service s'active automatiquement quand un salaire est disponible.
            </p>
            <div className="flex justify-between items-center mt-auto">
              <div>
                <p className="text-xs text-white/60">Salaire disponible</p>
                <p className="font-semibold text-white">
                  {salaireDisponible > 0 
                    ? `${salaireDisponible.toLocaleString('fr-FR')} GNF`
                    : "Aucun salaire disponible"
                  }
                </p>
              </div>
              <div className="flex gap-2">
                {salaireDisponible > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGeneratePayslip()
                    }}
                    disabled={isGeneratingPayslip}
                    className="inline-flex items-center text-sm font-medium text-white px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isGeneratingPayslip ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
                        Génération...
                      </>
                    ) : (
                      <>
                        📄 Bulletin
                      </>
                    )}
                  </motion.button>
                )}
                <motion.button
                  whileHover={isPaymentActive ? { scale: 1.1, x: 5 } : {}}
                  whileTap={isPaymentActive ? { scale: 0.95 } : {}}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isPaymentActive) {
                      setShowPaymentManagement(true)
                    }
                  }}
                  disabled={!isPaymentActive}
                  className={`inline-flex items-center text-sm font-medium text-white px-4 py-2 rounded-lg transition-all duration-300 ${
                    isPaymentActive
                      ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF551E] hover:to-[#FF7E53]"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                >
                  Retirer <IconArrowRight className="ml-1 h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Carte Conseil financier - en dernier */}
          {mappedServices
            .filter(service => !service.nom.toLowerCase().includes("marketing") && service.nom.toLowerCase().includes("conseil"))
            .map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={service.eligibility === "Disponible" ? { 
                  scale: 1.03,
                  boxShadow: "0 8px 20px rgba(34, 197, 94, 0.3)"
                } : {}}
                className={`bg-[#010D3E]/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 ${service.eligibility === "Disponible" ? "cursor-pointer" : "cursor-not-allowed opacity-60"} transition-all duration-300 relative overflow-hidden flex flex-col h-64`}
                onClick={() => {
                  if (service.eligibility === "Disponible") {
                    setIsChatbotOpen(true)
                  }
                }}
              >
                <motion.div
                  className={`absolute top-2 right-2 text-white text-xs font-medium px-2 py-1 rounded-full ${
                    service.eligibility === "Disponible" 
                      ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53]" 
                      : "bg-gray-500"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  {service.eligibility}
                </motion.div>
                <div className="flex items-center mb-4">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    {service.icon}
                  </motion.div>
                  <h3 className="ml-3 text-lg font-semibold text-white">{service.title}</h3>
                </div>
                <p className="text-white/80 text-sm mb-4 flex-grow">{service.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-xs text-white/60">Pourcentage max</p>
                    <p className="font-semibold text-white">{service.maxpourcent}</p>
                  </div>
                  <motion.button
                    whileHover={service.eligibility === "Disponible" ? { scale: 1.1, x: 5 } : {}}
                    whileTap={service.eligibility === "Disponible" ? { scale: 0.95 } : {}}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (service.eligibility === "Disponible") {
                        setIsChatbotOpen(true)
                      }
                    }}
                    className={`inline-flex items-center text-sm font-medium text-white px-4 py-2 rounded-lg transition-all duration-300 ${
                      service.eligibility === "Disponible"
                        ? "bg-gradient-to-r from-[#FF671E] to-[#FF8E53] hover:from-[#FF551E] hover:to-[#FF7E53]"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={service.eligibility !== "Disponible"}
                  >
                    Demander <IconArrowRight className="ml-1 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {/* Affichage des erreurs de génération de bulletin de paie */}
      {payslipError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 max-w-7xl mx-auto px-4"
        >
          <p className="text-red-400 text-sm">
            ⚠️ Erreur lors de la génération du bulletin de paie: {payslipError}
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {activeService && !services.find(s => s.id === activeService)?.nom.toLowerCase().includes("conseil") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bg-[#010D3E] rounded-2xl p-6 shadow-xl border border-gray-100/10"
            >
              {services.find(s => s.id === activeService)?.nom.toLowerCase().includes("avance") ? (
                <SalaryAdvanceForm onClose={() => setActiveService(null)} user={user} />
              ) : (
                <div className="text-white text-center p-4">
                  <p>Le formulaire pour ce service n&apos;est pas encore disponible.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveService(null)}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white rounded-lg"
                  >
                    Fermer
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[448px] bg-[#010D3E] shadow-xl z-50 p-4"
          >
            <div className="mb-4">
              <h2 className="text-white text-lg font-semibold">AI Chatbot</h2>
            </div>
            <AI onClose={() => setIsChatbotOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentManagement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentManagement(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <PendingPayments
                userId={user.id || 'default-user'}
                onClose={() => setShowPaymentManagement(false)}
                salaireDisponible={salaireDisponible}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}