"use client"

import { UserWithEmployeData } from "@/types/employe"
import { IconArrowUpRight, IconCreditCard, IconReceipt, IconSparkles, IconTrendingUp, IconEye, IconEyeOff } from "@tabler/icons-react"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

// Type pour les demandes d'avance
interface AdvanceRequest {
  id: string
  employe_id: string
  partenaire_id: string // Obligatoire, ne peut pas être null
  montant_demande: number
  type_motif: string
  motif: string
  numero_reception?: string
  frais_service: number
  montant_total: number
  salaire_disponible?: number
  avance_disponible?: number
  statut: 'En attente' | 'Validé' | 'Rejeté' | 'Annulé'
  date_creation: string
  date_validation?: string
  date_rejet?: string
  motif_rejet?: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

// Fonction pour calculer l'acompte disponible
function calculateAvailableAdvance(salaireNet: number): number {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  // Calculer le nombre de jours ouvrables écoulés ce mois
  const workingDaysElapsed = getWorkingDaysElapsed(currentYear, currentMonth, today.getDate())
  
  // Calculer le total de jours ouvrables du mois
  const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
  
  // Calculer l'acompte disponible basé sur les jours écoulés
  // Chaque jour ouvrable = une partie du salaire
  const dailySalary = Math.floor(salaireNet / totalWorkingDays) // Salaire par jour ouvrable
  const availableAdvance = dailySalary * workingDaysElapsed // Acompte pour les jours écoulés
  
  console.log("📅 Calcul de l'acompte disponible:")
  console.log("  - Jours ouvrables écoulés:", workingDaysElapsed)
  console.log("  - Total jours ouvrables du mois:", totalWorkingDays)
  console.log("  - Salaire par jour ouvrable:", dailySalary.toLocaleString(), "GNF")
  console.log("  - Acompte disponible:", availableAdvance.toLocaleString(), "GNF")
  
  return availableAdvance
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

// Fonction utilitaire pour calculer les montants financiers
function calculateFinancialAmounts(salaireNet: number, advanceRequests: AdvanceRequest[]) {
  // 1. Acompte disponible (basé sur les jours ouvrables écoulés)
  const acompteDisponible = calculateAvailableAdvance(salaireNet)
  
  // 2. Total des avances actives (validées)
  const totalActiveAdvances = advanceRequests
    .filter(request => request.statut === 'Validé')
    .reduce((acc, request) => acc + (request.montant_demande as number), 0)
  
  // 3. Salaire restant = Salaire net - Avances actives
  const remainingSalary = salaireNet - totalActiveAdvances
  
  // 4. Limite mensuelle pour avance sur salaire (25% du salaire) - pour les demandes d'avance
  const monthlyLimit = Math.floor(salaireNet * 0.25)
  
  // 5. Avance restante ce mois (limite - avances déjà utilisées)
  const remainingMonthlyAdvance = Math.max(0, monthlyLimit - totalActiveAdvances)
  
  return {
    salaireNet,
    acompteDisponible, // Acompte basé sur les jours écoulés
    totalActiveAdvances,
    remainingSalary,
    monthlyLimit, // Limite pour avance sur salaire (25%)
    remainingMonthlyAdvance,
    workingDaysElapsed: getWorkingDaysElapsed(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    totalWorkingDays: getTotalWorkingDaysInMonth(new Date().getFullYear(), new Date().getMonth())
  }
}

export function ProfileStats({ user }: { user: UserWithEmployeData }) {
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [debugData, setDebugData] = useState<any>(null)
  const [schemaData, setSchemaData] = useState<any>(null)

  // Fonction de test pour vérifier les données Supabase directement
  const testSupabaseData = async () => {
    console.log("🧪 Test des données Supabase...")
    
    try {
      // Test 1: Vérifier l'employé
      const { data: employeData, error: employeError } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .eq('actif', true)
        .single()
      
      console.log("�� Données employé:", employeData)
      console.log("❌ Erreur employé:", employeError)
      
      if (employeData) {
        // Test 2: Vérifier les demandes d'avance
        const { data: demandesData, error: demandesError } = await supabase
          .from('salary_advance_requests')
          .select('*')
          .eq('employe_id', employeData.id)
          .order('date_creation', { ascending: false })
        
        console.log("📋 Demandes d'avance:", demandesData)
        console.log("❌ Erreur demandes:", demandesError)
        
        // Test 3: Vérifier les transactions financières
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('financial_transactions')
          .select('*')
          .eq('utilisateur_id', employeData.id)
          .order('date_transaction', { ascending: false })
        
        console.log("💰 Transactions financières:", transactionsData)
        console.log("❌ Erreur transactions:", transactionsError)
        
        setDebugData({
          employe: employeData,
          demandes: demandesData,
          transactions: transactionsData,
          errors: {
            employe: employeError,
            demandes: demandesError,
            transactions: transactionsError
          }
        })
      }
    } catch (error) {
      console.error("💥 Erreur lors du test:", error)
    }
  }

  // Fonction de test pour vérifier le schéma de la base de données
  const testSchemaData = async () => {
    console.log("🏗️ Test du schéma Supabase...")
    
    try {
      const response = await fetch('/api/debug/supabase-schema')
      if (response.ok) {
        const data = await response.json()
        console.log("🏗️ Schéma complet:", data)
        setSchemaData(data.debugInfo)
      } else {
        console.error("❌ Erreur API schéma:", response.status)
      }
    } catch (error) {
      console.error("💥 Erreur lors du test du schéma:", error)
    }
  }

  // Fonction de test pour vérifier le calcul des jours ouvrables
  const testWorkingDaysCalculation = () => {
    console.log("📅 Test du calcul de l'acompte disponible...")
    
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const currentDay = today.getDate()
    
    const workingDaysElapsed = getWorkingDaysElapsed(currentYear, currentMonth, currentDay)
    const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
    
    console.log("📅 Détails du calcul:")
    console.log("  - Date actuelle:", today.toLocaleDateString('fr-FR'))
    console.log("  - Mois/Année:", (currentMonth + 1) + "/" + currentYear)
    console.log("  - Jour actuel:", currentDay)
    console.log("  - Jours ouvrables écoulés:", workingDaysElapsed)
    console.log("  - Total jours ouvrables du mois:", totalWorkingDays)
    
    // Test avec un salaire de 1,000,000 GNF
    const testSalary = 1000000
    const dailySalary = Math.floor(testSalary / totalWorkingDays)
    const acompteDisponible = dailySalary * workingDaysElapsed
    const limiteAvance = Math.floor(testSalary * 0.25)
    
    console.log("💰 Test avec salaire de 1,000,000 GNF:")
    console.log("  - Salaire par jour ouvrable:", dailySalary.toLocaleString(), "GNF")
    console.log("  - Acompte disponible:", acompteDisponible.toLocaleString(), "GNF")
    console.log("  - Limite d'avance (25%):", limiteAvance.toLocaleString(), "GNF")
    console.log("  - Différence:", (acompteDisponible - limiteAvance).toLocaleString(), "GNF")
  }

  // Fonction de test pour simuler l'acompte à la fin du mois
  const testEndOfMonthCalculation = () => {
    console.log("🎯 Test de l'acompte à la fin du mois...")
    
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Simuler la fin du mois (dernier jour ouvrable)
    const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
    
    // Test avec le salaire de l'utilisateur
    const testSalary = user.salaireNet || 1000000
    const dailySalary = Math.floor(testSalary / totalWorkingDays)
    const endOfMonthAcompte = dailySalary * totalWorkingDays
    
    console.log("🎯 Simulation fin de mois:")
    console.log("  - Salaire net:", testSalary.toLocaleString(), "GNF")
    console.log("  - Total jours ouvrables:", totalWorkingDays)
    console.log("  - Salaire par jour ouvrable:", dailySalary.toLocaleString(), "GNF")
    console.log("  - Acompte à la fin du mois:", endOfMonthAcompte.toLocaleString(), "GNF")
    console.log("  - Différence:", (testSalary - endOfMonthAcompte).toLocaleString(), "GNF")
    console.log("  - Pourcentage de précision:", ((endOfMonthAcompte / testSalary) * 100).toFixed(2) + "%")
  }

  // Fonction de test pour vérifier le calcul actuel de 2,500,000 GNF
  const testCurrentCalculation = () => {
    console.log("🔍 Test du calcul actuel (2,500,000 GNF avec 21 jours)...")
    
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const currentDay = today.getDate()
    
    const workingDaysElapsed = getWorkingDaysElapsed(currentYear, currentMonth, currentDay)
    const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
    
    // Calculer le salaire net estimé basé sur l'acompte actuel
    const currentAcompte = 2500000 // Acompte actuel
    const estimatedDailySalary = Math.floor(currentAcompte / workingDaysElapsed)
    const estimatedSalaryNet = estimatedDailySalary * totalWorkingDays
    
    console.log("🔍 Analyse du calcul actuel:")
    console.log("  - Acompte disponible actuel:", currentAcompte.toLocaleString(), "GNF")
    console.log("  - Jours ouvrables écoulés:", workingDaysElapsed)
    console.log("  - Total jours ouvrables du mois:", totalWorkingDays)
    console.log("  - Salaire par jour ouvrable estimé:", estimatedDailySalary.toLocaleString(), "GNF")
    console.log("  - Salaire net estimé:", estimatedSalaryNet.toLocaleString(), "GNF")
    console.log("  - Vérification: (Salaire net / Total jours) × Jours écoulés =", 
      Math.floor(estimatedSalaryNet / totalWorkingDays * workingDaysElapsed).toLocaleString(), "GNF")
    
    // Vérifier avec le vrai salaire de l'utilisateur
    if (user.salaireNet) {
      const realDailySalary = Math.floor(user.salaireNet / totalWorkingDays)
      const realAcompte = realDailySalary * workingDaysElapsed
      
      console.log("💰 Comparaison avec le vrai salaire:")
      console.log("  - Vrai salaire net:", user.salaireNet.toLocaleString(), "GNF")
      console.log("  - Vrai salaire par jour:", realDailySalary.toLocaleString(), "GNF")
      console.log("  - Vrai acompte calculé:", realAcompte.toLocaleString(), "GNF")
      console.log("  - Différence:", (currentAcompte - realAcompte).toLocaleString(), "GNF")
    }
  }

  // Récupérer les demandes d'avance
  useEffect(() => {
    const fetchAdvanceRequests = async () => {
      if (!user.employeId) {
        console.log("⚠️ employeId non défini, impossible de récupérer les demandes")
        setLoading(false)
        return
      }
      
      try {
        console.log("🔍 Récupération des demandes pour employeId:", user.employeId)
        const response = await fetch(`/api/salary-advance/request?employeId=${user.employeId}`)
        console.log("📡 Response status:", response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log("📦 Données complètes reçues:", data)
          console.log("📋 Demandes trouvées:", data.data)
          console.log("📊 Nombre de demandes:", data.data?.length || 0)
          
          if (data.data && data.data.length > 0) {
            console.log("🔍 Première demande:", data.data[0])
            console.log("📋 Statuts des demandes:", data.data.map((d: any) => ({ id: d.id, statut: d.statut, montant: d.montant_demande })))
          }
          
          setAdvanceRequests(data.data || [])
        } else {
          console.error("❌ Erreur API:", response.status, response.statusText)
          const errorData = await response.json()
          console.error("❌ Détails erreur:", errorData)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvanceRequests()
  }, [user.employeId])

  console.log("user", user)
  console.log("user.salaireNet", user.salaireNet)
  //get total working days in month
  const totalWorkingDays = getTotalWorkingDaysInMonth(new Date().getFullYear(), new Date().getMonth())
  console.log("totalWorkingDays", totalWorkingDays)

  //get working days elapsed
  const workingDaysElapsed = getWorkingDaysElapsed(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  console.log("Nombre de jours ouvrables écoulés", workingDaysElapsed)
  
  // Calculer l'avance disponible dynamiquement
  const availableAdvance = user.salaireNet ? calculateAvailableAdvance(user.salaireNet) : 0

  // Trouver la demande d'avance active (approuvée)
  const activeAdvance = advanceRequests.find(request => request.statut === 'Validé')
  
  //la somme de toutes les demandes d'avance approuvées
  const totalAdvance = advanceRequests
    .filter(request => request.statut === 'Validé')
    .reduce((acc, request) => acc + (request.montant_demande as number), 0)
  
  const advanceValue = activeAdvance ? activeAdvance.montant_total : 0
  const advanceStatus = activeAdvance ? `${advanceRequests.filter(r => r.statut === 'Validé').length} avances en cours` : 'Aucune avance active'

  // Calculer tous les montants financiers avec la fonction utilitaire
  const financialAmounts = user.salaireNet ? calculateFinancialAmounts(user.salaireNet, advanceRequests) : null
  
  //get remaining salary - CORRIGÉ: Salaire restant = Salaire net - Avance actif
  const remainingSalary = financialAmounts?.remainingSalary || 0
  
  console.log("💰 Calculs financiers:")
  if (financialAmounts) {
    console.log("  - Salaire net:", financialAmounts.salaireNet.toLocaleString(), "GNF")
    console.log("  - Total avances actives:", financialAmounts.totalActiveAdvances.toLocaleString(), "GNF")
    console.log("  - Salaire restant:", financialAmounts.remainingSalary.toLocaleString(), "GNF")
    console.log("  - Avance disponible:", financialAmounts.acompteDisponible.toLocaleString(), "GNF")
    console.log("  - Limite mensuelle (25%):", financialAmounts.monthlyLimit.toLocaleString(), "GNF")
    console.log("  - Avance restante ce mois:", financialAmounts.remainingMonthlyAdvance.toLocaleString(), "GNF")
  }

  console.log("activeAdvance", activeAdvance)
  console.log("advanceValue", advanceValue)
  console.log("advanceStatus", advanceStatus)

  const stats = [
    {
      title: "Salaire net",
      value: user.salaireNet?.toLocaleString() || "0",
      remaining: remainingSalary.toLocaleString(),
      currency: "GNF",
      icon: null,
      change: "Mise à jour ce mois",
      trend: "neutral" as const,
      color: "from-[#FF671E] to-[#FF8E53]",
      pulse: true,
      showRemaining: true,
      hideable: true
    },
    {
      title: "Acompte disponible",
      value: financialAmounts?.acompteDisponible.toLocaleString() || "0",
      remaining: "",
      currency: "GNF",
      icon: <IconCreditCard className="h-6 w-6" />,
      change: `Basé sur ${financialAmounts?.workingDaysElapsed || 0} jours de travail écoulés`,
      trend: "neutral" as const,
      color: "from-[#010D3E] to-[#1A3A8F]",
      pulse: false,
      showRemaining: false
    },
    {
      title: "Avance actif",
      value: financialAmounts?.totalActiveAdvances.toLocaleString() || "0",
      remaining: "",
      currency: "GNF",
      icon: <IconArrowUpRight className="h-6 w-6" />,
      change: loading ? "Chargement..." : advanceStatus,
      trend: "neutral" as const,
      color: "from-[#FF671E] to-[#FF8E53]",
      pulse: (financialAmounts?.totalActiveAdvances || 0) > 0 ? true : false,
      showRemaining: false
    },
    // {
    //   title: "Prêts actifs",
    //   value: "0",
    //   remaining: "",
    //   currency: "GNF",
    //   icon: <IconReceipt className="h-6 w-6" />,
    //   change: "0 prêt en cours",
    //   trend: "neutral" as const,
    //   color: "from-[#010D3E] to-[#1A3A8F]",
    //   pulse: false,
    //   showRemaining: false
    // }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <StatCard 
              title={stat.title}
              value={stat.value}
              remaining={stat.remaining}
              currency={stat.currency}
              icon={stat.icon}
              change={stat.change}
              trend={stat.trend}
              color={stat.color}
              pulse={stat.pulse}
              showRemaining={stat.showRemaining}
              hideable={stat.hideable}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  remaining: string
  currency: string
  icon: React.ReactNode | null
  change: string
  trend: "up" | "down" | "neutral"
  color: string
  pulse: boolean
  showRemaining: boolean
  hideable?: boolean
}

function StatCard({ title, value, remaining, currency, icon, change, trend, color, pulse, showRemaining, hideable = false }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  // Seulement masquer par défaut si hideable est true
  const [isVisible, setIsVisible] = useState(!hideable)
  const controls = useAnimation()
  const trendConfig = {
    up: { 
      color: "text-emerald-500", 
      icon: <IconTrendingUp className="h-4 w-4" />,
      badge: "bg-emerald-500/10 text-emerald-500"
    },
    down: { 
      color: "text-red-500", 
      icon: <IconTrendingUp className="h-4 w-4 rotate-180" />,
      badge: "bg-red-500/10 text-red-500"
    },
    neutral: { 
      color: "text-gray-500 dark:text-gray-400", 
      icon: null,
      badge: "bg-gray-500/10 text-gray-500 dark:text-gray-400"
    }
  }

  useEffect(() => {
    if (isHovered) {
      controls.start({
        opacity: [0, 0.5, 0],
        y: [0, -10, 0],
        transition: { duration: 1.5 }
      })
    }
  }, [isHovered, controls])

  return (
    <div 
      className="relative justify-between group h-full w-full "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de particules au survol */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={controls}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: '6px',
                height: '6px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5],
                transition: { 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Effet de halo au survol */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl opacity-0 group-hover:opacity-15`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 0.15 : 0,
          transition: { duration: 0.4 }
        }}
      />

      {/* Carte principale */}
      <div className="h-full bg-[#010D3E]/90 backdrop-blur-sm p-5 rounded-xl border border-[#1A3A8F] shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
        {/* Animation de fond */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0`}
          animate={{
            opacity: isHovered ? 0.03 : 0,
            transition: { duration: 0.6 }
          }}
        />

        {/* Effet de brillance */}
        {pulse && (
          <motion.div
            className="absolute top-0 right-0 p-1"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.4, 0.8],
              transition: { 
                duration: 2,
                repeat: Infinity
              }
            }}
          >
            <IconSparkles className="h-5 w-5 text-[#FF671E]" />
          </motion.div>
        )}

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className={showRemaining ? "" : "mb-8"}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
                  <div className="flex items-center space-x-2">
                    <motion.p 
                      className="text-2xl font-bold text-white"
                      animate={{
                        scale: isHovered ? [1, 1.02, 1] : 1,
                        transition: { duration: 0.5 }
                      }}
                    >
                      {isVisible ? (
                        <>{value} <span className="text-lg font-medium">{currency}</span></>
                      ) : (
                        <span className="text-xl">••••••</span>
                      )}
                    </motion.p>
                    {hideable && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsVisible(!isVisible);
                        }}
                        className="p-1 rounded-full hover:bg-gray-100/10 transition-colors flex items-center justify-center"
                        aria-label={isVisible ? "Masquer le montant" : "Afficher le montant"}
                      >
                        {isVisible ? (
                          <IconEye className="h-5 w-5 text-gray-300" />
                        ) : (
                          <IconEyeOff className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
              {showRemaining && remaining && (
                <motion.div 
                  className="mt-2 bg-[#010D3E]/50 p-2 rounded-lg border border-[#1A3A8F]/50"
                  animate={{
                    scale: isHovered ? [1, 1.02, 1] : 1,
                    transition: { duration: 0.5 }
                  }}
                >
                  <p className="text-xs text-gray-300">Salaire restant</p>
                  <p className="text-lg font-bold text-white">
                    {isVisible ? (
                      <>{remaining} <span className="text-sm font-medium">{currency}</span></>
                    ) : (
                      <span className="text-base">••••••</span>
                    )}
                  </p>
                </motion.div>
              )}
            </div>
            
            {/* Icône avec animation ou texte GNF */}
            <motion.div 
              className={`bg-gradient-to-br ${color} p-2 rounded-lg text-white shadow-md flex items-center justify-center min-w-[40px] min-h-[40px]`}
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {icon ? (
                icon
              ) : (
                <span className="text-lg font-bold">{currency}</span>
              )}
            </motion.div>
          </div>

          {/* Ligne de tendance - Position uniforme */}
          <motion.div 
            className="mt-4 pt-3 border-t border-[#1A3A8F] flex items-center gap-2"
            animate={{
              y: isHovered ? [0, -2, 0] : 0,
              transition: { duration: 0.5 }
            }}
          >
            {trend !== "neutral" && (
              <motion.div
                className={`p-1 rounded-md ${trendConfig[trend].badge}`}
                animate={{
                  scale: isHovered ? [1, 1.1, 1] : 1,
                  transition: { duration: 0.5 }
                }}
              >
                {trendConfig[trend].icon}
              </motion.div>
            )}
            <span className={`text-sm text-gray-300`}>
              {change}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}