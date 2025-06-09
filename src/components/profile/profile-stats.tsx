"use client"

import { UserWithEmployeData } from "@/types/employe"
import { IconArrowUpRight, IconCreditCard, IconReceipt, IconSparkles, IconTrendingUp } from "@tabler/icons-react"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

// Type pour les demandes d'avance
interface AdvanceRequest {
  statut: string
  montantDemande: number
  [key: string]: unknown
}

// Fonction pour calculer l'avance disponible
function calculateAvailableAdvance(salaireNet: number): number {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  
  // Calculer le nombre de jours ouvrables écoulés ce mois
  const workingDaysElapsed = getWorkingDaysElapsed(currentYear, currentMonth, today.getDate())
  
  // Calculer le total de jours ouvrables du mois
  const totalWorkingDays = getTotalWorkingDaysInMonth(currentYear, currentMonth)
  
  // Calculer le pourcentage d'avance disponible (maximum 25% du salaire)
  // const maxAdvancePercentage = 0.25
  const workingDaysPercentage = workingDaysElapsed / totalWorkingDays
  // const availablePercentage = Math.min(workingDaysPercentage * maxAdvancePercentage, maxAdvancePercentage)
  
  return Math.floor(salaireNet * workingDaysPercentage)
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

export function ProfileStats({ user }: { user: UserWithEmployeData }) {
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Récupérer les demandes d'avance
  useEffect(() => {
    const fetchAdvanceRequests = async () => {
      if (!user.employeId) return
      
      try {
        const response = await fetch(`/api/salary-advance/request?employeId=${user.employeId}`)
        if (response.ok) {
          const data = await response.json()
          console.log("data", data.demandes)
          setAdvanceRequests(data.demandes || [])
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

  //get remaining salary
  const remainingSalary = user.salaireNet ? user.salaireNet - availableAdvance : 0
  console.log("Salaire restant", remainingSalary)

  // Trouver la demande d'avance active (approuvée)
  
  const activeAdvance = advanceRequests.find(request => request.statut === 'approuve')
  const advanceValue = activeAdvance ? activeAdvance.montantDemande : 0
  const advanceStatus = activeAdvance ? `1 avance en cours` : 'Aucune avance active'

  console.log("activeAdvance", activeAdvance)
  console.log("advanceValue", advanceValue)
  console.log("advanceStatus", advanceStatus)

  const stats = [
    {
      title: "Salaire net",
      value: user.salaireNet?.toLocaleString() || "0",
      remaining: "1,750,000",
      currency: "GNF",
      icon: null,
      change: "Mise à jour ce mois",
      trend: "neutral" as const,
      color: "from-[#FF671E] to-[#FF8E53]",
      pulse: true,
      showRemaining: true
    },
    {
      title: "Acompte disponible",
      value: availableAdvance.toLocaleString(),
      remaining: "",
      currency: "GNF",
      icon: <IconCreditCard className="h-6 w-6" />,
      change: "Basé sur les jours ouvrables",
      trend: "neutral" as const,
      color: "from-[#010D3E] to-[#1A3A8F]",
      pulse: false,
      showRemaining: false
    },
    {
      title: "Avance actif",
      value: activeAdvance ? activeAdvance.montantDemande.toLocaleString() : "0",
      remaining: "",
      currency: "GNF",
      icon: <IconArrowUpRight className="h-6 w-6" />,
      change: loading ? "Chargement..." : advanceStatus,
      trend: "neutral" as const,
      color: "from-[#FF671E] to-[#FF8E53]",
      pulse: activeAdvance ? true : false,
      showRemaining: false
    },
    {
      title: "Prêts actifs",
      value: "1,200,000",
      remaining: "",
      currency: "GNF",
      icon: <IconReceipt className="h-6 w-6" />,
      change: "1 prêt en cours",
      trend: "neutral" as const,
      color: "from-[#010D3E] to-[#1A3A8F]",
      pulse: false,
      showRemaining: false
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
          />
        </motion.div>
      ))}
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
}

function StatCard({ title, value, remaining, currency, icon, change, trend, color, pulse, showRemaining }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
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
      className="relative group h-full"
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
              <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
              <motion.p 
                className="text-2xl font-bold text-white"
                animate={{
                  scale: isHovered ? [1, 1.02, 1] : 1,
                  transition: { duration: 0.5 }
                }}
              >
                {value} <span className="text-lg font-medium">{currency}</span>
              </motion.p>
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
                    {remaining} <span className="text-sm font-medium">{currency}</span>
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