"use client"

import { UserWithEmployeData } from "@/types/employe"
import { IconArrowUpRight, IconCreditCard, IconReceipt, IconSparkles, IconTrendingUp, IconEye, IconEyeOff, IconShieldLock } from "@tabler/icons-react"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { PasswordVerificationModal } from "@/components/ui/password-verification-modal"
import { usePasswordVerification } from "@/hooks/usePasswordVerification"


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
  statut: 'En attente' | 'Approuvée' | 'Rejetée'
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
function calculateFinancialAmounts(salaireNet: number, advanceRequests: any[]) {
  // 1. Acompte disponible (basé sur les jours ouvrables écoulés)
  const acompteDisponible = calculateAvailableAdvance(salaireNet)
  
  // 2. Total des avances actives (approuvées)
  const totalActiveAdvances = advanceRequests
    .filter(request => request.statut === 'Approuvée')
    .reduce((acc, request) => acc + (request.montant_demande as number), 0)
  
  // 3. Salaire restant = Salaire net - Avances actives
  const remainingSalary = salaireNet - totalActiveAdvances
  
  // 4. Limite mensuelle pour avance sur salaire (30% du salaire) - pour les demandes d'avance
  const monthlyLimit = Math.floor(salaireNet * 0.30)
  
  // 5. Avance restante ce mois (limite - avances déjà utilisées)
  const remainingMonthlyAdvance = Math.max(0, monthlyLimit - totalActiveAdvances)
  
  return {
    salaireNet,
    acompteDisponible, // Acompte basé sur les jours écoulés
    totalActiveAdvances,
    remainingSalary,
    monthlyLimit, // Limite pour avance sur salaire (30%)
    remainingMonthlyAdvance,
    workingDaysElapsed: getWorkingDaysElapsed(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    totalWorkingDays: getTotalWorkingDaysInMonth(new Date().getFullYear(), new Date().getMonth())
  }
}

export function ProfileStats({ user }: { user: UserWithEmployeData }) {
  const [loading, setLoading] = useState(true)
  const [financialData, setFinancialData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Charger les données financières depuis l'Edge Function
  useEffect(() => {
    const loadFinancialData = async () => {
      try {
        setLoading(true)
        setError(null)
        
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
            console.log('📊 Données financières récupérées:', result.data)
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
        setLoading(false)
      }
    }
    
    loadFinancialData()
  }, [])
  
  // Forcer le calcul des jours ouvrables après le chargement des données financières
  useEffect(() => {
    if (financialData) {
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
        
        console.log('🚀 Calcul FORCÉ des jours ouvrables dans profile-stats:', {
          currentYear,
          currentMonth,
          currentDay,
          workingDaysElapsed,
          totalWorkingDays,
          workingDaysPercentage
        })
        
        // Mettre à jour financialData avec les jours ouvrables calculés
        setFinancialData(prev => prev ? {
          ...prev,
          workingDaysElapsed,
          totalWorkingDays,
          workingDaysPercentage
        } : null)
      }
      
      // Exécuter immédiatement
      calculateWorkingDays()
      
      // Et aussi après un délai pour s'assurer que c'est fait
      const timer = setTimeout(calculateWorkingDays, 500)
      
      return () => clearTimeout(timer)
    }
  }, [financialData])
  
  // Hook pour la vérification par mot de passe
  const {
    isModalOpen,
    isVerified,
    isLoading: isVerifying,
    verifyPassword,
    openVerificationModal,
    closeVerificationModal,
    resetVerification
  } = usePasswordVerification({
    onSuccess: () => {
      // La vérification a réussi, on peut afficher les informations
    },
    onError: (error) => {
      // Gérer l'erreur si nécessaire
    }
  });

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
    console.log("  - Limite d'avance (30%):", limiteAvance.toLocaleString(), "GNF")
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

  // Récupération des demandes d'avance maintenant gérée par le hook useEmployeeDemands
  useEffect(() => {
    console.log("📋 Récupération des demandes gérée par le hook useEmployeeDemands")
  }, [])

  // Réinitialiser la vérification quand l'utilisateur change
  useEffect(() => {
    resetVerification();
  }, [user.id, resetVerification]);

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

  // Utiliser les données de l'Edge Function pour les avances actives
  const activeAdvance = financialData?.financial?.avanceActif || 0
  
  //la somme de toutes les demandes d'avance approuvées (depuis l'Edge Function)
  const totalAdvance = financialData?.financial?.avanceActif || 0
  
  // Utiliser les données de l'Edge Function pour le statut des avances
  const nombreAvances = financialData?.financial?.nombreAvancesValidees || 0
  const advanceStatus = financialData?.financial ? 
    (financialData.financial.avanceActif > 0 ? 
      `${nombreAvances} avance(s) active(s)` : 
      'Aucune avance active') : 
    (loading ? 'Chargement...' : 'Données non disponibles')

  // Utiliser les données financières de l'Edge Function
  const financialAmounts = financialData?.financial ? {
    salaireNet: financialData.financial.salaireNet || 0,
    acompteDisponible: financialData.financial.acompteDisponible || 0,
    totalActiveAdvances: financialData.financial.avanceActif || 0,
    remainingSalary: financialData.financial.salaireRestant || 0,
    monthlyLimit: Math.floor((financialData.financial.salaireNet || 0) * 0.30),
    remainingMonthlyAdvance: financialData.financial.avanceDisponible || 0,
    workingDaysElapsed: financialData.workingDaysElapsed || 0, // Utiliser les jours calculés
    totalWorkingDays: financialData.totalWorkingDays || 0 // Utiliser les jours calculés
  } : null
  
  //get remaining salary - CORRIGÉ: Salaire restant = Salaire net - Avance actif
  const remainingSalary = financialAmounts?.remainingSalary || 0
  
  console.log("💰 Calculs financiers:")
  if (financialAmounts) {
    console.log("  - Salaire net:", financialAmounts.salaireNet.toLocaleString(), "GNF")
    console.log("  - Total avances actives:", financialAmounts.totalActiveAdvances.toLocaleString(), "GNF")
    console.log("  - Salaire restant:", financialAmounts.remainingSalary.toLocaleString(), "GNF")
    console.log("  - Avance disponible:", financialAmounts.acompteDisponible.toLocaleString(), "GNF")
    console.log("  - Limite mensuelle (30%):", financialAmounts.monthlyLimit.toLocaleString(), "GNF")
    console.log("  - Avance restante ce mois:", financialAmounts.remainingMonthlyAdvance.toLocaleString(), "GNF")
  }

  console.log("activeAdvance", activeAdvance)
  console.log("totalAdvance", totalAdvance)
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
               isVerified={isVerified}
               onRequestVerification={openVerificationModal}
               onResetVerification={resetVerification}
             />
          </motion.div>
        ))}
      </div>
      
      {/* Modal de vérification par mot de passe */}
      <PasswordVerificationModal
        isOpen={isModalOpen}
        onClose={closeVerificationModal}
        onSuccess={() => {
          // La vérification a réussi
        }}
        onVerifyPassword={verifyPassword}
        title="Vérification du mot de passe"
        message="Entrez votre mot de passe pour afficher votre salaire et informations financières"
      />
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
  isVerified?: boolean
  onRequestVerification?: () => void
  onResetVerification?: () => void
}

