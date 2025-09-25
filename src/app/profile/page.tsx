"use client"

import { FinancialServices } from "@/components/profile/financial-services"
import { ProfileStats } from "@/components/profile/profile-stats"
import { FeedbackSection } from "@/components/profile/feedback-section"
import { AvisHistory } from '@/components/profile/avis-history'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileSettings } from "@/components/profile/profile-settings"
import { Partenaire } from "@/types/partenaire"
import { TransactionHistory } from "@/components/profile/transaction-history"
import { PaymentList } from "@/components/profile/payment-list"
import { PaymentData } from "@/components/profile/payment-service-card"

import { useEmployeeAuth } from "@/contexts/EmployeeAuthContext"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useSalarySetup } from "@/hooks/useSalarySetup"
import SalarySetupModal from "@/components/modals/SalarySetupModal"

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("services")
  const [isChatbotOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [activeTabRect, setActiveTabRect] = useState<{ left: number; width: number } | null>(null)
  
  // Utiliser le nouveau contexte d'authentification
  const { employee, loading, isAuthenticated } = useEmployeeAuth()
  const [entreprise, setEntreprise] = useState<Partenaire | undefined>(undefined)
  
  // Hook pour la configuration du salaire
  const { needsSetup, userInfo, configureSalary, loading: salaryLoading, error: salaryError } = useSalarySetup()
  const [showModal, setShowModal] = useState(true)
  const [salaireDisponible, setSalaireDisponible] = useState<number>(0)

  // Récupérer les données financières de l'utilisateur
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        console.log("💰 Récupération des données financières dans profile...")
        
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
          console.log("📊 Données financières récupérées dans profile:", result.data)
          
          if (result.data?.financial?.salaire_disponible) {
            const salaireDispo = result.data.financial.salaire_disponible
            setSalaireDisponible(salaireDispo)
            console.log("✅ Salaire disponible dans profile:", salaireDispo)
          } else {
            console.log("ℹ️ Aucun salaire disponible trouvé dans profile")
            setSalaireDisponible(0)
          }
        } else {
          console.error("❌ Erreur lors de la récupération des données financières dans profile:", response.status)
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des données financières dans profile:", error)
      }
    }

    if (isAuthenticated && employee) {
      fetchFinancialData()
    }
  }, [isAuthenticated, employee])

  // État pour les paiements dynamiques
  const [allPayments, setAllPayments] = useState<PaymentData[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)

  // Charger tous les paiements dynamiquement
  useEffect(() => {
    const loadAllPayments = async () => {
      try {
        setPaymentsLoading(true)
        console.log("📋 Chargement de tous les paiements...")
        
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('employee_access_token')
        if (!accessToken) {
          console.warn("⚠️ Token d'authentification manquant")
          setAllPayments([])
          return
        }

        // TODO: Remplacer par un vrai appel API pour récupérer tous les paiements
        // const response = await fetch('/api/payments/all', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`,
        //     'Content-Type': 'application/json',
        //   },
        // })
        
        // Pour l'instant, on simule un appel API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Créer la liste des paiements dynamiquement
        const payments: PaymentData[] = []
        
        // Ajouter le paiement de salaire si disponible
        if (salaireDisponible > 0) {
          const salaryPayment: PaymentData = {
            id: "salary-payment",
            clientName: "Paiement de salaire",
            clientEmail: "salaire@zalama.gn",
            amount: salaireDisponible,
      currency: "GNF",
      status: "pending",
            createdAt: new Date().toISOString(),
            reference: `SAL-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`
          }
          payments.push(salaryPayment)
        }
        
        // TODO: Ajouter ici les autres paiements récupérés depuis l'API
        // payments.push(...apiPayments)
        
        console.log("✅ Tous les paiements chargés:", payments.length)
        setAllPayments(payments)
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error)
        setAllPayments([])
      } finally {
        setPaymentsLoading(false)
      }
    }

    if (isAuthenticated && employee) {
      loadAllPayments()
    }
  }, [isAuthenticated, employee, salaireDisponible])

  const handleStatusChange = (paymentId: string, newStatus: PaymentData['status']) => {
    console.log('Status change:', paymentId, newStatus)
  }

  const handleDownload = (paymentId: string) => {
    console.log('Download:', paymentId)
  }

  const handleShare = (paymentId: string) => {
    console.log('Share:', paymentId)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleSuccess = () => {
    console.log('Salaire configuré avec succès')
    setShowModal(false)
  }

  // Debug: Logs pour comprendre pourquoi la modale ne s'affiche pas
  useEffect(() => {
    console.log('🔍 DEBUG - Profile Page State:');
    console.log('   - employee:', employee);
    console.log('   - loading:', loading);
    console.log('   - isAuthenticated:', isAuthenticated);
    console.log('   - needsSetup:', needsSetup);
    console.log('   - userInfo:', userInfo);
    console.log('   - salaryLoading:', salaryLoading);
    console.log('   - salaryError:', salaryError);
    
    if (employee) {
      console.log('   - employee.role:', employee.role);
      console.log('   - employee.salaire_net:', employee.salaire_net);
      console.log('   - employee.user_id:', employee.user_id);
    }
  }, [employee, loading, isAuthenticated, needsSetup, userInfo, salaryLoading, salaryError]);

  // Fonction pour récupérer les informations de l'entreprise
  const fetchEntrepriseInfo = async (partenaireId: string) => {
    try {
      console.log('🏢 Récupération des informations de l\'entreprise...')
      const response = await fetch(`/api/partenaires/${partenaireId}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const entrepriseData = await response.json()
        console.log('✅ Informations entreprise récupérées:', entrepriseData.nom)
        setEntreprise(entrepriseData)
      } else {
        console.error('❌ Erreur lors de la récupération de l\'entreprise')
      }
    } catch (error) {
      console.error('💥 Erreur lors de la récupération de l\'entreprise:', error)
    }
  }

  // Récupérer les informations de l'entreprise quand l'employé est chargé
  useEffect(() => {
    if (employee?.partner_id) {
      fetchEntrepriseInfo(employee.partner_id)
    }
  }, [employee])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector(`[data-state=active]`)
      if (activeTabElement instanceof HTMLElement) {
        const rect = activeTabElement.getBoundingClientRect()
        const parentRect = tabsRef.current.getBoundingClientRect()
        setActiveTabRect({
          left: rect.left - parentRect.left,
          width: rect.width,
        })
      }
    }
  }, [activeTab, isMounted])

  // Adapter les données employé au format attendu par les composants
  const userData = employee ? {
    id: employee.user_id,
    email: employee.email,
    emailVerified: true,
    displayName: employee.nomComplet || `${employee.prenom} ${employee.nom}`,
    photoURL: employee.photo_url,
    employeId: employee.id,
    prenom: employee.prenom,
    nom: employee.nom,
    nomComplet: employee.nomComplet || `${employee.prenom} ${employee.nom}`,
    telephone: employee.telephone,
    poste: employee.poste,
    role: employee.role,
    genre: employee.genre,
    adresse: employee.adresse,
    salaireNet: employee.salaire_net,
    typeContrat: employee.type_contrat,
    dateEmbauche: employee.date_embauche,
    partnerId: employee.partner_id,
    partenaireId: employee.partner_id,
    uid: employee.user_id,
    salaire_net: employee.salaire_net,
    type_contrat: employee.type_contrat,
    date_embauche: employee.date_embauche,
    photo_url: employee.photo_url,
    actif: employee.actif,
    created_at: employee.created_at,
    updated_at: employee.updated_at
  } : null;

  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col min-h-screen">
        <SalarySetupModal
          isOpen={needsSetup === true && showModal}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          userInfo={userInfo}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-1 flex-col w-full"
        >
          <div className="flex flex-1 flex-col gap-2 px-4 lg:px-6">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div>
                {userData && (
                  <>
                    <ProfileHeader user={userData} entreprise={entreprise} />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isMounted ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="mt-6"
                    >
                      <ProfileStats user={userData} />
                    </motion.div>
                  </>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isMounted ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-8"
                >
                  <Tabs 
                    defaultValue="services" 
                    className="w-full"
                    onValueChange={(value) => setActiveTab(value)}
                  >
                    <TabsList 
                      ref={tabsRef}
                      className="relative w-full grid grid-cols-4 mb-8 bg-[#010D3E]/50 p-1 rounded-xl h-12 backdrop-blur-md border border-[#1A3A8F]"
                    >
                      {activeTabRect && (
                        <motion.div
                          className="absolute bg-[#010D3E]/30 rounded-lg h-10 top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(26,58,143,0.5)]"
                          layout
                          animate={{
                            left: activeTabRect.left,
                            width: activeTabRect.width,
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <TabsTrigger 
                        value="services" 
                        className="relative z-10 flex-1 flex items-center justify-center text-sm font-medium transition-colors h-full rounded-lg data-[state=active]:font-bold data-[state=active]:text-white"
                      >
                        <motion.span
                          className="flex items-center gap-2 text-gray-300 hover:text-white"
                          whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.svg 
                            className="w-5 h-5"
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                            animate={activeTab === "services" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ repeat: activeTab === "services" ? Infinity : 0, duration: 1 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </motion.svg>
                          Services
                        </motion.span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="history" 
                        className="relative z-10 flex-1 flex items-center justify-center text-sm font-medium transition-colors h-full rounded-lg data-[state=active]:font-bold data-[state=active]:text-white"
                      >
                        <motion.span
                          className="flex items-center gap-2 text-gray-300 hover:text-white"
                          whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.svg 
                            className="w-5 h-5"
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                            animate={activeTab === "history" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ repeat: activeTab === "history" ? Infinity : 0, duration: 1 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </motion.svg>
                          Historiques
                        </motion.span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="feedback" 
                        className="relative z-10 flex-1 flex items-center justify-center text-sm font-medium transition-colors h-full rounded-lg data-[state=active]:font-bold data-[state=active]:text-white"
                      >
                        <motion.span
                          className="flex items-center gap-2 text-gray-300 hover:text-white"
                          whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.svg 
                            className="w-5 h-5"
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                            animate={activeTab === "feedback" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ repeat: activeTab === "feedback" ? Infinity : 0, duration: 1 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </motion.svg>
                          Avis
                        </motion.span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payments" 
                        className="relative z-10 flex-1 flex items-center justify-center text-sm font-medium transition-colors h-full rounded-lg data-[state=active]:font-bold data-[state=active]:text-white"
                      >
                        <motion.span
                          className="flex items-center gap-2 text-gray-300 hover:text-white"
                          whileHover={{ scale: 1.05, textShadow: "0 0 8px rgba(255,255,255,0.3)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.svg 
                            className="w-5 h-5"
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                            animate={activeTab === "payments" ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ repeat: activeTab === "payments" ? Infinity : 0, duration: 1 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </motion.svg>
                          Paiements
                        </motion.span>
                      </TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TabsContent value="services" className="mt-2">
                          {userData && <FinancialServices user={userData} />}
                        </TabsContent>
                        <TabsContent value="history" className="mt-2">
                          {userData && <TransactionHistory user={userData} />}
                        </TabsContent>
                        <TabsContent value="feedback" className="mt-2">
                          <div className="space-y-6">
                            <FeedbackSection />
                            <AvisHistory />
                          </div>
                        </TabsContent>
                        <TabsContent value="payments" className="mt-2">
                          {userData && (
                            <div className="max-w-7xl mx-auto px-4">
                              <PaymentList
                                payments={allPayments}
                                onStatusChange={handleStatusChange}
                                onDownload={handleDownload}
                                onShare={handleShare}
                                onRefresh={() => console.log('Refresh payments')}
                                isLoading={paymentsLoading}
                              />
                            </div>
                          )}
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </Tabs>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-[#FF671E] to-[#FF8E53] shadow-lg flex items-center justify-center text-white font-semibold text-sm cursor-not-allowed"
          disabled
        >
          AI
        </motion.button>

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
            </motion.div>
          )}
        </AnimatePresence>

        {showSettings && userData && (
          <ProfileSettings onClose={() => setShowSettings(false)} userData={userData} />
        )}
      </div>
    </ProtectedRoute>
  )
}