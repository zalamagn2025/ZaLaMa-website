"use client"

import { IconCreditCard, IconReceipt, IconArrowUpRight, IconTrendingUp, IconSparkles } from "@tabler/icons-react"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

export function ProfileStats() {
  const stats = [
    {
      title: "Salaire net",
      value: "2,500,000",
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
      value: "750,000",
      remaining: "",
      currency: "GNF",
      icon: <IconCreditCard className="h-6 w-6" />,
      change: "10j",
      trend: "neutral" as const,
      color: "from-[#010D3E] to-[#1A3A8F]",
      pulse: false,
      showRemaining: false
    },
    {
      title: "Avance actif",
      value: "5,000,000",
      remaining: "",
      currency: "GNF",
      icon: <IconArrowUpRight className="h-6 w-6" />,
      change: "1 avance en cours",
      trend: "neutral" as const,
      color: "from-[#FF671E] to-[#FF8E53]",
      pulse: true,
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