function StatCard({ title, value, remaining, currency, icon, change, trend, color, pulse, showRemaining, hideable = false, isVerified = false, onRequestVerification, onResetVerification }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  // Seulement masquer par défaut si hideable est true et que l'utilisateur n'est pas vérifié
  const [isVisible, setIsVisible] = useState(!hideable || isVerified)
  const controls = useAnimation()

  // Synchroniser isVisible avec isVerified quand isVerified change
  useEffect(() => {
    console.log('👁️ useEffect StatCard - isVerified:', isVerified, 'hideable:', hideable);
    if (hideable) {
      console.log('🔓 Mise à jour isVisible à:', isVerified);
      setIsVisible(isVerified)
    }
  }, [isVerified, hideable])

  // Fermeture automatique après 5 minutes d'inactivité
  useEffect(() => {
    if (hideable && isVerified && isVisible) {
      console.log('⏰ Démarrage du timer de fermeture automatique (5 minutes)');
      
      const timeoutId = setTimeout(() => {
        console.log('⏰ Fermeture automatique après 5 minutes d\'inactivité');
        setIsVisible(false);
        onResetVerification?.();
      }, 5 * 60 * 1000); // 5 minutes

      // Réinitialiser le timer sur les interactions utilisateur
      const resetTimer = () => {
        console.log('🔄 Réinitialisation du timer d\'inactivité');
        clearTimeout(timeoutId);
        const newTimeoutId = setTimeout(() => {
          console.log('⏰ Fermeture automatique après 5 minutes d\'inactivité');
          setIsVisible(false);
          onResetVerification?.();
        }, 5 * 60 * 1000);
        return newTimeoutId;
      };

      // Écouter les événements d'interaction utilisateur
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      let currentTimeoutId = timeoutId;

      const handleUserActivity = () => {
        currentTimeoutId = resetTimer();
      };

      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true);
      });

      return () => {
        clearTimeout(currentTimeoutId);
        events.forEach(event => {
          document.removeEventListener(event, handleUserActivity, true);
        });
      };
    }
  }, [hideable, isVerified, isVisible, onResetVerification]);
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
                       {(() => {
                         console.log('🎯 Rendu StatCard - isVisible:', isVisible, 'title:', title);
                         return isVisible ? (
                           <>{value} <span className="text-lg font-medium">{currency}</span></>
                         ) : (
                           <span className="text-xl">••••••</span>
                         );
                       })()}
                     </motion.p>
                    {hideable && (
                                             <motion.button 
                         onClick={(e) => {
                           console.log('👁️ Clic sur l\'icône œil - isVerified:', isVerified, 'hideable:', hideable);
                           e.stopPropagation();
                           if (hideable) {
                             // Pour les cartes protégées, toujours demander la vérification
                             if (!isVerified) {
                               console.log('🔐 Ouverture du modal de vérification...');
                               onRequestVerification?.();
                             } else {
                               // Si déjà vérifié, masquer et réinitialiser la vérification
                               console.log('🔒 Masquage et réinitialisation de la vérification');
                               setIsVisible(false);
                               onResetVerification?.(); // Réinitialiser la vérification
                             }
                           } else {
                             // Pour les cartes non protégées, basculer normalement
                             console.log('🔄 Basculement de la visibilité');
                             setIsVisible(!isVisible);
                           }
                         }}
                         onMouseDown={(e) => {
                           console.log('👁️ MouseDown sur l\'icône œil');
                         }}
                         onMouseUp={(e) => {
                           console.log('👁️ MouseUp sur l\'icône œil');
                         }}
                        className="p-1 rounded-full hover:bg-gray-100/10 transition-colors flex items-center justify-center"
                        aria-label={isVisible ? "Masquer le montant" : "Afficher le montant"}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isVisible ? (
                          <IconEye className="h-5 w-5 text-gray-300" />
                        ) : (
                          <IconEyeOff className="h-5 w-5 text-gray-400" />
                        )}
                      </motion.button>
                    )}
                  </div>
                  
                  {/* Indicateur de protection */}
                  {hideable && !isVerified && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2"
                    >
                      <div className="flex items-center gap-1">
                        <IconShieldLock className="h-4 w-4 text-[#FF671E]" />
                        <span className="text-xs text-gray-400 font-medium">Cliquez pour vérifier</span>
                      </div>
                    </motion.div>
                  )}
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